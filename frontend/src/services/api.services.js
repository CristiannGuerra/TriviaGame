// frontend/src/services/api.service.js
import { API_ENDPOINTS, apiRequest } from '../config/api.config.js';

export const gameService = {
    // Guardar resultado del juego
    saveGameResult: async (playerData, gameData) => {
        const requestData = {
            playerData,
            gameData: {
                ...gameData,
                gameStartTime: gameData.gameStartTime || new Date(),
                gameEndTime: gameData.gameEndTime || new Date(),
                accuracy: Math.round((gameData.correctAnswers / gameData.totalQuestions) * 100)
            },
            userAgent: navigator.userAgent,
            ipAddress: null // Se puede obtener en el backend
        };

        return await apiRequest(API_ENDPOINTS.SAVE_GAME_RESULT, {
            method: 'POST',
            body: JSON.stringify(requestData)
        });
    },

    // Obtener estadísticas del jugador
    getPlayerStats: async (email) => {
        return await apiRequest(`${API_ENDPOINTS.GET_PLAYER_STATS}/${encodeURIComponent(email)}`);
    },

    // Obtener historial de juegos del jugador
    getPlayerHistory: async (email, page = 1, limit = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        
        return await apiRequest(
            `${API_ENDPOINTS.GET_PLAYER_HISTORY}/${encodeURIComponent(email)}?${params}`
        );
    },

    // Obtener leaderboard
    getLeaderboard: async (limit = 10, type = 'score') => {
        const params = new URLSearchParams({
            limit: limit.toString(),
            type
        });
        
        return await apiRequest(`${API_ENDPOINTS.GET_LEADERBOARD}?${params}`);
    },

    // Obtener estadísticas globales
    getGlobalStats: async () => {
        return await apiRequest(API_ENDPOINTS.GET_GLOBAL_STATS);
    }
};