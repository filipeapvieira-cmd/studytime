import { z } from "zod";

export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(8);