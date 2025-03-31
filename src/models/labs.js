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
      isAllowedValue(value) {
        if (![10, 70].includes(value)) {
          throw new Error("La capacidad máxima solo puede ser 10 o 70.");
        }
      },
    },
  },
  // Descripción del laboratorio
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
});

Lab.afterSync(async () => {
  const labs = [
    {
      lab_name: "Laboratorio 1",
      quotas: 10,
      description:
        "Laboratorio 1 para hacer pruebas de máximo 5 estudiantes por grupo.",
    },
    {
      lab_name: "Laboratorio 2",
      quotas: 70,
      description:
        "Laboratorio 2 para hacer pruebas de máximo 6 estudiantes por grupo en el laboratorio con 70 cupos.",
    },
  ];

  // Insertar datos después de sincronizar
  await Lab.bulkCreate(labs);
});
