import express from "express";
import cors from "cors";
import { ENVIRONMENT } from "./src/config/env.config.js";
import { connectDB } from "./src/config/database.config.js";
import gameRoutes from "./src/routes/game.routes.js";

// Crear servidor
const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());

// Usar JSON
app.use(express.json({
    limit: "50mb"
}));

// Rutas
app.use("/api/game", gameRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        message: "Quiz Game API funcionando correctamente",
        version: "1.0.0",
        endpoints: {
            "POST /api/game/save-result": "Guardar resultado del juego",
            "GET /api/game/player-stats/:email": "Obtener estadísticas del jugador",
            "GET /api/game/player-history/:email": "Obtener historial del jugador",
            "GET /api/game/leaderboard": "Obtener tabla de clasificación",
            "GET /api/game/global-stats": "Obtener estadísticas globales"
        }
    });
});

// Ruta de salud
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: ENVIRONMENT.NODE_ENV
    });
});

// // Middleware de manejo de errores
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         message: "Error interno del servidor",
//         error: ENVIRONMENT.NODE_ENV === 'development' ? err.message : 'Error interno'
//     });
// });

// // Ruta 404
// app.use("*", (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: "Ruta no encontrada"
//     });
// });

// Iniciar servidor
app.listen(ENVIRONMENT.PORT, () => {
    console.log(`Servidor corriendo en puerto http://localhost:${ENVIRONMENT.PORT}`);
    console.log(`Entorno: ${ENVIRONMENT.NODE_ENV}`);
});