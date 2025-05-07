import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  registerUsers,
  updateUser,
} from "../../controllers/users/userController.js";
import {
  validationIdUser,
  validationRegisterUsers,
  validationUpdateUser,
} from "../../middleware/validations/usersValidations/usersValidations.js";
import { requireToken } from "../../middleware/auth/requireToken.js";
import {
  verifyAdmin,
  verifyAllUsers,
} from "../../middleware/auth/verifyUser.js";
import {
  resendEmailCode,
  verifyEmail,
} from "../../controllers/auth/userAuthentication.js";
import {
  timeOTP,
  validateResendCode,
} from "../../middleware/validations/timeOTPValidation/timeOTP.js";

const router = Router();

router.get("/", requireToken, verifyAdmin, getUsers);
router.post("/", validationRegisterUsers, registerUsers);
router.patch(
  "/:idUser",
  requireToken,
  verifyAllUsers,
  validationIdUser,
  validationUpdateUser,
  updateUser
);
router.delete(
  "/:idUser",
  requireToken,
  verifyAllUsers,
  validationIdUser,
  deleteUser
);
router.get("/:idUser", requireToken, verifyAllUsers, validationIdUser, getUser);
router.put("/verification-code", timeOTP, verifyEmail);
router.put("/resend-verification-code", validateResendCode,resendEmailCode);

export default router;
