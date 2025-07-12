import React, { useState, useEffect } from 'react';
import { saveToExcel, getResultsCount, getResultsStats } from '../services/excelService';
import { validatePlayerData } from '../utils/validation';

function PlayerForm({ gameData, onSaveSuccess, onSkipSave }) {
  const [playerData, setPlayerData] = useState({ name: '', email: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recordsCount, setRecordsCount] = useState(0);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Cargar información de registros existentes
    const count = getResultsCount();
    const statistics = getResultsStats();
    setRecordsCount(count);
    setStats(statistics);
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
    const validation = validatePlayerData(playerData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    
    try {
      const completeData = {
        'Nombre': playerData.name,
        'Email': playerData.email,
        'Puntuación': gameData.score,
        'Respuestas Correctas': gameData.correctAnswers,
        'Respuestas Incorrectas': gameData.incorrectAnswers,
        'Porcentaje de Precisión': `${gameData.percentage}%`,
        'Total de Preguntas': gameData.totalQuestions
      };

      const result = await saveToExcel(completeData);
      
      // Mostrar mensaje de éxito con información del archivo
      console.log(`Archivo guardado: ${result.filename}`);
      console.log(`Total de registros: ${result.totalRecords}`);
      
      onSaveSuccess(result);
    } catch (error) {
      console.error('Error al guardar:', error);
      setFormErrors({ general: 'Error al guardar los datos. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="player-form">
      <h3>💾 Guardar Resultados</h3>
      <p>Ingresa tus datos para guardar tu puntuación en un archivo Excel</p>
      
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
              💾 {recordsCount > 0 ? `Agregar al Excel (${recordsCount + 1})` : 'Guardar en Excel'}
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