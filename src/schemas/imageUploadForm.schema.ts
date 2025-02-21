import { z } from "zod";

export const CloudinaryConfigSchema = z.object({
  cloudName: z
    .string()
    .min(1, "Cloud name is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid cloud name format"),

  apiKey: z
    .string()
    .min(10, "API Key must be at least 10 characters")
    .regex(/^\d+$/, "API Key must only contain numbers"),

  apiSecret: z.string().min(20, "API Secret must be at least 20 characters"),
});
