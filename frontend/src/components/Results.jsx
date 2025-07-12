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

  const getScoreMessage = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage === 100) return "¡Perfecto! 🏆";
    if (percentage >= 80) return "¡Excelente! 🌟";
    if (percentage >= 60) return "¡Muy bien! 👍";
    if (percentage >= 40) return "¡Bien! 👌";
    return "¡Sigue practicando! 💪";
  };

  const handleSaveSuccess = () => {
    setShowSuccessMessage(true);
    setShowPlayerForm(false);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleSkipSave = () => {
    setShowPlayerForm(false);
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
      
      {showSuccessMessage && (
        <div className="success-message">
          ✅ ¡Resultados guardados exitosamente en el archivo Excel!
        </div>
      )}
      
      {!showPlayerForm && (
        <button className="play-again-button" onClick={onResetGame}>
          🎮 Jugar de Nuevo
        </button>
      )}
    </div>
  );
}

export default Results;
