require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet'); 
const path = require('path'); // Importation de 'path' qui donne accès au chemin de fichiers

const sauceRoutes = require('./routes/sauce'); // Importation du 'router' pour le parcours des sauces
const userRoutes = require('./routes/user'); // Importation du 'router' pour le parcours des utilisateurs
const cors = require('cors');

//Création de l'application express
const app = express();

// Protection contre certaines vulnérabilité connues
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//connection à la base de donnée
mongoose.connect(`mongodb+srv://${process.env.DB}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Analyse le corps de la requête qui ont un contenu json et met a disposition leur body sur l'objet req
app.use(express.json());

app.use(cors());

//Empêcher les erreurs CORS
app.use((req, res, next) => {
    //Accès à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Ajout des headers aux reqêtes vers l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Les méthodes autorisées de requête
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Les différentes routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;