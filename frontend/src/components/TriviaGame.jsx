import React, { useState, useEffect } from 'react';
import Question from './Question';
import Results from './Results';
import PlayerForm from './PlayerForm';
import ScoreBoard from './ScoreBoard'
import { triviaQuestions } from '../utils/questions';
import { GAME_CONSTANTS } from '../utils/constants';

function TriviaGame() {
    const [gameState, setGameState] = useState('start');
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [gameStartTime, setGameStartTime] = useState(null);
    const [gameEndTime, setGameEndTime] = useState(null);

    const getDifficultyQuestions = (difficulty) => {
        return triviaQuestions.filter(question => question.difficulty === difficulty);
    };

    const getRandomQuestions = (questionsArray, count = GAME_CONSTANTS.MAX_QUESTIONS) => {
        const shuffled = [...questionsArray].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    const selectDifficulty = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setGameState('difficulty-selected');
    };

    const startGame = () => {
        if (!selectedDifficulty) return;

        const difficultyQuestions = getDifficultyQuestions(selectedDifficulty);
        
        if (difficultyQuestions.length === 0) {
            alert(`No hay preguntas disponibles para la dificultad ${selectedDifficulty}`);
            return;
        }

        const selectedQuestions = getRandomQuestions(difficultyQuestions);
        
        setQuestions(selectedQuestions);
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
            setScore(score + GAME_CONSTANTS.POINTS_PER_CORRECT_ANSWER);
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
        setSelectedDifficulty(null);
        setGameStartTime(null);
        setGameEndTime(null);
    };

    const goBackToStart = () => {
        setGameState('start');
        setSelectedDifficulty(null);
    };

    const getDifficultyInfo = () => {
        const counts = {
            easy: getDifficultyQuestions('easy').length,
            medium: getDifficultyQuestions('medium').length,
            hard: getDifficultyQuestions('hard').length
        };
        return counts;
    };

    const difficultyInfo = getDifficultyInfo();

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
                        <p>Pon a prueba tus conocimientos con preguntas de diferentes categorías.</p>
                        <p>Selecciona la dificultad para comenzar:</p>
                        
                        <div className="difficulty-selection">
                            <button 
                                className="difficulty-button easy" 
                                onClick={() => selectDifficulty('easy')}
                                disabled={difficultyInfo.easy === 0}
                            >
                                <div className="difficulty-icon">🟢</div>
                                <div className="difficulty-info">
                                    <h3>Fácil</h3>
                                    <p>Preguntas básicas y conocimiento general</p>
                                    <span className="question-count">
                                        {difficultyInfo.easy} preguntas disponibles
                                    </span>
                                </div>
                            </button>
                            
                            <button 
                                className="difficulty-button medium" 
                                onClick={() => selectDifficulty('medium')}
                                disabled={difficultyInfo.medium === 0}
                            >
                                <div className="difficulty-icon">🟡</div>
                                <div className="difficulty-info">
                                    <h3>Medio</h3>
                                    <p>Preguntas de dificultad intermedia</p>
                                    <span className="question-count">
                                        {difficultyInfo.medium} preguntas disponibles
                                    </span>
                                </div>
                            </button>
                            
                            <button 
                                className="difficulty-button hard" 
                                onClick={() => selectDifficulty('hard')}
                                disabled={difficultyInfo.hard === 0}
                            >
                                <div className="difficulty-icon">🔴</div>
                                <div className="difficulty-info">
                                    <h3>Difícil</h3>
                                    <p>Preguntas desafiantes para expertos</p>
                                    <span className="question-count">
                                        {difficultyInfo.hard} preguntas disponibles
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'difficulty-selected' && (
                    <div className="difficulty-selected-screen">
                        <h2>Dificultad Seleccionada</h2>
                        <div className="selected-difficulty-info">
                            <div className={`difficulty-badge ${selectedDifficulty}`}>
                                {selectedDifficulty === 'easy' && '🟢 Fácil'}
                                {selectedDifficulty === 'medium' && '🟡 Medio'}
                                {selectedDifficulty === 'hard' && '🔴 Difícil'}
                            </div>
                            <p>Se seleccionarán {Math.min(getDifficultyQuestions(selectedDifficulty).length, GAME_CONSTANTS.MAX_QUESTIONS)} preguntas al azar</p>
                        </div>
                        
                        <div className="game-actions">
                            <button className="start-button" onClick={startGame}>
                                🚀 Comenzar Juego
                            </button>
                            <button className="back-button" onClick={goBackToStart}>
                                ← Cambiar Dificultad
                            </button>
                        </div>
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
                        difficulty={selectedDifficulty}
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