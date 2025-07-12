import React from 'react';

function ScoreBoard({ score, currentQuestion, totalQuestions, correctAnswers }) {
    return (
        <div className="score-board">
            <div className="score-item">
                <div>Puntuación: {score}</div>
            </div>
            <div className="score-item">
                <div>Pregunta: {currentQuestion}/{totalQuestions}</div>
            </div>
            <div className="score-item">
                <div>Correctas: {correctAnswers}</div>
            </div>
        </div>
    );
}

export default ScoreBoard;
