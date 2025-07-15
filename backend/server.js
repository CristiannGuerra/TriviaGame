import express from "express"
import cors from "cors"
import { ENVIRONMENT } from "./src/config/env.config.js"

// Create server
const app = express()

// Middlewares
app.use(cors())


// Use JSON
app.use(express.json(
    {
        limit: "50mb"
    }
))

// Start server
app.listen(ENVIRONMENT.PORT, () => {
    console.log(`Server running on port http://localhost:${ENVIRONMENT.PORT}`)
})