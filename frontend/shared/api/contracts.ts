import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(80)
});

export const learningStateSchema = z.enum(["FOCUSED", "CURIOUS", "BUILDING", "STUCK", "RESTING"]);

export const profileUpdateSchema = z.object({
  learningState: learningStateSchema,
  energyLevel: z.number().int().min(0).max(100),
  learningGoal: z.string().min(1).max(160),
  nextStep: z.string().min(1).max(240)
});

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type ProfileUpdatePayload = z.infer<typeof profileUpdateSchema>;
export type LearningState = z.infer<typeof learningStateSchema>;

export type UserSummary = {
  id: string;
  email: string;
  displayName: string;
  role: "USER";
  createdAt: string;
};

export type Profile = {
  id: string;
  learningState: LearningState;
  energyLevel: number;
  learningGoal: string;
  nextStep: string;
  completion: number;
  updatedAt: string;
};

export type LearningStateOption = {
  value: LearningState;
  label: string;
  description: string;
};

export type ApiProblem = {
  title?: string;
  detail?: string;
  status?: number;
  errors?: string[];
};
