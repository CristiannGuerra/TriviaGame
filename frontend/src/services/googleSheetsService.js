import { config, validateConfig, getDateTimeConfig } from '../config/enviroment.config';
import { validatePlayerData } from '../utils/validation';

class GoogleSheetsService {
    constructor() {
        this.config = config.googleSheets;
        this.baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}`;
        this.isInitialized = false;
    }

    // Inicializar la API de Google Sheets
    async initialize() {
        if (this.isInitialized) return true;

        try {
            // Validar configuración
            const validation = validateConfig();
            if (!validation.isValid) {
                throw new Error(`Configuración inválida: ${validation.errors.join(', ')}`);
            }

            // Verificar conexión con Google Sheets
            await this.getSheetData();
            this.isInitialized = true;
            console.log('Google Sheets Service inicializado correctamente');
            return true;
        } catch (error) {
            console.error('Error inicializando Google Sheets:', error);
            throw error;
        }
    }

    // Obtener datos existentes de la hoja
    async getSheetData() {
        try {
            const url = `${this.baseUrl}/values/${this.config.sheetName}!${this.config.range}?key=${this.config.apiKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP ${response.status}: ${errorText}`);
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
                console.log('Encabezados creados en Google Sheets');
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error creando encabezados:', error);
            throw error;
        }
    }

    // Agregar una fila a la hoja
    async appendRow(values) {
        try {
            const url = `${this.baseUrl}/values/${this.config.sheetName}!${this.config.range}:append?valueInputOption=USER_ENTERED&key=${this.config.apiKey}`;
            
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
                const errorText = await response.text();
                throw new Error(`Error HTTP ${response.status}: ${errorText}`);
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

            const dateTimeConfig = getDateTimeConfig();
            const timestamp = new Date().toLocaleString(dateTimeConfig.locale, {
                ...dateTimeConfig.format,
                timeZone: dateTimeConfig.timezone
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

            console.log(`Resultado guardado en Google Sheets. Total de registros: ${totalRecords}`);

            return {
                success: true,
                totalRecords,
                updatedRange: result.updates?.updatedRange || '',
                spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${this.config.spreadsheetId}`
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
            console.error('Google Sheets Service no disponible:', error.message);
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
    return `https://docs.google.com/spreadsheets/d/${config.googleSheets.spreadsheetId}`;
};

export default googleSheetsService;