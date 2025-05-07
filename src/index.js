import app from "./app.js";
import { iniciarVerificacionAutomatica } from "./controllers/reservations/reservationsController.js";
import { sequelize } from "./database/database.js";
import "./models/relations.js";
import { insertDefaultLabsAndRestrictions } from "./models/restrictions.js";

async function main() {
  try {
    //await sequelize.authenticate();
    // console.log(
    //   "✅ La conexión con la base de datos se ha realizado con éxito."
    // );

    // Sincronizar base de datos (eliminar y recrear todas las tablas)
    //await sequelize.sync({ force: true });

    // Insertar datos después de la sincronización
    //await insertDefaultLabsAndRestrictions();

    // Iniciar la verificación automática al arrancar el servidor
    iniciarVerificacionAutomatica();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(
        `✅ ¡Hecho! Servidor activo y escuchando en el puerto: ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Lo sentimos, no hemos podido conectarnos con el servidor en este momento. Estamos en ello para solucionarlo pronto.",
      error
    );
  }
}

main();
