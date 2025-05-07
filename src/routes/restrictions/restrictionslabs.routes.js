import { Router } from "express";
import {
  deleteRestrictions,
  getRestriction,
  getRestrictions,
  registerRestrictions,
  updateRestrictions,
} from "../../controllers/restrictions/restrictionsController.js";
import {
  validationIdRestriction,
  validationRegisterRestrictions,
  validationUpdateRestrictions,
} from "../../middleware/validations/restrictionsValidations/restrictionsValidations.js";
import { validationIdLab } from "../../middleware/validations/labsValidations/labsValidations.js";
import { requireToken } from "../../middleware/auth/requireToken.js";
import {
  verifyAdmin,
  verifyAllUsers,
} from "../../middleware/auth/verifyUser.js";

const router = Router();

router.get("/", requireToken, verifyAllUsers, getRestrictions);
router.post(
  "/:idLab",
  requireToken,
  verifyAdmin,
  validationIdLab,
  validationRegisterRestrictions,
  registerRestrictions
);
router.patch(
  "/:idRestriction",
  requireToken,
  verifyAdmin,
  validationIdRestriction,
  validationUpdateRestrictions,
  updateRestrictions
);
router.delete(
  "/:idRestriction",
  requireToken,
  verifyAdmin,
  validationIdRestriction,
  deleteRestrictions
);
router.get(
  "/:idRestriction",
  requireToken,
  verifyAllUsers,
  validationIdRestriction,
  getRestriction
);

export default router;
