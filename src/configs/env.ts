import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGO_URI: z.string(),
  CORS_ORIGIN: z.string().default("http://localhost:4200"),
});

export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
