import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { currentUser } from "@/src/lib/authentication";
import { getUserImageConfigurationById } from "@/src/data/image-upload";
import { CloudinaryConfigSchema } from "@/src/schemas/imageUploadForm.schema";
import { handleDecryption } from "@/src/lib/crypto";

// Force the Node.js runtime (required for packages like Cloudinary)
export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: null,
      },
      { status: 401 }
    );
  }

  try {
    // Get user current configuration
    const userConfiguration = await getUserImageConfigurationById(userId);

    const validatedFields = CloudinaryConfigSchema.safeParse(userConfiguration);

    if (!validatedFields.success || !userConfiguration.initVector) {
      return NextResponse.json(
        {
          status: "error",
          message: "Kindly update your image upload settings in your Profile.",
          data: null,
        },
        { status: 401 }
      );
    }

    const { cloudName, apiKey, apiSecret } = validatedFields.data;
    const decryptedData = await handleDecryption({
      encryptedData: apiSecret,
      initVector: userConfiguration.initVector,
    });

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: decryptedData,
    });

    // Parse the incoming form data. Editor.js sends the file under the "image" field by default.
    const formData = await req.formData();
    const fileField = formData.get("image");

    if (!fileField || typeof fileField === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the File (Web API File) to a Node.js Buffer.
    const buffer = Buffer.from(await fileField.arrayBuffer());

    // Helper function to upload the buffer to Cloudinary using an upload stream.
    const streamUpload = (buffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Study_Time_Images" }, // Optional: specify a folder in your Cloudinary account
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(buffer);
      });
    };

    // Upload the file and wait for the result
    const result = await streamUpload(buffer);

    // Return the JSON response in the format Editor.js expects.
    return NextResponse.json({
      success: 1,
      file: {
        url: result.secure_url,
        // Include any additional fields (e.g., width, height) if desired.
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file to Cloudinary" },
      { status: 500 }
    );
  }
}
