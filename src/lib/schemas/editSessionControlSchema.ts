import { z } from "zod";

const timeRegex = /^(\d{2}:\d{2}(:\d{2})?)$/;

export const editSessionToolbarSchema = z.object({
  startTime: z.string().regex(timeRegex, {
    message: "Start Time must be in HH:mm or HH:mm:ss format",
  }),
  pauseDuration: z.string().regex(timeRegex, {
    message: "Pause Duration must be in HH:mm or HH:mm:ss format",
  }),
  endTime: z.string().regex(timeRegex, {
    message: "End Time must be in HH:mm or HH:mm:ss format",
  }),
  effectiveTime: z.string().regex(timeRegex, {
    message: "Effective Time must be in HH:mm or HH:mm:ss format",
  }),
});
