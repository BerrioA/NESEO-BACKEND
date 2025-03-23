import app from "./app.js";

async function main() {
  try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("✅ Servidor corriendo en el puerto:", PORT);
    });
  } catch (error) {
    console.error(
      "❌ Error al intentar establecer la conexión con el servidor."
    );
    console.error(error);
  }
}

main();
