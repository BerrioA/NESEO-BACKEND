import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/users.js";

// Controlador encargador de mostrar todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "last_name", "cellphone", "email", "rol"],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(
      `Parece que los usuarios están de vacaciones. Estamos trabajando para traerlos de vuelta. ${error}`
    );

    return res.status(500).json({
      error:
        "Parece que los usuarios están de vacaciones. Estamos trabajando para traerlos de vuelta.",
    });
  }
};

// Controlador encargado de registrar los usuarios
export const registerUsers = async (req, res) => {
  try {
    const { name, last_name, cellphone, email, password } = req.body;
    const searchUser = await User.findOne({ where: { email } });

    if (searchUser)
      return res.status(400).json({
        error: "Parece que ya nos conocemos... Este correo ya está registrado.",
      });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      name,
      last_name,
      cellphone,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "¡Bienvenido! Tu cuenta ha sido creada exitosamente.",
      token,
    });
  } catch (error) {
    console.error(
      `¡Vaya! Parece que el registro decidió tomarse un descanso. ¿Podrías intentarlo más tarde?. ${error}`
    );

    return res.status(500).json({
      error:
        "¡Vaya! Parece que el registro decidió tomarse un descanso. ¿Podrías intentarlo más tarde?",
    });
  }
};

// Controlador encargado de actualizar los datos de un usuario
export const updateUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const user = await User.findByPk(idUser);

    if (!user)
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar al usuario que intentas actualizar.",
      });

    const { name, last_name, cellphone, email } = req.body;

    //Validación encargada de verificar que el usuario si envie un campo para actualizar y no un objeto vacio
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error:
          "Lo sentimos, no hemos detectado datos para actualizar. Asegúrate de completar los campos necesarios.",
      });
    }

    if (name && name !== user.name) user.name = name;
    if (last_name && last_name !== user.last_name) user.last_name = last_name;
    if (cellphone && cellphone !== user.cellphone) user.cellphone = cellphone;
    if (email && email !== user.email) user.email = email;

    await user.update({ name, last_name, cellphone, email });

    return res.status(200).json({
      message:
        "¡Misión cumplida! Los datos han sido actualizados sin problemas.",
    });
  } catch (error) {
    console.error(
      `No pudimos actualizar los datos. Estamos resolviendo el problema lo antes posible. ${error}`
    );

    return res.status(500).json({
      error:
        "No pudimos actualizar los datos. Estamos resolviendo el problema lo antes posible.",
    });
  }
};

// Controlador encargado de eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const user = await User.findByPk(idUser);

    if (!user)
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar al usuario que intentas eliminar.",
      });

    await user.destroy();

    return res.status(200).json({
      message: "¡Genial! La eliminación del usuario se ha realizado con éxito.",
    });
  } catch (error) {
    console.error(
      `Lo sentimos, no hemos podido eliminar el usuario en este momento. ${error}`
    );

    return res.status(500).json({
      error:
        "Lo sentimos, no hemos podido eliminar el usuario en este momento.",
    });
  }
};

// Controlador encargado de mostrar un usuario por ID
export const getUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const user = await User.findByPk(idUser, {
      attributes: ["id", "name", "last_name", "cellphone", "email", "rol"],
    });

    if (!user)
      return res.status(400).json({
        error: "¡Lo sentimos! No hemos podido encontrar el usuario.",
      });

    return res.status(200).json(user);
  } catch (error) {
    console.error(
      `Lo sentimos, no hemos podido encontraar el usuario en este momento. ${error}`
    );

    return res.status(500).json({
      error:
        "Lo sentimos, no hemos podido encontraar el usuario en este momento.",
    });
  }
};
