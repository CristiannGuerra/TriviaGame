// backend/src/controllers/game.controller.js
import Player from '../models/Players.js';
import GameResult from '../models/gameResult.js';

// Guardar resultado del juego
export const saveGameResult = async (req, res) => {
    try {
        const {
            playerData,
            gameData,
            userAgent,
            ipAddress
        } = req.body;

        // Validar datos requeridos
        if (!playerData || !gameData) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos del jugador o del juego'
            });
        }

        // Encontrar o crear el jugador
        const player = await Player.findOrCreate({
            name: playerData.name,
            email: playerData.email
        });

        // Crear el resultado del juego
        const gameResult = new GameResult({
            player: player._id,
            score: gameData.score,
            correctAnswers: gameData.correctAnswers,
            incorrectAnswers: gameData.incorrectAnswers,
            totalQuestions: gameData.totalQuestions,
            accuracy: gameData.accuracy,
            gameStartTime: gameData.gameStartTime,
            gameEndTime: gameData.gameEndTime,
            gameMode: gameData.gameMode || 'normal',
            difficulty: gameData.difficulty || 'medium',
            userAgent: userAgent || '',
            ipAddress: ipAddress || ''
        });

        await gameResult.save();

        // Actualizar estadísticas del jugador
        player.updateStats({
            score: gameData.score,
            correctAnswers: gameData.correctAnswers,
            totalQuestions: gameData.totalQuestions,
            accuracy: gameData.accuracy
        });

        await player.save();

        res.status(201).json({
            success: true,
            message: 'Resultado guardado exitosamente',
            data: {
                gameResult: {
                    id: gameResult._id,
                    score: gameResult.score,
                    accuracy: gameResult.accuracy,
                    performance: gameResult.performance,
                    formattedDuration: gameResult.formattedDuration
                },
                playerStats: {
                    totalGames: player.totalGames,
                    bestScore: player.bestScore,
                    averageScore: player.averageScore,
                    averageAccuracy: player.averageAccuracy
                }
            }
        });

    } catch (error) {
        console.error('Error al guardar resultado:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estadísticas del jugador
export const getPlayerStats = async (req, res) => {
    try {
        const { email } = req.params;

        const player = await Player.findOne({ email });
        
        if (!player) {
            return res.status(404).json({
                success: false,
                message: 'Jugador no encontrado'
            });
        }

        res.json({
            success: true,
            data: {
                name: player.name,
                email: player.email,
                stats: {
                    totalGames: player.totalGames,
                    totalScore: player.totalScore,
                    bestScore: player.bestScore,
                    averageScore: player.averageScore,
                    totalCorrectAnswers: player.totalCorrectAnswers,
                    totalQuestions: player.totalQuestions,
                    averageAccuracy: player.averageAccuracy,
                    bestAccuracy: player.bestAccuracy,
                    firstGameDate: player.firstGameDate,
                    lastGameDate: player.lastGameDate
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener historial de juegos del jugador
export const getPlayerHistory = async (req, res) => {
    try {
        const { email } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const player = await Player.findOne({ email });
        
        if (!player) {
            return res.status(404).json({
                success: false,
                message: 'Jugador no encontrado'
            });
        }

        const skip = (page - 1) * limit;
        
        const games = await GameResult.find({ player: player._id })
            .sort({ gameEndTime: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('score accuracy correctAnswers incorrectAnswers totalQuestions gameEndTime gameMode difficulty formattedDuration performance');

        const totalGames = await GameResult.countDocuments({ player: player._id });

        res.json({
            success: true,
            data: {
                games,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalGames / limit),
                    totalGames,
                    hasNextPage: page * limit < totalGames,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const { limit = 10, type = 'score' } = req.query;

        let topPlayers;

        if (type === 'score') {
            topPlayers = await GameResult.getTopPlayers(parseInt(limit));
        } else if (type === 'accuracy') {
            topPlayers = await GameResult.aggregate([
                {
                    $lookup: {
                        from: 'players',
                        localField: 'player',
                        foreignField: '_id',
                        as: 'playerInfo'
                    }
                },
                {
                    $unwind: '$playerInfo'
                },
                {
                    $group: {
                        _id: '$player',
                        name: { $first: '$playerInfo.name' },
                        email: { $first: '$playerInfo.email' },
                        bestScore: { $max: '$score' },
                        bestAccuracy: { $max: '$accuracy' },
                        totalGames: { $sum: 1 },
                        averageScore: { $avg: '$score' },
                        averageAccuracy: { $avg: '$accuracy' },
                        lastGame: { $max: '$gameEndTime' }
                    }
                },
                {
                    $sort: { bestAccuracy: -1, bestScore: -1 }
                },
                {
                    $limit: parseInt(limit)
                }
            ]);
        }

        res.json({
            success: true,
            data: {
                leaderboard: topPlayers,
                type: type
            }
        });

    } catch (error) {
        console.error('Error al obtener leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estadísticas globales
export const getGlobalStats = async (req, res) => {
    try {
        const globalStats = await GameResult.getGlobalStats();
        
        const totalPlayers = await Player.countDocuments();
        const activePlayersLastWeek = await Player.countDocuments({
            lastGameDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        res.json({
            success: true,
            data: {
                ...globalStats,
                totalPlayers,
                activePlayersLastWeek,
                globalAccuracy: globalStats.totalQuestions > 0 
                    ? Math.round((globalStats.totalCorrectAnswers / globalStats.totalQuestions) * 100) 
                    : 0
            }
        });

    } catch (error) {
        console.error('Error al obtener estadísticas globales:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};