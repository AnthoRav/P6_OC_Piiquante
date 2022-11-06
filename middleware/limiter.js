const expressRateLimit = require("express-rate-limit");

// Limitation des tentatives de connexion
const rateLimiter = expressRateLimit({
  windowMs: 10 * 60 * 1000, // délai en ms
  max: 3, // nombre de tentatives authorisées
  message:
    "Votre compte est bloqué pendant 10 minutes suite à 3 tentatives infructueuses !",
});


module.exports = rateLimiter;