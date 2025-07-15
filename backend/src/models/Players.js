import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        trim: true,
        lowercase: true,
        maxlength: [100, 'El email no puede exceder 100 caracteres'],
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Por favor ingresa un email válido'
        ]
    },
    // Estadísticas del jugador
    totalGames: {
        type: Number,
        default: 0
    },
    totalScore: {
        type: Number,
        default: 0
    },
    bestScore: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    },
    totalCorrectAnswers: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    bestAccuracy: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Fechas importantes
    firstGameDate: {
        type: Date,
        default: Date.now
    },
    lastGameDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para optimizar consultas
playerSchema.index({ email: 1 }, { unique: true });
playerSchema.index({ name: 1 });
playerSchema.index({ bestScore: -1 });
playerSchema.index({ lastGameDate: -1 });

// Virtual para calcular accuracy promedio
playerSchema.virtual('averageAccuracy').get(function() {
    if (this.totalQuestions === 0) return 0;
    return Math.round((this.totalCorrectAnswers / this.totalQuestions) * 100);
});

// Método para actualizar estadísticas después de un juego
playerSchema.methods.updateStats = function(gameResult) {
    this.totalGames += 1;
    this.totalScore += gameResult.score;
    this.totalCorrectAnswers += gameResult.correctAnswers;
    this.totalQuestions += gameResult.totalQuestions;
    this.lastGameDate = new Date();
    
    // Actualizar mejor puntuación
    if (gameResult.score > this.bestScore) {
        this.bestScore = gameResult.score;
    }
    
    // Actualizar mejor accuracy
    if (gameResult.accuracy > this.bestAccuracy) {
        this.bestAccuracy = gameResult.accuracy;
    }
    
    // Calcular promedio de puntuación
    this.averageScore = Math.round(this.totalScore / this.totalGames);
};

// Método estático para encontrar o crear jugador
playerSchema.statics.findOrCreate = async function(playerData) {
    let player = await this.findOne({ email: playerData.email });
    
    if (!player) {
        player = new this(playerData);
        await player.save();
    } else {
        // Actualizar nombre si cambió
        if (player.name !== playerData.name) {
            player.name = playerData.name;
            await player.save();
        }
    }
    
    return player;
};

module.exports = mongoose.model('Player', playerSchema);