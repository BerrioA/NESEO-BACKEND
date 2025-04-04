import { body, param } from "express-validator";
import { validationResultExpress } from "../../express-validator.js";

// Middleware encargado de validar los registros de una reserva
export const validationRegisterReservation = [
  body("study_area")
    .trim()
    .notEmpty()
    .withMessage("El área de estudio es clave para avanzar. ¡Solo falta eso!")
    .isString()
    .matches(/^[a-zA-ZÁÉÍÓÚáéíóúÜüÑñ0-9\s]{3,}$/)
    .withMessage(
      "Los símbolos están de vacaciones. Usa solo letras, números y espacios en el área de estudio."
    )
    .escape(),

  body("area_test")
    .trim()
    .notEmpty()
    .withMessage("El área de prueba es clave para avanzar. ¡Solo falta eso!")
    .isString()
    .matches(/^[a-zA-ZÁÉÍÓÚáéíóúÜüÑñ0-9\s]{3,}$/)
    .withMessage(
      "Los símbolos están de vacaciones. Usa solo letras, números y espacios en el área de prueba."
    )
    .escape(),

  body("partners")
    .optional()
    .isArray()
    .withMessage(
      "¡Ups! Necesitamos al menos un integrante en el campo 'acompañantes'. Por favor, agrega uno."
    )
    .escape(),

  body("partners.*.name")
    .trim()
    .optional()
    .isString()
    .withMessage(
      "El nombre de cada integrante debe ser texto. Por favor, revisa este campo."
    )
    .trim()
    .notEmpty()
    .withMessage(
      "El nombre de cada integrante es obligatorio. No puede estar vacío."
    )
    .escape(),

  body("partners.*.last_name")
    .trim()
    .optional()
    .isString()
    .withMessage(
      "El apellido de cada integrante debe ser texto. Por favor, revisa este campo."
    )
    .trim()
    .notEmpty()
    .withMessage(
      "El apellido de cada integrante es obligatorio. No puede estar vacío."
    )
    .escape(),

  body("date")
    .trim()
    .notEmpty()
    .withMessage("El día de reserva es clave para avanzar. ¡Solo falta eso!")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("El formato de fecha no es válido. Debe ser 'YYYY-MM-DD'.")
    .custom((value) => {
      // Verifica que sea una fecha real
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error("La fecha proporcionada no es válida.");
      }
      return true;
    })
    .escape(),

  body("time")
    .trim()
    .notEmpty()
    .withMessage("La hora de reserva es clave para avanzar. ¡Solo falta eso!")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/)
    .withMessage(
      "El formato de la hora no es válido. Debe ser 'HH:mm' o 'HH:mm:ss'."
    ),

  body("teachers_name")
    .trim()
    .notEmpty()
    .withMessage(
      "El nombre del docente es clave para continuar. ¡Solo falta eso!"
    )
    .isString()
    .isLength({ min: 3 })
    .withMessage("¡Hola! El nombre del docente parece un poco corto. ")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage(
      "Los números y símbolos están de vacaciones. Usa solo letras y espacios en el nombre del docente."
    )
    .escape(),

  body("activity_type")
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3 })
    .withMessage("¡Hola! El nombre del docente parece un poco corto. ")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage(
      "Los números y símbolos están de vacaciones. Usa solo letras y espacios en el nombre del docente."
    )
    .escape(),

  body("other_activity").custom((value, { req }) => {
    if (req.body.activity_type === "Otro") {
      if (!value || typeof value !== "string" || value.trim() === "") {
        throw new Error(
          "Por favor, describa la otra tipo de actividad que desea realizar."
        );
      }

      if (value.length < 10) {
        throw new Error(
          "¡Hola! La descripción de la otra actividad a realizar parece un poco corta. "
        );
      }

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        throw new Error(
          "La descripción de la otra actividad a realizar solo puede contener letras y espacios."
        );
      }
    }
    return true;
  }),

  body("email")
    .trim()
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

  body("estate").trim().optional().escape(),

  validationResultExpress,
];

// Validación del Identificador de la reserva
export const validationIdReservation = [
  param("idReservation")
    .trim()
    .exists()
    .withMessage(
      "Nos hace falta el ID de la reserva para avanzar. ¡Solo un pequeño detalle más!"
    )
    .isUUID()
    .withMessage(
      "¡Tranquilo! Solo necesitamos que el ID esté en formato UUID valido. ¡Vuelve a intentarlo!"
    )
    .escape(),

  validationResultExpress,
];
