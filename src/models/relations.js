import { User } from "./users.js";
import { Lab } from "./labs.js";
import { RestrictionLab } from "./restrictions.js";
import { Reservation } from "./reservations.js";
import { Rol } from "./roles.js";

// Relación un laboratorio tiene una unica restricción
Lab.hasOne(RestrictionLab, { foreignKey: "labId" });
RestrictionLab.belongsTo(Lab, { foreignKey: "labId" });

// Relación un usuario tiene muchas reservas
User.hasMany(Reservation, { foreignKey: "userId" });
Reservation.belongsTo(User, { foreignKey: "userId" });

Lab.hasMany(Reservation, { foreignKey: "labId" });
Reservation.belongsTo(Lab, { foreignKey: "labId" });
