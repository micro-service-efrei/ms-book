require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

// Vérification de la présence du JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET manquant dans les variables d\'environnement');
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Log des requêtes pour le débogage
app.use((req, res, next) => {
  console.log("Book Service - Incoming Request:", {
    method: req.method,
    url: req.url,
    path: req.path,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });
  next();
});

// Routes - Plus flexible avec les préfixes
app.use(['/books', '/ms-book/books'], bookRoutes);

// Healthcheck endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "book",
    timestamp: new Date().toISOString(),
  });
});

// Route pour attraper toutes les requêtes non gérées
app.use((req, res) => {
  console.log("Route non trouvée:", {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  });
  res.status(404).json({
    error: "Route non trouvée",
    path: req.url,
    method: req.method,
  });
});

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://mongo:27017/ms-book", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connecté à MongoDB");
    const PORT = process.env.PORT || 3001; // Changé à 3001 pour correspondre au docker-compose
    app.listen(PORT, () => {
      console.log(`Service Book démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur lors du démarrage:", err);
    process.exit(1);
  });
