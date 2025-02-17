"use server";

import { db } from "../lib/db";
import { ImageUploadFormState } from "../types";

export const createUserImageConfiguration = async (
  userId: string,
  details: ImageUploadFormState
) => {
  const { cloudName, apiKey, apiSecret } = details;
  const cloudinaryConfig = await db.cloudinaryConfig.upsert({
    where: { userId: +userId },
    update: { cloudName, apiKey, apiSecret },
    create: {
      cloudName,
      apiKey,
      apiSecret,
      user: { connect: { id: +userId } },
    },
  });
  return cloudinaryConfig;
};
