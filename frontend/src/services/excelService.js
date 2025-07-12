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

        // Agregar nuevo resultado
        existingData.push(gameData);

        // Guardar en localStorage para persistencia
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

        // Crear archivo Excel
        const worksheet = XLSX.utils.json_to_sheet(existingData);
        const workbook = XLSX.utils.book_new();

        // Configurar el ancho de las columnas
        const columnWidths = [
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

        // Generar nombre del archivo con fecha
        const today = new Date().toISOString().split('T')[0];
        const filename = `Resultados_Trivia_${today}.xlsx`;

        // Descargar archivo
        XLSX.writeFile(workbook, filename);

        return { success: true, filename };
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

export const clearStoredResults = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error al limpiar datos:', error);
        return false;
    }
};
