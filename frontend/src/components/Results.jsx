// frontend/src/components/Results.jsx
import React, { useState } from 'react';
import PlayerForm from './PlayerForm';

function Results({ 
    score, 
    correctAnswers, 
    incorrectAnswers, 
    totalQuestions, 
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

    const handleSaveSuccess = (result) => {
        setSaveResult(result);
        setShowSuccessMessage(true);
        setShowPlayerForm(false);
        
        // Mantener el mensaje más tiempo para Google Sheets
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 8000);
    };

    const handleSkipSave = () => {
        setShowPlayerForm(false);
    };

    const handleViewSpreadsheet = () => {
        if (saveResult?.spreadsheetUrl) {
            window.open(saveResult.spreadsheetUrl, '_blank');
        }
    };

    return (
        <div className="results-screen">
            <h2 className="results-title">¡Juego Terminado!</h2>
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
                    gameData={{
                        score,
                        correctAnswers,
                        incorrectAnswers,
                        totalQuestions,
                        gameEndTime,
                        percentage: Math.round((correctAnswers / totalQuestions) * 100)
                    }}
                    onSaveSuccess={handleSaveSuccess}
                    onSkipSave={handleSkipSave}
                />
            )}
            
            {showSuccessMessage && saveResult && (
                <div className="success-message">
                    <div className="success-header">
                        ✅ ¡Resultados guardados en Google Sheets!
                    </div>
                    <div className="success-details">
                        <p><strong>Total de registros:</strong> {saveResult.totalRecords}</p>
                        <p><strong>Plataforma:</strong> {saveResult.platform}</p>
                        {saveResult.updatedRange && (
                            <p><strong>Rango actualizado:</strong> {saveResult.updatedRange}</p>
                        )}
                    </div>
                    <div className="success-actions">
                        <button 
                            className="view-spreadsheet-button"
                            onClick={handleViewSpreadsheet}
                        >
                            👁️ Ver en Google Sheets
                        </button>
                    </div>
                </div>
            )}
            
            {!showPlayerForm && (
                <div className="final-actions">
                    <button className="play-again-button" onClick={onResetGame}>
                        🎮 Jugar de Nuevo
                    </button>
                    {saveResult?.spreadsheetUrl && (
                        <button 
                            className="view-spreadsheet-button secondary"
                            onClick={handleViewSpreadsheet}
                        >
                            📊 Ver Resultados Completos
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Results;