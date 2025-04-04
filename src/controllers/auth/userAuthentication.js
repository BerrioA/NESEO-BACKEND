import bcryptjs from "bcryptjs";
import {
  generateRefreshToken,
  generateToken,
} from "../../utils/tokenManager.js";
import { User } from "../../models/users.js";

// Controlador encargado de hacer el loguin del usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(403).json({ message: "Credenciales incorrectas." });
    }

    const matchPassword = await bcryptjs.compare(password, user.password);
    if (!matchPassword) {
      return res.status(403).json({ message: "Credenciales incorrectas." });
    }

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, user.rol, res);

    return res.status(200).json({
      token,
      expiresIn,
    });
  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);

    return res.status(500).json({
      message: "Error interno del servidor.",
    });
  }
};

// Controlador para cerrar la sesión del usuario
export const logout = async (req, res) => {
  try {
    if (!req.cookies?.refreshToken) {
      return res.status(200).json({ message: "No hay sesión activa." });
    }

    res.clearCookie("refreshToken", { httpOnly: true, secure: true });

    return res.status(200).json({ message: "Sesión cerrada correctamente." });
  } catch (error) {
    console.error("Error al intentar cerrar sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Controlador encargado de mostraer la información de perfil de usuario
export const profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.uid);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.status(200).json({
      uid: user.id,
      name: user.name,
      last_name: user.last_name,
      rol: user.rol,
    });
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);

    return res.status(500).json({
      message: "Error interno del servidor al obtener el perfil.",
    });
  }
};

// Controlador encargado de generar el refreshToken
export const refreshToken = (req, res) => {
  try {
    const { token, expiresIn } = generateToken(req.uid, req.rol);

    return res.status(200).json({ token, expiresIn });
  } catch (error) {
    console.error("Error al generar el RefreshToken:", error);

    return res.status(500).json({
      message:
        "Se ha presentado un error en el servidor al intentar generar el RefreshToken.",
    });
  }
};
