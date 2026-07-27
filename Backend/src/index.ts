import express from 'express';
import cors from 'cors';
import courseRoutes from './routes/courseRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Usar rutas de materias
app.use('/courses', courseRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API del Generador de Horarios Activa 🚀' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});