# 🧠 Trivia Master

**Juego de Preguntas y Respuestas Interactivo**

Una aplicación web educativa desarrollada como muestra pedagógica para la **Feria de Ciencias - Instancia Regional de Resistencia, Chaco**.

## 📋 Descripción

Trivia Master es un juego de preguntas y respuestas que permite a los usuarios poner a prueba sus conocimientos en diferentes categorías y niveles de dificultad. La aplicación está diseñada para ser educativa, interactiva y accesible.

## ✨ Características

- 🎯 **Múltiples niveles de dificultad**: Fácil, Medio y Difícil
- 📚 **Diversas categorías**: Geografía, Historia, Ciencia, Literatura, Arte, Cultura, Tecnología
- 📊 **Sistema de puntuación**: Tracking de respuestas correctas e incorrectas
- 💾 **Guardado de resultados**: Almacenamiento de puntuaciones y estadísticas
- 🏆 **Ranking global**: Leaderboard con mejores puntuaciones
- 📱 **Diseño responsivo**: Adaptable a dispositivos móviles y desktop
- 🎨 **Interfaz moderna**: Diseño atractivo con animaciones y efectos

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de JavaScript
- **Vite** - Build tool y servidor de desarrollo
- **CSS3** - Estilos personalizados con gradientes y animaciones
- **Lucide React** - Iconografía moderna

### Backend (Preparado para integración)
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Axios** - Cliente HTTP

## 📁 Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── TriviaGame.jsx    # Componente principal del juego
│   │   ├── Question.jsx      # Componente de preguntas
│   │   ├── Results.jsx       # Pantalla de resultados
│   │   ├── PlayerForm.jsx    # Formulario de jugador
│   │   ├── ScoreBoard.jsx    # Tablero de puntuación
│   │   └── Leaderboard.jsx   # Ranking global
│   ├── services/        # Servicios de API
│   ├── utils/          # Utilidades y constantes
│   │   ├── questions.js      # Base de datos de preguntas
│   │   ├── validation.js     # Validaciones
│   │   └── constants.js      # Constantes del juego
│   ├── config/         # Configuraciones
│   └── App.jsx         # Componente raíz
├── package.json
└── README.md
```

## 🎮 Características del Juego

### Niveles de Dificultad
- **🟢 Fácil**: Preguntas de conocimiento general básico
- **🟡 Medio**: Preguntas de dificultad intermedia
- **🔴 Difícil**: Preguntas desafiantes para expertos

### Sistema de Puntuación
- **100 puntos** por respuesta correcta
- **Tracking completo** de estadísticas
- **Cálculo automático** de precisión

### Categorías Disponibles
- Geografía
- Historia
- Ciencia y Física
- Literatura
- Arte y Cultura
- Matemáticas
- Química y Biología

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd trivia-master
```

2. **Instalar dependencias**
```bash
cd frontend
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env en la carpeta frontend
VITE_API_URL=http://localhost:3000
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
```

## 🎓 Contexto Educativo

Este proyecto fue desarrollado como **muestra pedagógica** para la **Feria de Ciencias - Instancia Regional de Resistencia, Chaco**, con el objetivo de:

- Demostrar el uso de tecnologías web modernas
- Crear una herramienta educativa interactiva
- Promover el aprendizaje a través del juego
- Mostrar buenas prácticas de desarrollo frontend
- Fomentar el interés en la programación y tecnología

## 📊 Funcionalidades Destacadas

### Experiencia de Usuario
- Navegación intuitiva entre pantallas
- Feedback visual inmediato
- Animaciones fluidas y transiciones
- Diseño adaptativo (responsive)

### Gestión de Datos
- Validación de formularios en tiempo real
- Almacenamiento local de configuraciones
- Preparado para integración con backend
- Manejo de errores y estados de carga

### Gamificación
- Sistema de puntuación motivador
- Diferentes niveles de dificultad
- Estadísticas detalladas de rendimiento
- Ranking global competitivo

## 🤝 Contribución

Este proyecto fue desarrollado con fines educativos. Las contribuciones son bienvenidas para mejorar la experiencia educativa.

## 📄 Licencia

Proyecto desarrollado con fines educativos para la Feria de Ciencias - Instancia Regional de Resistencia, Chaco.

---

**Desarrollado para la Feria de Ciencias 🔬**  
*Instancia Regional de Resistencia, Chaco*
