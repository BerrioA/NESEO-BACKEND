import { Router } from "express";
import {
  deleteLabs,
  getLab,
  getLabs,
  registerLabs,
  updateLabs,
} from "../../controllers/labs/labsController.js";
import {
  validationIdLab,
  validationRegisterLabs,
  validationUpdateLabs,
} from "../../middleware/validations/labsValidations/labsValidations.js";
import {
  verifyAdmin,
  verifyAllUsers,
} from "../../middleware/auth/verifyUser.js";
import { requireToken } from "../../middleware/auth/requireToken.js";

const router = Router();

router.get("/", requireToken, verifyAllUsers, getLabs);
router.post(
  "/",
  requireToken,
  verifyAdmin,
  validationRegisterLabs,
  registerLabs
);
router.patch(
  "/:idLab",
  requireToken,
  verifyAdmin,
  validationIdLab,
  validationUpdateLabs,
  updateLabs
);
router.delete(
  "/:idLab",
  requireToken,
  verifyAdmin,
  validationIdLab,
  deleteLabs
);
router.get("/:idLab", requireToken, verifyAllUsers, validationIdLab, getLab);

export default router;
