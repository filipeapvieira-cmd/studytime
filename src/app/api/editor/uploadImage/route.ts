import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Force the Node.js runtime (required for packages like Cloudinary)
export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
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
          { folder: "Study Time Images" }, // Optional: specify a folder in your Cloudinary account
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
