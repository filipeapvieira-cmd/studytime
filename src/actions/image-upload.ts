"use server";

import { currentUser } from "@/src/lib/authentication";
import { CloudinaryConfigSchema } from "../schemas/imageUploadForm.schema";

type ImageUploadSettingsActionState = {
  success?: string;
  errors?: {
    cloudName?: string[];
    apiKey?: string[];
    apiSecret?: string[];
  };
  generalError?: string;
};

export default async function imageUploadSettings(
  _prevState: ImageUploadSettingsActionState,
  formData: FormData
): Promise<ImageUploadSettingsActionState> {
  console.log("formData", formData);
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

  try {
    /*     const cloudinaryConfig = await db.cloudinaryConfig.upsert({
      where: { userId: +userId },
      update: { cloudName, apiKey, apiSecret },
      create: {
        cloudName,
        apiKey,
        apiSecret,
        user: { connect: { id: +userId } },
      },
    }); */
    return { success: "Image upload settings saved!" };
  } catch (error) {
    return {
      generalError:
        "Unfortunately, we could not save your settings. Please try again later.",
    };
  }
}
