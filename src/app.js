import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

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

// Routes
app.use("/", (req, res) => {
  res.send("API NESEO Funcionando correctamente.");
});

export default app;
