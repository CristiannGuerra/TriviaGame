// frontend/src/components/Results.jsx
import React, { useState } from 'react';
import PlayerForm from './PlayerForm';

function Results({ 
    score, 
    correctAnswers, 
    incorrectAnswers, 
    totalQuestions, 
    difficulty,
    gameStartTime,
    gameEndTime, 
    onResetGame 
}) {
    const [showPlayerForm, setShowPlayerForm] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [saveResult, setSaveResult] = useState(null);

    const getScoreMessage = () => {
        const percentage = (correctAnswers / totalQuestions) * 100;
        if (percentage === 100) return "¡Perfecto! 🏆";
        if (percentage >= 80) return "¡Excelente! 🌟";
        if (percentage >= 60) return "¡Muy bien! 👍";
        if (percentage >= 40) return "¡Bien! 👌";
        return "¡Sigue practicando! 💪";
    };

    const getDifficultyDisplay = () => {
        switch(difficulty) {
            case 'easy': return { text: 'Fácil', icon: '🟢', color: 'green' };
            case 'medium': return { text: 'Medio', icon: '🟡', color: 'yellow' };
            case 'hard': return { text: 'Difícil', icon: '🔴', color: 'red' };
            default: return { text: 'Normal', icon: '⚪', color: 'gray' };
        }
    };

    const handleSaveSuccess = (result) => {
        setSaveResult(result);
        setShowSuccessMessage(true);
        setShowPlayerForm(false);
        
        // Ocultar mensaje después de 8 segundos
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 8000);
    };

    const handleSkipSave = () => {
        setShowPlayerForm(false);
    };

    const difficultyInfo = getDifficultyDisplay();

    const gameData = {
        score,
        correctAnswers,
        incorrectAnswers,
        totalQuestions,
        gameStartTime,
        gameEndTime,
        accuracy: Math.round((correctAnswers / totalQuestions) * 100),
        gameMode: 'normal',
        difficulty: difficulty
    };

    return (
        <div className="results-screen">
            <h2 className="results-title">¡Juego Terminado!</h2>
            
            <div className="difficulty-completed">
                <span className={`difficulty-badge ${difficulty}`}>
                    {difficultyInfo.icon} {difficultyInfo.text}
                </span>
            </div>
            
            <div className="final-score">{getScoreMessage()}</div>
            
            <div className="score-breakdown">
                <div className="score-stat">
                    <div className="score-stat-number">{score}</div>
                    <div className="score-stat-label">Puntos</div>
                </div>
                <div className="score-stat">
                    <div className="score-stat-number">{correctAnswers}</div>
                    <div className="score-stat-label">Correctas</div>
                </div>
                <div className="score-stat">
                    <div className="score-stat-number">{incorrectAnswers}</div>
                    <div className="score-stat-label">Incorrectas</div>
                </div>
                <div className="score-stat">
                    <div className="score-stat-number">{Math.round((correctAnswers / totalQuestions) * 100)}%</div>
                    <div className="score-stat-label">Precisión</div>
                </div>
            </div>
            
            {showPlayerForm && (
                <PlayerForm
                    gameData={gameData}
                    onSaveSuccess={handleSaveSuccess}
                    onSkipSave={handleSkipSave}
                />
            )}
            
            {showSuccessMessage && saveResult && (
                <div className="success-message">
                    <div className="success-header">
                        ✅ ¡Resultados guardados exitosamente!
                    </div>
                    <div className="success-details">
                        <p>{saveResult.message}</p>
                        {saveResult.data && (
                            <div className="player-stats">
                                <p><strong>Juegos totales:</strong> {saveResult.data.playerStats?.totalGames}</p>
                                <p><strong>Mejor puntuación:</strong> {saveResult.data.playerStats?.bestScore}</p>
                                <p><strong>Promedio:</strong> {saveResult.data.playerStats?.averageScore}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {!showPlayerForm && (
                <div className="final-actions">
                    <button className="play-again-button" onClick={onResetGame}>
                        🎮 Jugar de Nuevo
                    </button>
                </div>
            )}
        </div>
    );
}

export default Results;