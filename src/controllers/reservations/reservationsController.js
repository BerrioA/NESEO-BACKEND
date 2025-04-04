import { Op } from "sequelize";
import { Lab } from "../../models/labs.js";
import { Reservation } from "../../models/reservations.js";

// Controlador encargado de obtener todas las reservas
export const getReservations = async (req, res) => {
  try {
    const reservation = await Reservation.findAll({
      attributes: [
        "id",
        "labId",
        "study_area",
        "area_test",
        "partners",
        "date",
        "time",
        "teachers_name",
        "activity_type",
        "other_activity",
        "email",
        "estate",
        "userId",
      ],
    });

    return res.status(200).json(reservation);
  } catch (error) {
    console.error(
      `¡Tranquilo! Estamos solucionando el problema para que puedas ver las reservas en un momento. ${error}`
    );
    return res.status(500).json({
      error:
        "¡Tranquilo! Estamos solucionando el problema para que puedas ver las reservas en un momento.",
    });
  }
};

// Controlador encargado de registrar una reserva
export const registerReservations = async (req, res) => {
  try {
    const { idLab, idUser } = req.params;

    const searchlab = await Lab.findByPk(idLab);
    if (!searchlab) {
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar al laboratorio que intentas hacer la reserva.",
      });
    }

    const {
      study_area,
      area_test,
      partners,
      date,
      time,
      teachers_name,
      activity_type,
      other_activity,
      email,
    } = req.body;

    // Calcular el inicio y fin de la semana actual
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Obtener todas las reservas de la semana para el usuario
    const userReservations = await Reservation.findAll({
      where: {
        userId: idUser,
        date: { [Op.between]: [startOfWeek, endOfWeek] },
      },
    });

    // Calcular los minutos reservados en la semana
    let totalMinutes = 0;
    userReservations.forEach((res) => {
      const [hh, mm] = res.time.split(":").map(Number);
      totalMinutes += hh * 60 + mm;
    });

    // Calcular la nueva reserva en minutos
    const [newHH, newMM] = time.split(":").map(Number);
    const newReservationMinutes = newHH * 60 + newMM;

    // Validar que no supere las 2 horas (120 minutos)
    if (totalMinutes + newReservationMinutes > 120) {
      return res.status(400).json({
        error: "No puedes reservar más de 2 horas en la misma semana.",
      });
    }

    await Reservation.create({
      labId: idLab,
      study_area,
      area_test,
      partners,
      date,
      time,
      teachers_name,
      activity_type,
      other_activity,
      email,
      userId: idUser,
    });

    return res.status(200).json({
      message:
        "¡Perfecto! Tu reserva ha sido registrada con éxito. ¡Ya estamos listos para recibirte!",
    });
  } catch (error) {
    console.error(
      `¡Vaya! Parece que el registro de reservas decidió tomarse un descanso. ${error}`
    );

    return res.status(500).json({
      error:
        "¡Vaya! Parece que el registro de reservas decidió tomarse un descanso. ¿Podrías intentarlo más tarde?",
    });
  }
};

// Controlador encargado de eliminar una reserva
export const deleteReservation = async (req, res) => {
  try {
    const { idReservation } = req.params;

    const reservation = await Reservation.findByPk(idReservation);

    if (!reservation)
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar la reserva del laboratorio que intentas eliminar.",
      });

    await reservation.destroy();

    return res.status(200).json({
      message:
        "¡Misión cumplida! La reserva del laboratorio ha sido eliminada con exito.",
    });
  } catch (error) {
    console.error(
      `Lo sentimos, no hemos podido eliminar la reserva del laboratorio en este momento. ${error}`
    );

    return res.status(500).json({
      error:
        "Lo sentimos, no hemos podido eliminar la reserva del laboratorio en este momento.",
    });
  }
};

// Controlador encargado de obtener una reserva
export const getReservation = async (req, res) => {
  try {
    const { idReservation } = req.params;

    const reservation = await Reservation.findByPk(idReservation, {
      attributes: [
        "id",
        "labId",
        "study_area",
        "area_test",
        "partners",
        "date",
        "time",
        "teachers_name",
        "activity_type",
        "other_activity",
        "email",
        "estate",
        "userId",
      ],
    });

    if (!reservation)
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar la reserva del laboratorio.",
      });

    return res.status(200).json(reservation);
  } catch (error) {
    console.error(
      `¡Tranquilo! Estamos solucionando el problema para que puedas ver las reservas en un momento. ${error}`
    );
    return res.status(500).json({
      error:
        "¡Tranquilo! Estamos solucionando el problema para que puedas ver las reservas en un momento.",
    });
  }
};
