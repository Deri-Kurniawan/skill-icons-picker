import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";
 
export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_BASE_API_URL: z.string().min(1).default("https://skillicons.dev"),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});