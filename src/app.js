import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import usersRoutes from "./routes/users/user.routes.js";
import labsRoutes from "./routes/labs/labs.routes.js";
import restrictionsLabsRoutes from "./routes/restrictions/restrictionslabs.routes.js";
import reservationRoutes from "./routes/reservations/reservations.routes.js";
import authRoutes from "./routes/authentication/authentication.routes.js";

const app = express();

// ⚡ Configurar CORS
const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Rura principal de la API
app.use("/api/neseo/v1", (req, res) => {
  res.send("API NESEO Funcionando correctamente.");
});

//Rutas de usuarios
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/labs", labsRoutes);
app.use("/api/v1/restrictions", restrictionsLabsRoutes);
app.use("/api/v1/reservations", reservationRoutes);

export default app;
