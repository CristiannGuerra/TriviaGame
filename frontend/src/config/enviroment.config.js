
// Configuración de la aplicación
export const config = {
    // Google Sheets API Configuration
    googleSheets: {
        apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
        spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID,
        sheetName: import.meta.env.VITE_GOOGLE_SHEETS_SHEET_NAME || 'Resultados_Trivia',
        range: import.meta.env.VITE_GOOGLE_SHEETS_RANGE || 'A:I'
    },
    
    // Configuración de Excel local
    excel: {
        storageKey: 'triviaResults',
        filename: {
            prefix: 'Resultados_Trivia',
            historyPrefix: 'Historial_Completo_Trivia'
        }
    },
    
    // Configuración de la aplicación
    app: {
        name: 'Trivia Game',
        version: '1.0.0',
        defaultLocale: 'es-ES',
        timezone: 'America/Argentina/Buenos_Aires'
    }
};

// Validar configuración crítica
export const validateConfig = () => {
    const errors = [];
    
    // Validar Google Sheets
    if (!config.googleSheets.apiKey) {
        errors.push('Google Sheets API Key no configurada');
    }
    
    if (!config.googleSheets.spreadsheetId) {
        errors.push('Google Sheets Spreadsheet ID no configurado');
    }
    
    // Validar que no sean valores por defecto
    if (config.googleSheets.apiKey === 'TU_API_KEY_AQUI') {
        errors.push('Google Sheets API Key contiene valor por defecto');
    }
    
    if (config.googleSheets.spreadsheetId === 'TU_SPREADSHEET_ID_AQUI') {
        errors.push('Google Sheets Spreadsheet ID contiene valor por defecto');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Función para obtener URL del spreadsheet
export const getSpreadsheetUrl = () => {
    if (!config.googleSheets.spreadsheetId) return null;
    return `https://docs.google.com/spreadsheets/d/${config.googleSheets.spreadsheetId}`;
};

// Función para obtener configuración de fecha/hora
export const getDateTimeConfig = () => {
    return {
        locale: config.app.defaultLocale,
        timezone: config.app.timezone,
        format: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }
    };
};

export default config;