// frontend/src/components/PlayerForm.jsx
import React, { useState, useEffect } from 'react';
import { 
    saveToGoogleSheets, 
    getResultsCount, 
    getResultsStats, 
    isGoogleSheetsAvailable,
    getSpreadsheetUrl
} from '../services/googleSheetsService';
import { validatePlayerData } from '../utils/validation';

function PlayerForm({ gameData, onSaveSuccess, onSkipSave }) {
    const [playerData, setPlayerData] = useState({ name: '', email: '' });
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [recordsCount, setRecordsCount] = useState(0);
    const [stats, setStats] = useState(null);
    const [isServiceAvailable, setIsServiceAvailable] = useState(false);
    const [isCheckingService, setIsCheckingService] = useState(true);

    useEffect(() => {
        // Verificar si Google Sheets está disponible y cargar datos
        const checkServiceAndLoadData = async () => {
            try {
                setIsCheckingService(true);
                
                // Verificar si el servicio está disponible
                const available = await isGoogleSheetsAvailable();
                setIsServiceAvailable(available);
                
                if (available) {
                    // Cargar información de registros existentes
                    const count = await getResultsCount();
                    const statistics = await getResultsStats();
                    setRecordsCount(count);
                    setStats(statistics);
                }
            } catch (error) {
                console.error('Error verificando servicio:', error);
                setIsServiceAvailable(false);
            } finally {
                setIsCheckingService(false);
            }
        };

        checkServiceAndLoadData();
    }, []);

    const handleInputChange = (field, value) => {
        setPlayerData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSave = async () => {
        if (!isServiceAvailable) {
            setFormErrors({ 
                general: 'Google Sheets no está disponible. Verifica la configuración.' 
            });
            return;
        }

        const validation = validatePlayerData(playerData);
        
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return;
        }

        setIsLoading(true);
        
        try {
            const result = await saveToGoogleSheets(playerData, gameData);
            
            // Mostrar mensaje de éxito con información del resultado
            console.log('Datos guardados en Google Sheets');
            console.log(`Total de registros: ${result.totalRecords}`);
            console.log(`URL del spreadsheet: ${result.spreadsheetUrl}`);
            
            onSaveSuccess({
                ...result,
                platform: 'Google Sheets',
                spreadsheetUrl: result.spreadsheetUrl
            });
        } catch (error) {
            console.error('Error al guardar:', error);
            
            let errorMessage = 'Error al guardar los datos. Intenta nuevamente.';
            
            if (error.message.includes('API Key')) {
                errorMessage = 'Error de configuración: API Key no válida.';
            } else if (error.message.includes('Spreadsheet ID')) {
                errorMessage = 'Error de configuración: ID de spreadsheet no válido.';
            } else if (error.message.includes('HTTP')) {
                errorMessage = 'Error de conexión con Google Sheets.';
            }
            
            setFormErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewSpreadsheet = () => {
        const url = getSpreadsheetUrl();
        window.open(url, '_blank');
    };

    if (isCheckingService) {
        return (
            <div className="player-form">
                <div className="loading-service">
                    <h3>🔄 Verificando Google Sheets...</h3>
                    <p>Conectando con el servicio...</p>
                </div>
            </div>
        );
    }

    if (!isServiceAvailable) {
        return (
            <div className="player-form">
                <div className="service-unavailable">
                    <h3>⚠️ Google Sheets No Disponible</h3>
                    <p>El servicio de Google Sheets no está configurado o no está disponible.</p>
                    <p>Por favor, verifica la configuración de la API Key y el Spreadsheet ID.</p>
                    <button className="skip-button" onClick={onSkipSave}>
                        Continuar sin Guardar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="player-form">
            <h3>📊 Guardar en Google Sheets</h3>
            <p>Ingresa tus datos para guardar tu puntuación en Google Sheets</p>
            
            {/* Información de registros existentes */}
            {recordsCount > 0 && (
                <div className="records-info">
                    <p>📊 Registros existentes: <strong>{recordsCount}</strong></p>
                    {stats && (
                        <div className="stats-preview">
                            <small>
                                Promedio: {stats.averageScore} pts ({stats.averageAccuracy}% precisión) | 
                                Mejor: {stats.bestScore} pts | 
                                Última partida: {stats.lastPlayedDate}
                            </small>
                        </div>
                    )}
                    <button 
                        type="button" 
                        className="view-spreadsheet-btn"
                        onClick={handleViewSpreadsheet}
                    >
                        👁️ Ver Spreadsheet
                    </button>
                </div>
            )}
            
            {formErrors.general && (
                <div className="error-message general-error">
                    {formErrors.general}
                </div>
            )}
            
            <div className="form-group">
                <label className="form-label">Nombre completo *</label>
                <input
                    type="text"
                    className={`form-input ${formErrors.name ? 'error' : ''}`}
                    value={playerData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    maxLength={50}
                    disabled={isLoading}
                />
                {formErrors.name && (
                    <div className="error-message">{formErrors.name}</div>
                )}
            </div>
            
            <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                    type="email"
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                    value={playerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="ejemplo@correo.com"
                    maxLength={100}
                    disabled={isLoading}
                />
                {formErrors.email && (
                    <div className="error-message">{formErrors.email}</div>
                )}
            </div>
            
            <div className="form-buttons">
                <button 
                    className="save-button" 
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Guardando...
                        </>
                    ) : (
                        <>
                            📊 {recordsCount > 0 ? `Agregar a Sheets (${recordsCount + 1})` : 'Guardar en Sheets'}
                        </>
                    )}
                </button>
                <button 
                    className="skip-button" 
                    onClick={onSkipSave}
                    disabled={isLoading}
                >
                    Omitir
                </button>
            </div>
        </div>
    );
}

export default PlayerForm;