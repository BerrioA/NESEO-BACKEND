import { body, param } from "express-validator";
import { validationResultExpress } from "../../express-validator.js";

// Middleware encargado de validar los campos para el registro de las restricciones de los laboratorios
export const validationRegisterRestrictions = [
  body("max_groups")
    .trim()
    .notEmpty()
    .withMessage(
      "Parece que los grupos máximos están jugando al escondite. ¡Ingresa el valor para que podamos continuar!"
    )
    .isInt({ min: 1 })
    .withMessage(
      "Parece que hay letras o símbolos en este campo. Recuerda que solo se permiten números."
    )
    .escape(),

  body("min_group_size")
    .trim()
    .notEmpty()
    .withMessage(
      "Parece que el número mínimo de integrantes por grupo están jugando al escondite. ¡Ingresa el valor para que podamos continuar!"
    )
    .isInt({ min: 1 })
    .withMessage(
      "Parece que hay letras o símbolos en este campo. Recuerda que solo se permiten números."
    )
    .escape(),

  body("max_group_size")
    .trim()
    .notEmpty()
    .withMessage(
      "Parece que el número máximo de integrantes por grupo están jugando al escondite. ¡Ingresa el valor para que podamos continuar!"
    )
    .isInt({ min: 1 })
    .withMessage(
      "Parece que hay letras o símbolos en este campo. Recuerda que solo se permiten números."
    )
    .escape(),

  body("description")
    .trim()
    .optional()
    .isString()
    .matches(/^[a-zA-Z0-9 .,]+$/)
    .withMessage(
      "Los números y símbolos están de vacaciones. Usa solo letras, puntos, comas y espacios en la descripción."
    )
    .escape(),

  validationResultExpress,
];

// Middleware encargado de validar los campos para la actualización de las restricciones de los laboratorios
export const validationUpdateRestrictions = [
  body("max_groups")
    .trim()
    .optional()
    .isNumeric()
    .matches(/^[1-9]\d*$/)
    .withMessage(
      "Parece que hay letras o símbolos en este campo. Recuerda que solo se permiten números."
    )
    .escape(),

  body("min_group_size")
    .trim()
    .optional()
    .isNumeric()
    .matches(/^[1-9]\d*$/)
    .withMessage(
      "Parece que hay letras o símbolos en este campo. Recuerda que solo se permiten números."
    )
    .escape(),

  body("max_group_size")
    .trim()
    .optional()
    .isNumeric()
    .matches(/^[1-9]\d*$/)
    .withMessage(
      "Parece que hay letras o símbolos en este campo. Recuerda que solo se permiten números."
    )
    .escape(),

  body("description")
    .trim()
    .optional()
    .isString()
    .matches(/^[a-zA-Z0-9 .,]+$/)
    .withMessage(
      "Los números y símbolos están de vacaciones. Usa solo letras, puntos, comas y espacios en la descripción."
    )
    .escape(),

  validationResultExpress,
];

// Validación del Identificador de la restricción
export const validationIdRestriction = [
  param("idRestriction")
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
