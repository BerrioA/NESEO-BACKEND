import { Router } from "express";
import {
  login,
  logout,
  profile,
  refreshToken,
} from "../../controllers/auth/userAuthentication.js";
import { requireRefreshToken } from "../../middleware/auth/requireRefreshToken.js";
import { requireToken } from "../../middleware/auth/requireToken.js";
import { validationLogin } from "../../middleware/validations/authValidations/authValidations.js";

const router = Router();

router.post("/login", validationLogin, login);
router.get("/logout", logout);
router.get("/refresh", requireRefreshToken, refreshToken);
router.get("/profile", requireToken, profile);

export default router;
