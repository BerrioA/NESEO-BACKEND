import { body, param } from "express-validator";
import { validationResultExpress } from "../../express-validator.js";

// Validaciones para el registro de usuario
export const validationRegisterUsers = [
  // Validación para el campo nombre
  body("name")
    .exists()
    .withMessage("Tu nombre es clave para continuar. ¡Solo falta eso!")
    .notEmpty()
    .withMessage("Tu nombre es clave para continuar. ¡Solo falta eso!")
    .isString()
    .isLength({ min: 3 })
    .withMessage("¡Hola! Tu nombre parece un poco corto. ")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage(
      "Los números y símbolos están de vacaciones. Usa solo letras y espacios en tu nombre."
    )
    .escape(),

  // Validación para el campo apellido
  body("last_name")
    .exists()
    .withMessage("Tu apellido es clave para continuar. ¡Solo falta eso!")
    .notEmpty()
    .withMessage("Tu apellido es clave para continuar. ¡Solo falta eso!")
    .isString()
    .isLength({ min: 3 })
    .withMessage("¡Hola! Tu apellido parece un poco corto. ")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage(
      "Los números y símbolos están de vacaciones. Usa solo letras y espacios en tu apellido."
    )
    .escape(),

  // Validación para el campo email
  body("email")
    .exists()
    .withMessage(
      "¡Espera! Necesitamos tu correo electrónico antes de continuar."
    )
    .notEmpty()
    .withMessage(
      "¡Espera! Necesitamos tu correo electrónico antes de continuar."
    )
    .isEmail()
    .exists()
    .matches(/^[a-zA-Z0-9._%+-]+@cecar\.edu\.co$/)
    .withMessage("Por favor, utiliza tu correo institucional para continuar.")
    .normalizeEmail()
    .escape(),

  // Validación para el campo contraseña
  body("password")
    .exists()
    .withMessage(
      "¡Ups! Parece que olvidaste crear una contraseña. ¡Es hora de inventar algo seguro!"
    )
    .notEmpty()
    .withMessage(
      "¡Ups! Parece que olvidaste crear una contraseña. ¡Es hora de inventar algo seguro!"
    )
    .isString()
    .isLength({ min: 6 })
    .withMessage(
      "Las contraseñas cortas no tienen poder. ¡Dale un poco más de longitud!"
    )
    .matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage(
      "Las contraseñas sin mayúsculas y números no tienen superpoderes. ¡Dales un toque extra!"
    )
    .escape(),

  validationResultExpress,
];

// Validaciones para la actualización del usuario
export const validationUpdateUser = [
  // Validación para el campo nombre
  body("name")
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage("¡Hola! Tu nombre parece un poco corto. ")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage(
      "Los números y símbolos están de vacaciones. Usa solo letras y espacios en tu nombre."
    )
    .escape(),

  // Validación para el campo apellido
  body("last_name")
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage("¡Hola! Tu apellido parece un poco corto. ")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage(
      "Los números y símbolos están de vacaciones. Usa solo letras y espacios en tu apellido."
    )
    .escape(),

  // Validación para el campo email
  body("email")
    .optional()
    .isEmail()
    .matches(/^[a-zA-Z0-9._%+-]+@cecar\.edu\.co$/)
    .withMessage("Por favor, utiliza tu correo institucional para continuar.")
    .normalizeEmail()
    .escape(),

  // Validación para el campo contraseña
  body("password")
    .optional()
    .isString()
    .isLength({ min: 6 })
    .withMessage(
      "Las contraseñas cortas no tienen poder. ¡Dale un poco más de longitud!"
    )
    .matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage(
      "Las contraseñas sin mayúsculas y números no tienen superpoderes. ¡Dales un toque extra!"
    )
    .escape(),

  validationResultExpress,
];

// Validación del Identificador del usuario
export const validationIdUser = [
  param("idUser")
    .exists()
    .withMessage(
      "Nos hace falta el ID del usuario para avanzar. ¡Solo un pequeño detalle más!"
    )
    .isUUID()
    .withMessage(
      "¡Tranquilo! Solo necesitamos que el ID esté en formato UUID valido. ¡Vuelve a intentarlo!"
    )
    .escape(),

  validationResultExpress,
];
