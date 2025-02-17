"use server";

import { currentUser } from "@/src/lib/authentication";
import { CloudinaryConfigSchema } from "../schemas/imageUploadForm.schema";
import { ImageUploadSettingsActionState } from "../types";
import bcrypt from "bcryptjs";
import { createUserImageConfiguration } from "../data/image-upload";

export default async function imageUploadSettings(
  formData: FormData
): Promise<ImageUploadSettingsActionState> {
  const user = await currentUser();
  const userId = user?.id;

  if (!user || !userId) {
    return { generalError: "Please login to proceed." };
  }

  const validatedFields = CloudinaryConfigSchema.safeParse({
    cloudName: formData.get("cloudName"),
    apiKey: formData.get("apiKey"),
    apiSecret: formData.get("apiSecret"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: fieldErrors,
    };
  }

  const { cloudName, apiKey, apiSecret } = validatedFields.data;
  const hashedApiSecret = await bcrypt.hash(apiSecret, 10);

  try {
    await createUserImageConfiguration(userId, {
      cloudName,
      apiKey,
      apiSecret: hashedApiSecret,
    });
    return { success: "Image upload settings saved!" };
  } catch (error) {
    return {
      generalError:
        "Unfortunately, we could not save your settings. Please try again later.",
    };
  }
}
