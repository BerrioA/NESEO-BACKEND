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

const router = Router();

router.get("/", getLabs);
router.post("/", validationRegisterLabs, registerLabs);
router.patch("/:idLab", validationIdLab, validationUpdateLabs, updateLabs);
router.delete("/:idLab", validationIdLab, deleteLabs);
router.get("/:idLab", validationIdLab, getLab);

export default router;
