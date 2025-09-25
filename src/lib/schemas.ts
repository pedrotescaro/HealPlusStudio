import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  specialty: z.string().optional(),
  crm_coren: z.string().optional(),
});
