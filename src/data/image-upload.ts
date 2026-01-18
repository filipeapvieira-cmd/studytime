"use server";

import { db } from "../lib/db";
import type { ImageUploadFormState } from "../types";

export const createUserImageConfiguration = async (
  userId: string,
  details: ImageUploadFormState,
  initVector: string,
) => {
  const { cloudName, apiKey, apiSecret } = details;
  const cloudinaryConfig = await db.cloudinaryConfig.upsert({
    where: { userId: +userId },
    update: { cloudName, apiKey, apiSecret, iv: initVector },
    create: {
      cloudName,
      apiKey,
      apiSecret,
      iv: initVector,
      user: { connect: { id: +userId } },
    },
  });
  return cloudinaryConfig;
};

export const getUserImageConfigurationById = async (userId: string) => {
  const cloudinaryConfig = await db.cloudinaryConfig.findUnique({
    where: { userId: +userId },
  });
  const config = {
    cloudName: cloudinaryConfig?.cloudName,
    apiKey: cloudinaryConfig?.apiKey,
    apiSecret: cloudinaryConfig?.apiSecret,
    initVector: cloudinaryConfig?.iv,
  };
  return config;
};
