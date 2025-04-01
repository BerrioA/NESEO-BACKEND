import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const User = sequelize.define("users", {
  // Id identificador de los Usuarios
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  // Nombre del usuario
  name: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  // Apellido del usuario
  last_name: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  // Celular del usuario
  cellphone: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [10, 10],
    },
  },
  // Correo del usuario
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  // Contraseña del usuario
  password: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  // Rol del usuario
  rol: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      isIn: [["Admin", "Estudiante"]],
    },
    defaultValue: "Estudiante",
  },
});
