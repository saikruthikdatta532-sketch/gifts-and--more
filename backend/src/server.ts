import express from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import { env } from "./config/env";
import "./config/passport"; // registers Google strategy
import { generalLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import routes from "./routes";

const app = express();

// --- Security middleware ---
app.use(helmet());

const allowedOrigins = env.isProduction
  ? [env.FRONTEND_URL]
  : [env.FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (e.g. health checks) with no origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(generalLimiter);

// --- Sessions (for Passport Google OAuth) ---
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.isProduction,
      httpOnly: true,
      sameSite: env.isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- Health check (required by Render) ---
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// --- API routes ---
app.use("/api", routes);

// --- Error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});
