// Inicia el servidor HTTP de la API en el puerto configurado.
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`SaaS-O-Matic API running on http://localhost:${PORT}`);
});
