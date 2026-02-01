"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/src/lib/authentication";
import type { HashtagItem, TopicItem } from "../types";

interface RequestBody {
  topicUpdates: TopicItem[];
  hashtagUpdates: HashtagItem[];
  deletedHashtags: string[];
}

export const updateTopicsAndHashtags = async ({
  topicUpdates,
  hashtagUpdates,
  deletedHashtags,
}: RequestBody) => {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "Unauthorized access. Please log in." };
  }

  try {
    const userId = Number(user.id);

    // Get user's session IDs for scoping updates
    const userSessions = await db.studySession.findMany({
      where: { userId },
      select: { id: true },
    });
    const userSessionIds = userSessions.map((s) => s.id);

    // 1. Update Topics - Only update user's own topics
    for (const update of topicUpdates) {
      await db.topic.updateMany({
        where: {
          title: update.original,
          sessionId: { in: userSessionIds },
        },
        data: { title: update.current },
      });
    }

    // 2. Update Hashtags - Only update user's own topics
    const topicsWithHashtags = await db.topic.findMany({
      where: {
        hashtags: { not: null },
        sessionId: { in: userSessionIds },
      },
      select: { id: true, hashtags: true },
    });

    for (const topic of topicsWithHashtags) {
      if (topic.hashtags) {
        let tags = topic.hashtags.split(" ").filter(Boolean);

        hashtagUpdates.forEach(({ original, current }) => {
          tags = tags.map((tag) => (tag === original ? current : tag));
        });

        tags = tags.filter((tag) => !deletedHashtags.includes(tag));

        const updatedTagsString = tags.join(" ");

        await db.topic.update({
          where: { id: topic.id },
          data: { hashtags: updatedTagsString },
        });
      }
    }

    return { message: "Updates applied successfully" };
  } catch (error) {
    console.error("Error updating topics/hashtags:", error);
    return { error: "Internal server error" };
  }
};
