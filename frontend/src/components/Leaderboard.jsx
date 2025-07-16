// frontend/src/components/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api.service';

function Leaderboard({ onClose }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [globalStats, setGlobalStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [leaderboardType, setLeaderboardType] = useState('score');

    useEffect(() => {
        loadLeaderboard();
        loadGlobalStats();
    }, [leaderboardType]);

    const loadLeaderboard = async () => {
        try {
            setIsLoading(true);
            const response = await gameService.getLeaderboard(10, leaderboardType);
            setLeaderboard(response.data.leaderboard);
            setError(null);
        } catch (err) {
            setError('Error al cargar el leaderboard');
            console.error('Error loading leaderboard:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadGlobalStats = async () => {
        try {
            const response = await gameService.getGlobalStats();
            setGlobalStats(response.data);
        } catch (err) {
            console.error('Error loading global stats:', err);
        }
    };

    const getRankIcon = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    return (
        <div className="leaderboard-overlay">
            <div className="leaderboard-container">
                <div className="leaderboard-header">
                    <h2>🏆 Ranking Global</h2>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>

                {globalStats && (
                    <div className="global-stats">
                        <div className="stat-item">
                            <span className="stat-label">Juegos totales:</span>
                            <span className="stat-value">{globalStats.totalGames}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Jugadores activos:</span>
                            <span className="stat-value">{globalStats.totalPlayers}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Precisión global:</span>
                            <span className="stat-value">{globalStats.globalAccuracy}%</span>
                        </div>
                    </div>
                )}

                <div className="leaderboard-controls">
                    <button
                        className={`control-button ${leaderboardType === 'score' ? 'active' : ''}`}
                        onClick={() => setLeaderboardType('score')}
                    >
                        🏆 Por Puntuación
                    </button>
                    <button
                        className={`control-button ${leaderboardType === 'accuracy' ? 'active' : ''}`}
                        onClick={() => setLeaderboardType('accuracy')}
                    >
                        🎯 Por Precisión
                    </button>
                </div>

                <div className="leaderboard-content">
                    {isLoading ? (
                        <div className="loading">Cargando ranking...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        <div className="leaderboard-list">
                            {leaderboard.map((player, index) => (
                                <div key={player._id} className="leaderboard-item">
                                    <div className="rank">{getRankIcon(index)}</div>
                                    <div className="player-info">
                                        <div className="player-name">{player.name}</div>
                                        <div className="player-stats">
                                            {leaderboardType === 'score' ? (
                                                <span>Mejor: {player.bestScore} pts</span>
                                            ) : (
                                                <span>Mejor: {player.bestAccuracy}%</span>
                                            )}
                                            <span>Juegos: {player.totalGames}</span>
                                        </div>
                                    </div>
                                    <div className="player-score">
                                        {leaderboardType === 'score' ? (
                                            <span className="score">{player.bestScore}</span>
                                        ) : (
                                            <span className="accuracy">{player.bestAccuracy}%</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;