import { DataTypes, Op } from "sequelize";
import { sequelize } from "../database/database.js";
import { Lab } from "./labs.js";
import { User } from "./users.js";

export const Reservation = sequelize.define("reservations", {
  //Identificador de la reserva
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  // Llave foranea relacionada con el laboratorio
  labId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Lab,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  // Área de estudio
  study_area: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [
        [
          "Social",
          "Neuropsicológicas",
          "Clínica",
          "Proyectivas",
          "Organizacional",
          "Educativa",
          "Inteligencia",
          "Generales",
        ],
      ],
    },
  },
  // Área de prueba relacionada con el área de prueba
  area_test: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // Integrantes que comforman el grupo con el estudiantes
  partners: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: true, // Permitir que sea null
    validate: {
      isValidPartners(partners) {
        // Si es null o undefined, permitirlo sin validación adicional
        if (partners === null || partners === undefined) {
          return;
        }

        if (!Array.isArray(partners)) {
          throw new Error("El campo 'partners' debe ser un array.");
        }

        partners.forEach(({ name, last_name }, index) => {
          // Permitir objetos vacíos (si ambos valores son nulos o undefined)
          if (!name && !last_name) {
            return;
          }

          // Validar que sean cadenas de texto si existen
          if (name && typeof name !== "string") {
            throw new Error(
              `El nombre en el elemento ${index} debe ser una cadena de texto.`
            );
          }
          if (last_name && typeof last_name !== "string") {
            throw new Error(
              `El apellido en el elemento ${index} debe ser una cadena de texto.`
            );
          }

          // Validar que no sean solo espacios en blanco
          if (name && !name.trim()) {
            throw new Error(
              `El nombre en el elemento ${index} no puede estar vacío.`
            );
          }
          if (last_name && !last_name.trim()) {
            throw new Error(
              `El apellido en el elemento ${index} no puede estar vacío.`
            );
          }
        });
      },
    },
  },

  // Fecha relacionada con el dia de la reserva
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  // Horas reservadas
  time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      isValidTime(value) {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/; // HH:mm o HH:mm:ss
        if (!regex.test(value)) {
          throw new Error("El formato de la hora debe ser HH:mm o HH:mm:ss");
        }
      },
    },
  },
  // Nombre del docente que asigno la actividad
  teachers_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  // Tipo de actividad a realizar por el estudiante
  activity_type: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isIn: {
        args: [
          [
            "Estudio de prueba",
            "Practica de aplicación de prueba",
            "Aplicación de prueba a paciente",
            "Calificar prueba",
            "Otro",
          ],
        ],
        msg: "Tipo de actividad no válido.",
      },
    },
  },
  // Campo opcional si el usuario selecciona "Otro"
  other_activity: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isRequired(value) {
        if (this.activity_type === "Otro" && (!value || value.trim() === "")) {
          throw new Error(
            "Debes especificar la actividad si seleccionaste 'Otro'."
          );
        }
      },
    },
  },
  //Email del estudiante que realizao la reserva
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  // Estado de la reserva
  estate: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isIn: [["Pendiente", "Aprobada", "Rechazada", "Finalizada"]],
    },
    defaultValue: "Pendiente",
  },
  // Identificador del usuario relacionado con la reserva a realizada
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
});

// Hook para validar que el usuario no exceda 2 horas de reserva por semana
Reservation.beforeValidate(async (reservation) => {
  const { userId, date, time } = reservation;

  // Calcular el inicio y fin de la semana actual
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Consultar las reservas del usuario en la semana actual
  const userReservations = await Reservation.findAll({
    where: {
      userId,
      date: { [Op.between]: [startOfWeek, endOfWeek] },
    },
  });

  // Calcular el total de minutos reservados en la semana
  let totalMinutes = 0;
  userReservations.forEach((res) => {
    const [hh, mm] = res.time.split(":").map(Number);
    totalMinutes += hh * 60 + mm;
  });

  // Sumar la nueva reserva
  const [newHH, newMM] = time.split(":").map(Number);
  totalMinutes += newHH * 60 + newMM;

  // Verificar que no exceda las 2 horas (120 minutos)
  if (totalMinutes > 120) {
    throw new Error("No puedes reservar más de 2 horas en la misma semana.");
  }
});
