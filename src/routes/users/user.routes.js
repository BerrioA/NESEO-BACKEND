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

const router = Router();

router.get("/", getUsers);
router.post("/", validationRegisterUsers, registerUsers);
router.patch("/:idUser", validationIdUser, validationUpdateUser, updateUser);
router.delete("/:idUser", validationIdUser, deleteUser);
router.get("/:idUser", validationIdUser, getUser);

export default router;
