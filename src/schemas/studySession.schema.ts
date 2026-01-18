import { z } from "zod";

const DEFAULT_MESSAGE = "Did you forget to add content to your journal?";

const ContentJsonSchema = z
  .object({
    time: z.number({ required_error: DEFAULT_MESSAGE }),
    blocks: z.array(z.any()).min(1, {
      message: DEFAULT_MESSAGE,
    }),
    version: z.string({ required_error: DEFAULT_MESSAGE }),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: DEFAULT_MESSAGE,
  });

const TopicFormattedSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  title: z
    .string()
    .min(3, { message: "A Topic Subject is required. Please select one." }),
  hashtags: z.string().optional(),
  description: z.string().optional(),
  effectiveTimeOfStudy: z.number(),
  contentJson: ContentJsonSchema,
});

export const FullSessionLogSchema = z.object({
  startTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date(),
  ),
  endTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date(),
  ),
  pauseDuration: z.number(),
  feelingDescription: z.string().optional(),
  topics: z
    .array(TopicFormattedSchema)
    .min(1, { message: "At least one topic is required" }),
});
