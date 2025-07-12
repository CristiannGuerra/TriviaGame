export const validatePlayerData = (data) => {
    const errors = {};

    // Validar nombre
    if (!data.name || !data.name.trim()) {
        errors.name = 'El nombre es requerido';
    } else if (data.name.trim().length < 2) {
        errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (data.name.trim().length > 50) {
        errors.name = 'El nombre no puede tener más de 50 caracteres';
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(data.name.trim())) {
        errors.name = 'El nombre solo puede contener letras y espacios';
    }

    // Validar email
    if (!data.email || !data.email.trim()) {
        errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        errors.email = 'El email no tiene un formato válido';
    } else if (data.email.trim().length > 100) {
        errors.email = 'El email no puede tener más de 100 caracteres';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .trim()
        .replace(/[<>]/g, '') // Remover caracteres HTML básicos
        .substring(0, 100); // Limitar longitud
};
