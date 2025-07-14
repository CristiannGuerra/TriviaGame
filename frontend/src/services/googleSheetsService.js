import { validatePlayerData } from '../utils/validation';

// Configuración de Google Sheets API
const GOOGLE_SHEETS_CONFIG = {
    // Reemplaza con tu API Key de Google
    API_KEY: 'TU_API_KEY_AQUI',
    // Reemplaza con el ID de tu Google Spreadsheet
    SPREADSHEET_ID: 'TU_SPREADSHEET_ID_AQUI',
    // Nombre de la hoja donde se guardarán los datos
    SHEET_NAME: 'Resultados_Trivia',
    // Rango donde se insertarán los datos
    RANGE: 'A:I'
};

class GoogleSheetsService {
    constructor() {
        this.baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}`;
        this.isInitialized = false;
    }

    // Inicializar la API de Google Sheets
    async initialize() {
        if (this.isInitialized) return true;

        try {
            // Verificar si la API Key está configurada
            if (!GOOGLE_SHEETS_CONFIG.API_KEY || GOOGLE_SHEETS_CONFIG.API_KEY === 'TU_API_KEY_AQUI') {
                throw new Error('API Key de Google no configurada');
            }

            // Verificar si el Spreadsheet ID está configurado
            if (!GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID || GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID === 'TU_SPREADSHEET_ID_AQUI') {
                throw new Error('Spreadsheet ID no configurado');
            }

            // Verificar conexión con Google Sheets
            await this.getSheetData();
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Error inicializando Google Sheets:', error);
            throw error;
        }
    }

    // Obtener datos existentes de la hoja
    async getSheetData() {
        try {
            const url = `${this.baseUrl}/values/${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!${GOOGLE_SHEETS_CONFIG.RANGE}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data.values || [];
        } catch (error) {
            console.error('Error obteniendo datos de Google Sheets:', error);
            throw error;
        }
    }

    // Crear encabezados si no existen
    async ensureHeaders() {
        try {
            const data = await this.getSheetData();
            
            if (data.length === 0) {
                // No hay datos, crear encabezados
                const headers = [
                    'ID',
                    'Nombre',
                    'Email',
                    'Puntuación',
                    'Respuestas Correctas',
                    'Respuestas Incorrectas',
                    'Porcentaje de Precisión',
                    'Total de Preguntas',
                    'Fecha y Hora'
                ];

                await this.appendRow(headers);
                return true;
            }

            return false; // Ya existen encabezados
        } catch (error) {
            console.error('Error creando encabezados:', error);
            throw error;
        }
    }

    // Agregar una fila a la hoja
    async appendRow(values) {
        try {
            const url = `${this.baseUrl}/values/${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!${GOOGLE_SHEETS_CONFIG.RANGE}:append?valueInputOption=USER_ENTERED&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: [values]
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error agregando fila:', error);
            throw error;
        }
    }

    // Guardar resultado del juego
    async saveGameResult(gameData) {
        try {
            await this.initialize();
            await this.ensureHeaders();

            const timestamp = new Date().toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Argentina/Buenos_Aires'
            });

            const rowData = [
                Date.now(), // ID único
                gameData.name,
                gameData.email,
                gameData.score,
                gameData.correctAnswers,
                gameData.incorrectAnswers,
                `${gameData.percentage}%`,
                gameData.totalQuestions,
                timestamp
            ];

            const result = await this.appendRow(rowData);
            
            // Obtener cantidad total de registros
            const allData = await this.getSheetData();
            const totalRecords = allData.length - 1; // Restar 1 por los encabezados

            return {
                success: true,
                totalRecords,
                updatedRange: result.updates?.updatedRange || '',
                spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}`
            };
        } catch (error) {
            console.error('Error guardando en Google Sheets:', error);
            throw error;
        }
    }

    // Obtener estadísticas de los resultados
    async getResultsStats() {
        try {
            await this.initialize();
            const data = await this.getSheetData();
            
            if (data.length <= 1) { // Solo encabezados o vacío
                return null;
            }

            const results = data.slice(1); // Omitir encabezados
            const scores = results.map(row => parseInt(row[3]) || 0);
            const percentages = results.map(row => parseInt(row[6]) || 0);

            return {
                totalGames: results.length,
                averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
                bestScore: Math.max(...scores),
                worstScore: Math.min(...scores),
                averageAccuracy: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length),
                bestAccuracy: Math.max(...percentages),
                lastPlayedDate: results[results.length - 1][8] || 'N/A'
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return null;
        }
    }

    // Obtener cantidad de registros
    async getResultsCount() {
        try {
            await this.initialize();
            const data = await this.getSheetData();
            return Math.max(0, data.length - 1); // Restar 1 por los encabezados
        } catch (error) {
            console.error('Error obteniendo cantidad de registros:', error);
            return 0;
        }
    }

    // Verificar si el servicio está disponible
    async isServiceAvailable() {
        try {
            await this.initialize();
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Instancia singleton del servicio
const googleSheetsService = new GoogleSheetsService();

// Funciones públicas para usar en los componentes
export const saveToGoogleSheets = async (playerData, gameData) => {
    try {
        // Validar datos del jugador
        const validation = validatePlayerData(playerData);
        if (!validation.isValid) {
            throw new Error('Datos del jugador no válidos');
        }

        const completeData = {
            name: playerData.name.trim(),
            email: playerData.email.trim(),
            score: gameData.score,
            correctAnswers: gameData.correctAnswers,
            incorrectAnswers: gameData.incorrectAnswers,
            percentage: gameData.percentage,
            totalQuestions: gameData.totalQuestions
        };

        return await googleSheetsService.saveGameResult(completeData);
    } catch (error) {
        console.error('Error en saveToGoogleSheets:', error);
        throw error;
    }
};

export const getResultsCount = async () => {
    try {
        return await googleSheetsService.getResultsCount();
    } catch (error) {
        console.error('Error obteniendo cantidad de registros:', error);
        return 0;
    }
};

export const getResultsStats = async () => {
    try {
        return await googleSheetsService.getResultsStats();
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return null;
    }
};

export const isGoogleSheetsAvailable = async () => {
    try {
        return await googleSheetsService.isServiceAvailable();
    } catch (error) {
        return false;
    }
};

export const getSpreadsheetUrl = () => {
    return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}`;
};

// Configuración
export const updateConfig = (newConfig) => {
    Object.assign(GOOGLE_SHEETS_CONFIG, newConfig);
    googleSheetsService.isInitialized = false;
};

export default googleSheetsService;