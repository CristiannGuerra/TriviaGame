import * as XLSX from 'xlsx';

const STORAGE_KEY = 'triviaResults';

export const saveToExcel = async (gameData) => {
    try {
        // Cargar datos existentes del localStorage
        let existingData = [];
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                existingData = JSON.parse(storedData);
            }
        } catch (error) {
            console.log('No hay datos previos o error al cargar:', error);
        }

        // Agregar nuevo resultado con timestamp único
        const newResult = {
            ...gameData,
            'ID': Date.now(), // Agregar ID único
            'Fecha y Hora': new Date().toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };

        existingData.push(newResult);

        // Guardar en localStorage para persistencia
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

        // Crear archivo Excel con todos los datos
        const worksheet = XLSX.utils.json_to_sheet(existingData);
        const workbook = XLSX.utils.book_new();

        // Configurar el ancho de las columnas
        const columnWidths = [
            { wch: 12 }, // ID
            { wch: 25 }, // Nombre
            { wch: 30 }, // Email
            { wch: 12 }, // Puntuación
            { wch: 18 }, // Respuestas Correctas
            { wch: 18 }, // Respuestas Incorrectas
            { wch: 20 }, // Porcentaje
            { wch: 18 }, // Total Preguntas
            { wch: 20 }  // Fecha y Hora
        ];
        worksheet['!cols'] = columnWidths;

        // Agregar formato a los encabezados
        const headerStyle = {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } }
        };

        // Aplicar estilo a la primera fila (encabezados)
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = headerStyle;
            }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados Trivia');

        // Generar nombre del archivo con fecha y cantidad de registros
        const today = new Date().toISOString().split('T')[0];
        const filename = `Resultados_Trivia_${today}_${existingData.length}_registros.xlsx`;

        // Descargar archivo
        XLSX.writeFile(workbook, filename);

        return { 
            success: true, 
            filename,
            totalRecords: existingData.length,
            newRecordId: newResult.ID
        };
    } catch (error) {
        console.error('Error al guardar en Excel:', error);
        throw new Error('No se pudo guardar el archivo Excel');
    }
};

export const getStoredResults = () => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error('Error al obtener datos guardados:', error);
        return [];
    }
};

export const getResultsCount = () => {
    try {
        const results = getStoredResults();
        return results.length;
    } catch (error) {
        console.error('Error al obtener cantidad de registros:', error);
        return 0;
    }
};

export const clearStoredResults = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error al limpiar datos:', error);
        return false;
    }
};

export const exportAllResults = () => {
    try {
        const existingData = getStoredResults();
        
        if (existingData.length === 0) {
            throw new Error('No hay resultados para exportar');
        }

        // Crear archivo Excel con todos los datos
        const worksheet = XLSX.utils.json_to_sheet(existingData);
        const workbook = XLSX.utils.book_new();

        // Configurar el ancho de las columnas
        const columnWidths = [
            { wch: 12 }, // ID
            { wch: 25 }, // Nombre
            { wch: 30 }, // Email
            { wch: 12 }, // Puntuación
            { wch: 18 }, // Respuestas Correctas
            { wch: 18 }, // Respuestas Incorrectas
            { wch: 20 }, // Porcentaje
            { wch: 18 }, // Total Preguntas
            { wch: 20 }  // Fecha y Hora
        ];
        worksheet['!cols'] = columnWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados Trivia');

        // Generar nombre del archivo
        const today = new Date().toISOString().split('T')[0];
        const filename = `Historial_Completo_Trivia_${today}_${existingData.length}_registros.xlsx`;

        // Descargar archivo
        XLSX.writeFile(workbook, filename);

        return { 
            success: true, 
            filename,
            totalRecords: existingData.length
        };
    } catch (error) {
        console.error('Error al exportar resultados:', error);
        throw error;
    }
};

// Función para obtener estadísticas de los resultados
export const getResultsStats = () => {
    try {
        const results = getStoredResults();
        
        if (results.length === 0) {
            return null;
        }

        const scores = results.map(r => r.Puntuación || 0);
        const percentages = results.map(r => parseInt(r['Porcentaje de Precisión']) || 0);

        return {
            totalGames: results.length,
            averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            bestScore: Math.max(...scores),
            worstScore: Math.min(...scores),
            averageAccuracy: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length),
            bestAccuracy: Math.max(...percentages),
            lastPlayedDate: results[results.length - 1]['Fecha y Hora']
        };
    } catch (error) {
        console.error('Error al calcular estadísticas:', error);
        return null;
    }
};