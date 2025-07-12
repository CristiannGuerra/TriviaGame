import React from 'react';

function Question({
  question,
  currentQuestion,
  totalQuestions,
  selectedOption,
  showAnswer,
  onSelectOption,
  onSubmitAnswer,
  onNextQuestion
}) {
  const getOptionClass = (optionIndex) => {
    if (!showAnswer) {
      return selectedOption === optionIndex ? 'option-button selected' : 'option-button';
    }

    if (optionIndex === question.correct) {
      return 'option-button correct';
    }

    if (selectedOption === optionIndex && optionIndex !== question.correct) {
      return 'option-button incorrect';
    }

    return 'option-button';
  };

  return (
    <div className="question-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="question-number">
        Pregunta {currentQuestion + 1} de {totalQuestions} • {question.category}
      </div>

      <div className="question-text">
        {question.question}
      </div>

      <div className="options-grid">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(index)}
            onClick={() => onSelectOption(index)}
          >
            {String.fromCharCode(65 + index)}. {option}
          </button>
        ))}
      </div>

      {!showAnswer ? (
        <button
          className="next-button"
          onClick={onSubmitAnswer}
          disabled={selectedOption === null}
        >
          Confirmar Respuesta
        </button>
      ) : (
        <div>
          <p className={`answer-feedback ${selectedOption === question.correct ? 'correct' : 'incorrect'}`}>
            {selectedOption === question.correct ? '¡Correcto! 🎉' : '¡Incorrecto! 😔'}
          </p>
          <button className="next-button" onClick={onNextQuestion}>
            {currentQuestion < totalQuestions - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Question;
