import { Router } from "express";
import {
  deleteReservation,
  getReservation,
  getReservations,
  registerReservations,
} from "../../controllers/reservations/reservationsController.js";
import {
  validationIdReservation,
  validationRegisterReservation,
} from "../../middleware/validations/reservationsValidations/reservationsValidations.js";
import { validationIdLab } from "../../middleware/validations/labsValidations/labsValidations.js";
import { requireToken } from "../../middleware/auth/requireToken.js";
import {
  verifyAdmin,
  verifyAllUsers,
  verifyStudent,
} from "../../middleware/auth/verifyUser.js";
// import { validationIdUser } from "../../middleware/validations/usersValidations/usersValidations.js";

const router = Router();

router.get("/", requireToken, verifyAdmin, getReservations);
router.post(
  "/:idLab",
  requireToken,
  verifyStudent,
  validationIdLab,
  // validationRegisterReservation,
  registerReservations
);
router.delete(
  "/:idReservation",
  requireToken,
  verifyAllUsers,
  validationIdReservation,
  deleteReservation
);
router.get("/:idReservation", requireToken, verifyAllUsers, getReservation);

export default router;
