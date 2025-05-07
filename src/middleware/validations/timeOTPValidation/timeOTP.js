import { User } from "../../../models/users.js";

export const timeOTP = async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({ where: { verificationCode: code } });

    if (!user) {
      return res
        .status(400)
        .json({ error: "El código ingresado no es válido." });
    }

    const { createdAt, lastResendTime } = user;

    // Añadir más logs para depuración
    console.log("createdAt:", createdAt);
    console.log("lastResendTime:", lastResendTime);

    const timeToUse = lastResendTime || createdAt;

    // Tiempo de espera para el vencimiento del codigo
    const expirationTimeMs = 2 * 60 * 1000;
    // Fecha y hora actual para validar el vencimiento del codigo
    const now = new Date();
    const timeToCompare = new Date(timeToUse);
    const elapsedTimeMs = now - timeToCompare;

    if (elapsedTimeMs > expirationTimeMs) {
      return res.status(400).json({
        error:
          "El código de verificación ha expirado. Por favor, solicita uno nuevo...",
      });
    }

    next();
  } catch (error) {
    console.log(`Error en validador de código OTP: ${error}`);
    return res.status(500).json({
      error: "Error interno en la validación del código de verificación.",
    });
  }
};

export const validateResendCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const { lastResendTime, resendCount } = user;
    const maxResendAttempts = 3;
    const resendCooldownMs = 2 * 60 * 1000;

    const now = new Date();
    const lastResend = new Date(lastResendTime);

    if (resendCount >= maxResendAttempts) {
      return res.status(429).json({ error: "Límite de reenvíos alcanzado." });
    }

    if (now - lastResend < resendCooldownMs) {
      return res.status(429).json({
        error: "Debe esperar antes de reenviar el código de verificación.",
      });
    }

    next();
  } catch (error) {
    console.log(`Error en validador de reenvío de código OTP: ${error}`);
    return res.status(500).json({
      error: "Error interno en la validación del reenvío del código.",
    });
  }
};
