import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Lab } from "./labs.js";

export const RestrictionLab = sequelize.define("restrictions_labs", {
  // Id identificador de las restricciones del laboratorio
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  // Llave foránea con relación al laboratorio
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
  // Número máximo de grupos permitidos en el laboratorio
  max_groups: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  // Número mínimo de estudiantes por grupo
  min_group_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  // Número máximo de estudiantes por grupo
  max_group_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  // Descripción del laboratorio
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
});
