import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Lab = sequelize.define("labs", {
  // Id identificador de los laboratorios
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  // Nombre del laboratorio
  lab_name: {
    type: DataTypes.STRING(40),
    allowNull: false,
    unique: true,
  },
  // Cupos maximos por cada laboratorio
  quotas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: true,
    },
  },
  // Descripción del laboratorio
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
});
