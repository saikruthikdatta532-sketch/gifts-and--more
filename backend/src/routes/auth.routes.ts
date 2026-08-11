import { Router } from "express";
import passport from "passport";
import { getMe, logout, googleCallbackHandler } from "../controllers/auth.controller";

const router = Router();

router.get("/me", getMe);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  googleCallbackHandler
);

router.post("/logout", logout);

export default router;
