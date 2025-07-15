import express from 'express';
import {
    saveGameResult,
    getPlayerStats,
    getLeaderboard,
    getGlobalStats,
    getPlayerHistory
} from '../controllers/game.controller.js';


const router = express.Router();

// Guardar resultado del juego
router.post('/save-result', saveGameResult);

// Obtener estadísticas del jugador
router.get('/player-stats/:email', getPlayerStats);

// Obtener historial de juegos del jugador
router.get('/player-history/:email', getPlayerHistory);

// Obtener leaderboard
router.get('/leaderboard', getLeaderboard);

// Obtener estadísticas globales
router.get('/global-stats', getGlobalStats);

export default router;