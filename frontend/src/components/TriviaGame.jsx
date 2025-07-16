import React, { useState, useEffect } from 'react';
import Question from './Question';
import Results from './Results';
import PlayerForm from './PlayerForm';
import ScoreBoard from './ScoreBoard'
import { triviaQuestions } from '../utils/questions';

function TriviaGame() {
    const [gameState, setGameState] = useState('start');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [gameStartTime, setGameStartTime] = useState(null);
    const [gameEndTime, setGameEndTime] = useState(null);

    const startGame = () => {
        const shuffledQuestions = [...triviaQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        setCurrentQuestion(0);
        setSelectedOption(null);
        setShowAnswer(false);
        setScore(0);
        setCorrectAnswers(0);
        setIncorrectAnswers(0);
        setGameStartTime(new Date());
        setGameEndTime(null);
        setGameState('playing');
    };

    const selectOption = (optionIndex) => {
        if (showAnswer) return;
        setSelectedOption(optionIndex);
    };

    const submitAnswer = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === questions[currentQuestion].correct;

        if (isCorrect) {
            setScore(score + 100);
            setCorrectAnswers(correctAnswers + 1);
        } else {
            setIncorrectAnswers(incorrectAnswers + 1);
        }

        setShowAnswer(true);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setShowAnswer(false);
        } else {
            const endTime = new Date();
            setGameEndTime(endTime);
            setGameState('results');
        }
    };

    const resetGame = () => {
        setGameState('start');
        setGameStartTime(null);
        setGameEndTime(null);
    };

    return (
        <div className="app-container">
            <div className="header">
                <h1>🧠 Trivia Master</h1>
                {gameState === 'playing' && (
                    <ScoreBoard
                        score={score}
                        currentQuestion={currentQuestion + 1}
                        totalQuestions={questions.length}
                        correctAnswers={correctAnswers}
                    />
                )}
            </div>

            <div className="game-container">
                {gameState === 'start' && (
                    <div className="start-screen">
                        <h2>¡Bienvenido a Trivia Master!</h2>
                        <p>Pon a prueba tus conocimientos con {triviaQuestions.length} preguntas de diferentes categorías.</p>
                        <button className="start-button" onClick={startGame}>
                            🚀 Comenzar Juego
                        </button>
                    </div>
                )}

                {gameState === 'playing' && questions.length > 0 && (
                    <Question
                        question={questions[currentQuestion]}
                        currentQuestion={currentQuestion}
                        totalQuestions={questions.length}
                        selectedOption={selectedOption}
                        showAnswer={showAnswer}
                        onSelectOption={selectOption}
                        onSubmitAnswer={submitAnswer}
                        onNextQuestion={nextQuestion}
                    />
                )}

                {gameState === 'results' && (
                    <Results
                        score={score}
                        correctAnswers={correctAnswers}
                        incorrectAnswers={incorrectAnswers}
                        totalQuestions={questions.length}
                        gameStartTime={gameStartTime}
                        gameEndTime={gameEndTime}
                        onResetGame={resetGame}
                    />
                )}
            </div>
        </div>
    );
}

export default TriviaGame;