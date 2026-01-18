"use server";

import { db } from "@/lib/db";
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
  console.log("topicUpdates", topicUpdates);
  console.log("hashtagUpdates", hashtagUpdates);
  console.log("deletedHashtags", deletedHashtags);
  try {
    // 1. Update Topics
    for (const update of topicUpdates) {
      await db.topic.updateMany({
        where: { title: update.original },
        data: { title: update.current },
      });
    }

    // 2. Update Hashtags
    const topicsWithHashtags = await db.topic.findMany({
      where: { hashtags: { not: null } },
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
