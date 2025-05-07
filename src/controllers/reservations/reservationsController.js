import { Lab } from "../../models/labs.js";
import { Reservation } from "../../models/reservations.js";
import moment from "moment";
import cron from "node-cron";

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
    const { idLab } = req.params;

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
      idUser,
      duration,
      occupied_quotas,
    } = req.body;

    let newDuration;

    // Transformar el valor de duración según el texto recibido
    if (duration === "1hour") {
      newDuration = "01:00:00";
    } else if (duration === "2hours") {
      newDuration = "02:00:00";
    } else {
      newDuration = "01:00:00"; // valor por defecto
    }

    // Verificar si ya existe una reserva en la misma fecha y hora para el mismo laboratorio
    const existingReservation = await Reservation.findOne({
      where: {
        labId: idLab,
        date,
        time,
      },
    });

    if (existingReservation) {
      return res.status(400).json({
        error:
          "Ya existe una reserva para esta fecha y hora en este laboratorio. Por favor, selecciona otro horario.",
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
      duration: newDuration,
    });

    const lab = await Lab.findOne({ where: { id: idLab } });

    if (!lab)
      return res.status(400).json({
        error:
          "No se ha encontrado el laboratorio Kaiser, qeue pasa valecita...",
      });

    // Actualizar los cupos ocupados del laboratorio
    await lab.update({
      occupied_quotas,
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

// Controlador para actualizar el estado de las reservas completadas
export const updateCompletedReservations = async (req, res) => {
  try {
    const currentDate = new Date();

    // Formato de fecha y hora para comparación
    const today = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentTime = currentDate.toTimeString().split(" ")[0]; // HH:MM:SS

    // Buscar todas las reservas de hoy o anteriores que no estén marcadas como completadas
    const reservations = await Reservation.findAll({
      where: {
        date: {
          [Op.lte]: today, // Menor o igual a la fecha actual
        },
        completed: {
          [Op.ne]: true, // No están marcadas como completadas
        },
      },
    });

    let updatedCount = 0;

    for (const reservation of reservations) {
      // Calcular la hora de finalización
      const startTime = reservation.time;
      const durationMinutes = reservation.duration;

      // Convertir la hora de inicio a un objeto Date para cálculos
      const startDate = new Date(`${reservation.date}T${startTime}`);

      // Añadir la duración para obtener la hora de finalización
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

      // Verificar si la hora actual es posterior a la hora de finalización
      if (currentDate >= endDate) {
        // Actualizar la reserva como completada
        await reservation.update({
          completed: true,
          status: "completed",
        });

        updatedCount++;
      }
    }

    // Si esta función se ejecuta como un endpoint
    if (res) {
      return res.status(200).json({
        message: `${updatedCount} reservas han sido marcadas como completadas.`,
      });
    }

    // Si se ejecuta como una tarea programada, puedes loguear el resultado
    console.log(
      `[${new Date().toISOString()}] ${updatedCount} reservas han sido marcadas como completadas.`
    );

    return true;
  } catch (error) {
    console.error(
      `Error al actualizar el estado de las reservas: ${error.message}`
    );

    if (res) {
      return res.status(500).json({
        error: "Ocurrió un error al actualizar el estado de las reservas.",
      });
    }

    return false;
  }
};

// Función para ejecutar como una tarea programada
export const actualizarReservasFinalizadas = async () => {
  try {
    const reservationsUpdated = [];
    const reservations = await Reservation.findAll({
      where: { status: "pending" },
      raw: false, // Asegura que obtenemos instancias completas de Sequelize
    });

    console.log(`Verificando ${reservations.length} reservas pendientes...`);

    for (const reservation of reservations) {
      try {
        const { id, date, time, duracionReserva } = reservation;

        // Verificar que todos los campos necesarios existan
        if (!date || !time) {
          console.warn(
            `Reserva ID ${id} tiene campos faltantes. Fecha: ${date}, Hora: ${time}`
          );
          continue;
        }

        // Si la duración no existe, usar valor por defecto
        const duracion = duracionReserva || "01:00:00";

        // Crear fecha y hora de inicio
        const fechaHoraInicio = moment(
          `${date} ${time}`,
          "YYYY-MM-DD HH:mm:ss"
        );

        // Validar que la fecha y hora sean válidas
        if (!fechaHoraInicio.isValid()) {
          console.warn(
            `Fecha/hora inválida para la reserva ID ${id}: ${date} ${time}`
          );
          continue;
        }

        // Extraer horas, minutos y segundos de la duración
        let horas = 1,
          minutos = 0,
          segundos = 0;

        if (duracion && typeof duracion === "string") {
          const partesDuracion = duracion.split(":");
          if (partesDuracion.length >= 1)
            horas = parseInt(partesDuracion[0]) || 0;
          if (partesDuracion.length >= 2)
            minutos = parseInt(partesDuracion[1]) || 0;
          if (partesDuracion.length >= 3)
            segundos = parseInt(partesDuracion[2]) || 0;
        }

        // Calcular fecha y hora de finalización
        const fechaHoraFin = fechaHoraInicio
          .clone()
          .add(horas, "hours")
          .add(minutos, "minutes")
          .add(segundos, "seconds");

        // Obtener fecha y hora actual
        const fechaHoraActual = moment();

        // Verificar si la reserva ha finalizado
        if (fechaHoraActual.isAfter(fechaHoraFin)) {
          await reservation.update({ status: "completed" });
          console.log(
            `Reserva ID ${id} actualizada a Finalizada (${date} ${time} + ${duracion})`
          );
          console.log(
            `  > Inicio: ${fechaHoraInicio.format("YYYY-MM-DD HH:mm:ss")}`
          );
          console.log(`  > Fin: ${fechaHoraFin.format("YYYY-MM-DD HH:mm:ss")}`);
          console.log(
            `  > Actual: ${fechaHoraActual.format("YYYY-MM-DD HH:mm:ss")}`
          );
          reservationsUpdated.push(id);
        } else {
          // Loguear cuánto tiempo falta para finalizar (para debugging)
          const tiempoRestante = moment.duration(
            fechaHoraFin.diff(fechaHoraActual)
          );
          // console.log(`Reserva ID ${id} aún activa:`);
          // console.log(
          //   `  > Inicio: ${fechaHoraInicio.format("YYYY-MM-DD HH:mm:ss")}`
          // );
          // console.log(`  > Fin: ${fechaHoraFin.format("YYYY-MM-DD HH:mm:ss")}`);
          // console.log(
          //   `  > Tiempo restante: ${Math.floor(
          //     tiempoRestante.asHours()
          //   )}h ${tiempoRestante.minutes()}m`
          // );
        }
      } catch (error) {
        console.error(
          `Error al procesar la reserva ID ${reservation.id}:`,
          error
        );
        console.error(error.stack);
      }
    }

    return {
      success: true,
      message: `${reservationsUpdated.length} reservas actualizadas a estado finalizado`,
      updatedReservationIds: reservationsUpdated,
    };
  } catch (error) {
    console.error("Error al actualizar reservas finalizadas:", error);
    console.error(error.stack);
    return {
      success: false,
      message: "Error al procesar la actualización de reservas",
      error: error.message,
    };
  }
};

// Función para depurar una reserva específica
export const depurarReserva = async (reservationId) => {
  try {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return {
        success: false,
        message: `No se encontró la reserva con ID ${reservationId}`,
      };
    }

    const { date, time, duracionReserva } = reservation;

    // Crear fecha y hora de inicio
    const fechaHoraInicio = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss");

    // Extraer partes de la duración
    let horas = 1,
      minutos = 0,
      segundos = 0;
    if (duracionReserva && typeof duracionReserva === "string") {
      const partesDuracion = duracionReserva.split(":");
      if (partesDuracion.length >= 1) horas = parseInt(partesDuracion[0]) || 0;
      if (partesDuracion.length >= 2)
        minutos = parseInt(partesDuracion[1]) || 0;
      if (partesDuracion.length >= 3)
        segundos = parseInt(partesDuracion[2]) || 0;
    }

    // Calcular fecha y hora de finalización
    const fechaHoraFin = fechaHoraInicio
      .clone()
      .add(horas, "hours")
      .add(minutos, "minutes")
      .add(segundos, "seconds");

    // Obtener fecha y hora actual
    const fechaHoraActual = moment();

    const tiempoRestante = moment.duration(fechaHoraFin.diff(fechaHoraActual));
    const yaFinalizo = fechaHoraActual.isAfter(fechaHoraFin);

    console.log("Datos completos de la reserva:");
    console.log(JSON.stringify(reservation.toJSON(), null, 2));
    console.log("Análisis de tiempos:");
    console.log({
      date,
      time,
      duracionReserva,
      fechaHoraInicio: fechaHoraInicio.format("YYYY-MM-DD HH:mm:ss"),
      fechaHoraFin: fechaHoraFin.format("YYYY-MM-DD HH:mm:ss"),
      fechaHoraActual: fechaHoraActual.format("YYYY-MM-DD HH:mm:ss"),
      tiempoRestante: yaFinalizo
        ? "Ya finalizó"
        : `${Math.floor(
            tiempoRestante.asHours()
          )}h ${tiempoRestante.minutes()}m`,
      deberiaActualizarse: yaFinalizo,
    });

    return {
      success: true,
      reservation: reservation.toJSON(),
      analisis: {
        fechaInicio: fechaHoraInicio.format("YYYY-MM-DD HH:mm:ss"),
        fechaFin: fechaHoraFin.format("YYYY-MM-DD HH:mm:ss"),
        tiempoRestante: yaFinalizo
          ? "Ya finalizó"
          : `${Math.floor(
              tiempoRestante.asHours()
            )}h ${tiempoRestante.minutes()}m`,
        deberiaActualizarse: yaFinalizo,
      },
    };
  } catch (error) {
    console.error(`Error al depurar reserva ID ${reservationId}:`, error);
    console.error(error.stack);
    return { success: false, error: error.message };
  }
};

// Configuración de la tarea programada con node-cron
export const iniciarVerificacionAutomatica = () => {
  // Ejecutar cada 5 minutos ('*/5 * * * *')
  const task = cron.schedule("*/5 * * * *", async () => {
    console.log("\n=== " + moment().format("YYYY-MM-DD HH:mm:ss") + " ===");
    console.log(
      "Ejecutando verificación automática de reservas finalizadas..."
    );
    const result = await actualizarReservasFinalizadas();
    // console.log("Resultado:", result);
    // console.log("=== Fin de verificación ===\n");
  });

  console.log("Sistema de verificación automática de reservas iniciado");
  return task; // Devuelve la tarea para que pueda ser detenida si es necesario
};

// Ruta para depurar una reserva específica (para uso en un endpoint)
export const depurarReservaHandler = async (req, res) => {
  const { id } = req.params;
  const resultado = await depurarReserva(id);
  res.json(resultado);
};
