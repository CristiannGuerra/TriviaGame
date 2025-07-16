export const validatePlayerData = (playerData) => {
    const errors = {};
    let isValid = true;

    // Validación del nombre
    if (!playerData.name || playerData.name.trim().length === 0) {
        errors.name = 'El nombre es requerido';
        isValid = false;
    } else if (playerData.name.trim().length < 2) {
        errors.name = 'El nombre debe tener al menos 2 caracteres';
        isValid = false;
    } else if (playerData.name.trim().length > 50) {
        errors.name = 'El nombre no puede exceder 50 caracteres';
        isValid = false;
    }

    // Validación del email
    if (!playerData.email || playerData.email.trim().length === 0) {
        errors.email = 'El email es requerido';
        isValid = false;
    } else if (playerData.email.trim().length > 100) {
        errors.email = 'El email no puede exceder 100 caracteres';
        isValid = false;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(playerData.email.trim())) {
            errors.email = 'Por favor ingresa un email válido';
            isValid = false;
        }
    }

    return {
        isValid,
        errors
    };
};

export const validateGameData = (gameData) => {
    const errors = {};
    let isValid = true;

    // Validación básica de datos del juego
    if (!gameData.score || gameData.score < 0) {
        errors.score = 'La puntuación debe ser mayor o igual a 0';
        isValid = false;
    }

    if (!gameData.totalQuestions || gameData.totalQuestions < 1) {
        errors.totalQuestions = 'Debe haber al menos una pregunta';
        isValid = false;
    }

    if (gameData.correctAnswers < 0) {
        errors.correctAnswers = 'Las respuestas correctas no pueden ser negativas';
        isValid = false;
    }

    if (gameData.incorrectAnswers < 0) {
        errors.incorrectAnswers = 'Las respuestas incorrectas no pueden ser negativas';
        isValid = false;
    }

    // Validar que las respuestas sumen el total
    if (gameData.correctAnswers + gameData.incorrectAnswers !== gameData.totalQuestions) {
        errors.answers = 'El total de respuestas no coincide con el número de preguntas';
        isValid = false;
    }

    return {
        isValid,
        errors
    };
};