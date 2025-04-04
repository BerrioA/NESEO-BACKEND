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
// import { validationIdUser } from "../../middleware/validations/usersValidations/usersValidations.js";

const router = Router();

router.get("/", getReservations);
router.post(
  "/:idLab",
  validationIdLab,
  validationRegisterReservation,
  registerReservations
);
router.delete("/:idReservation", validationIdReservation, deleteReservation);
router.get("/:idReservation", getReservation);

export default router;
