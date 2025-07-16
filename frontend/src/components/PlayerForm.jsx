// frontend/src/components/PlayerForm.jsx
import React, { useState } from 'react';
import { validatePlayerData } from '../utils/validation';
import { gameService } from '../services/api.services.js';

function PlayerForm({ gameData, onSaveSuccess, onSkipSave }) {
    const [playerData, setPlayerData] = useState({ name: '', email: '' });
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
        const validation = validatePlayerData(playerData);
        
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return;
        }

        setIsLoading(true);
        
        try {
            const result = await gameService.saveGameResult(playerData, gameData);
            
            onSaveSuccess({
                success: true,
                message: result.message || 'Datos guardados correctamente',
                data: result.data
            });
        } catch (error) {
            console.error('Error al guardar:', error);
            setFormErrors({ 
                general: error.message || 'Error al guardar los datos. Intenta nuevamente.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="player-form">
            <h3>💾 Guardar Resultados</h3>
            <p>Ingresa tus datos para guardar tu puntuación</p>
            
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
                            💾 Guardar Resultados
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