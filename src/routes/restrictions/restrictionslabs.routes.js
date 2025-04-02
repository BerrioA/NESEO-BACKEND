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

const router = Router();

router.get("/", getRestrictions);
router.post(
  "/:idLab",
  validationIdLab,
  validationRegisterRestrictions,
  registerRestrictions
);
router.patch(
  "/:idRestriction",
  validationIdRestriction,
  validationUpdateRestrictions,
  updateRestrictions
);
router.delete("/:idRestriction", validationIdRestriction, deleteRestrictions);
router.get("/:idRestriction", validationIdRestriction, getRestriction);

export default router;
