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

// Función para insertar laboratorios y restricciones después de sincronizar
export const insertDefaultLabsAndRestrictions = async () => {
  try {
    console.log("🔄 Insertando laboratorios y restricciones...");
    const labs = [
      {
        lab_name: "Laboratorio 1",
        quotas: 10,
        description:
          "Laboratorio 1 para hacer pruebas de máximo 5 estudiantes por grupo.",
        restrictions: {
          max_groups: 2,
          min_group_size: 2,
          max_group_size: 5,
          description: "Restricción para el Laboratorio 1.",
        },
      },
      {
        lab_name: "Laboratorio 2",
        quotas: 70,
        description:
          "Laboratorio 2 con capacidad para 70 estudiantes, máximo 6 por grupo.",
        restrictions: {
          max_groups: 5,
          min_group_size: 2,
          max_group_size: 6,
          description: "Restricción para el Laboratorio 2.",
        },
      },
    ];

    for (const labData of labs) {
      const [lab, created] = await Lab.findOrCreate({
        where: { lab_name: labData.lab_name },
        defaults: {
          quotas: labData.quotas,
          description: labData.description,
        },
      });

      if (created) {
        console.log(`✅ Laboratorio creado: ${lab.lab_name}`);
      } else {
        console.log(`⚠️ Laboratorio ya existía: ${lab.lab_name}`);
      }

      // Insertar restricciones si no existen
      const [restriction, restrictionCreated] =
        await RestrictionLab.findOrCreate({
          where: { labId: lab.id },
          defaults: {
            max_groups: labData.restrictions.max_groups,
            min_group_size: labData.restrictions.min_group_size,
            max_group_size: labData.restrictions.max_group_size,
            description: labData.restrictions.description,
          },
        });

      if (restrictionCreated) {
        console.log(`✅ Restricción creada para ${lab.lab_name}`);
      } else {
        console.log(`⚠️ Restricción ya existía para ${lab.lab_name}`);
      }
    }
  } catch (error) {
    console.error("❌ Error al insertar laboratorios y restricciones:", error);
  }
};
