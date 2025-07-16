import mongoose from 'mongoose';

const gameResultSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: [true, 'El jugador es requerido']
    },
    // Datos del juego
    score: {
        type: Number,
        required: [true, 'La puntuación es requerida'],
        min: [0, 'La puntuación no puede ser negativa']
    },
    correctAnswers: {
        type: Number,
        required: [true, 'El número de respuestas correctas es requerido'],
        min: [0, 'Las respuestas correctas no pueden ser negativas']
    },
    incorrectAnswers: {
        type: Number,
        required: [true, 'El número de respuestas incorrectas es requerido'],
        min: [0, 'Las respuestas incorrectas no pueden ser negativas']
    },
    totalQuestions: {
        type: Number,
        required: [true, 'El total de preguntas es requerido'],
        min: [1, 'Debe haber al menos una pregunta']
    },
    accuracy: {
        type: Number,
        required: [true, 'La precisión es requerida'],
        min: [0, 'La precisión no puede ser negativa'],
        max: [100, 'La precisión no puede ser mayor a 100%']
    },
    // Tiempo del juego
    gameStartTime: {
        type: Date,
        default: Date.now
    },
    gameEndTime: {
        type: Date,
        required: [true, 'La hora de finalización es requerida'],
        default: Date.now
    },
    gameDuration: {
        type: Number, // en segundos
        required: true,
        default: 0
    },
    // Información adicional
    gameMode: {
        type: String,
        enum: ['normal', 'timed', 'challenge'],
        default: 'normal'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    }
    // ,
    // // Metadatos
    // userAgent: {
    //     type: String,
    //     default: ''
    // },
    // ipAddress: {
    //     type: String,
    //     default: ''
    // }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para optimizar consultas
gameResultSchema.index({ player: 1 });
gameResultSchema.index({ score: -1 });
gameResultSchema.index({ accuracy: -1 });
gameResultSchema.index({ gameEndTime: -1 });
gameResultSchema.index({ createdAt: -1 });

// Índice compuesto para ranking
gameResultSchema.index({ score: -1, accuracy: -1, gameEndTime: -1 });

// Virtual para calcular duración formateada
gameResultSchema.virtual('formattedDuration').get(function() {
    const minutes = Math.floor(this.gameDuration / 60);
    const seconds = this.gameDuration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual para obtener información del rendimiento
gameResultSchema.virtual('performance').get(function() {
    if (this.accuracy >= 90) return 'Excelente';
    if (this.accuracy >= 70) return 'Muy Bien';
    if (this.accuracy >= 50) return 'Bien';
    if (this.accuracy >= 30) return 'Regular';
    return 'Necesita Mejorar';
});

// Middleware pre-save para calcular duración
gameResultSchema.pre('save', function(next) {
    if (this.gameStartTime && this.gameEndTime) {
        this.gameDuration = Math.floor((this.gameEndTime - this.gameStartTime) / 1000);
    }
    next();
});

// Método estático para obtener estadísticas globales
gameResultSchema.statics.getGlobalStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalGames: { $sum: 1 },
                averageScore: { $avg: '$score' },
                maxScore: { $max: '$score' },
                averageAccuracy: { $avg: '$accuracy' },
                totalQuestions: { $sum: '$totalQuestions' },
                totalCorrectAnswers: { $sum: '$correctAnswers' }
            }
        }
    ]);
    
    return stats[0] || {
        totalGames: 0,
        averageScore: 0,
        maxScore: 0,
        averageAccuracy: 0,
        totalQuestions: 0,
        totalCorrectAnswers: 0
    };
};

// Método estático para obtener top jugadores
gameResultSchema.statics.getTopPlayers = async function(limit = 10) {
    return await this.aggregate([
        {
            $lookup: {
                from: 'players',
                localField: 'player',
                foreignField: '_id',
                as: 'playerInfo'
            }
        },
        {
            $unwind: '$playerInfo'
        },
        {
            $group: {
                _id: '$player',
                name: { $first: '$playerInfo.name' },
                email: { $first: '$playerInfo.email' },
                bestScore: { $max: '$score' },
                bestAccuracy: { $max: '$accuracy' },
                totalGames: { $sum: 1 },
                averageScore: { $avg: '$score' },
                lastGame: { $max: '$gameEndTime' }
            }
        },
        {
            $sort: { bestScore: -1, bestAccuracy: -1 }
        },
        {
            $limit: limit
        }
    ]);
};

export default mongoose.model('GameResult', gameResultSchema);