import { body } from "express-validator";
import { validationResultExpress } from "../../express-validator.js";

// Controlador para validar los campos del login enviados desde el Body.
export const validationLogin = [
  body("email")
    .trim()
    .exists()
    .withMessage("Por favor, ingrese su correo electrónico.")
    .notEmpty()
    .withMessage("El campo de correo electrónico no puede estar vacío.")
    .isEmail()
    .withMessage(
      "El formato del correo electrónico no es válido. Ejemplo: nombre@ejemplo.com."
    )
    .normalizeEmail()
    .escape(),

  body("password")
    .trim()
    .exists()
    .withMessage("Por favor, ingrese su contraseña.")
    .notEmpty()
    .withMessage("El campo de contraseña no puede estar vacío.")
    .escape(),

  validationResultExpress,
];
