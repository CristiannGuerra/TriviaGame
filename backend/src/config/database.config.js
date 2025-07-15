import mongoose from 'mongoose';
import { ENVIRONMENT } from './env.config.js';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENVIRONMENT.MONGODB_URI, {
            // Opciones de conexión recomendadas
            serverSelectionTimeoutMS: 5000, // Timeout después de 5s en lugar de 30s
            socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
            maxPoolSize: 10, // Mantener hasta 10 conexiones de socket
            bufferCommands: false, // Deshabilitar mongoose buffering
        });

        console.log(`MongoDB conectado: ${conn.connection.host}`);
        
        // Manejar eventos de conexión
        mongoose.connection.on('connected', () => {
            console.log('Mongoose conectado a MongoDB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('Error de conexión MongoDB:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose desconectado');
        });
        
        // Cerrar conexión cuando la aplicación se cierre
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('Conexión MongoDB cerrada debido a la terminación de la aplicación');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

// Función para verificar el estado de la conexión
export const checkConnection = () => {
    const state = mongoose.connection.readyState;
    const states = {
        0: 'desconectado',
        1: 'conectado',
        2: 'conectando',
        3: 'desconectando'
    };
    
    return {
        state: states[state],
        isConnected: state === 1
    };
};