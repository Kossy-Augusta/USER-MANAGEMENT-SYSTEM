import { allowedOrigins } from "./allowedOrigin";

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allowed: boolean) => void
  ) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS"), false); // Deny the request
    }
  },
  optionSuccessStatus: 200
};