const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    SAVE_GAME_RESULT: `${API_BASE_URL}/api/game/save-result`,
    GET_PLAYER_STATS: `${API_BASE_URL}/api/game/player-stats`,
    GET_PLAYER_HISTORY: `${API_BASE_URL}/api/game/player-history`,
    GET_LEADERBOARD: `${API_BASE_URL}/api/game/leaderboard`,
    GET_GLOBAL_STATS: `${API_BASE_URL}/api/game/global-stats`
};

// Función helper para hacer peticiones HTTP
export const apiRequest = async (url, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};