import { body, param } from "express-validator";
import { validationResultExpress } from "../../express-validator.js";

// Middleware encargado de validar los campos para el registro de laboratorios
export const validationRegisterLabs = [
  body("lab_name")
    .trim()
    .notEmpty()
    .withMessage(
      "El nombre del laboratorio es clave para avanzar. ¡Solo falta eso!"
    )
    .isString()
    .isLength({ min: 3 })
    .withMessage(
      "Casi listo, solo asegúrate de que el nombre del laboratorio tenga al menos 3 caracteres."
    )
    .matches(/^[a-zA-Z0-9\s]{3,}$/)
    .withMessage(
      "Los símbolos están de vacaciones. Usa solo letras, números y espacios en el nombre del laboratorio."
    )
    .escape(),

  body("quotas")
    .trim()
    .notEmpty()
    .withMessage(
      "El nombre del laboratorio es clave para avanzar. ¡Solo falta eso!"
    )
    .isNumeric()
    .matches(/^[0-9]+$/)
    .withMessage(
      "Los símbolos y letras están de vacaciones. Usa solo números la capacidad del laboratorio."
    )
    .escape(),

  body("description")
    .optional()
    .isString()
    .matches(/^[a-zA-Z0-9\s.,]{3,}$/)
    .withMessage(
      "Los símbolos están de vacaciones. Usa solo letras, números y espacios en la descripción del laboratorio."
    )
    .escape(),

  validationResultExpress,
];

// Middleware encargado de validar los campos para la actualización de laboratorios
export const validationUpdateLabs = [
  body("lab_name")
    .trim()
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage(
      "Casi listo, solo asegúrate de que el nombre del laboratorio tenga al menos 3 caracteres."
    )
    .matches(/^[a-zA-Z0-9\s]{3,}$/)
    .withMessage(
      "Los símbolos están de vacaciones. Usa solo letras, números y espacios en el nombre del laboratorio."
    )
    .escape(),

  body("quotas")
    .trim()
    .optional()
    .isNumeric()
    .matches(/^[0-9]+$/)
    .withMessage(
      "Los símbolos y letras están de vacaciones. Usa solo números la capacidad del laboratorio."
    )
    .escape(),

  body("description")
    .optional()
    .isString()
    .matches(/^[a-zA-Z0-9\s.,]{3,}$/)
    .withMessage(
      "Los símbolos están de vacaciones. Usa solo letras, números y espacios en la descripción del laboratorio."
    )
    .escape(),

  validationResultExpress,
];

// Validación del Identificador del laboratorio
export const validationIdLab = [
  param("idLab")
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
