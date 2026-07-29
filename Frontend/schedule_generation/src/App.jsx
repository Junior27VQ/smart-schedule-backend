import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CoursesManager from './pages/CoursesManager'

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="app-container">
        {/* Barra de Navegación Global provisional */}
        <nav style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 'bold' }}>1. Generador</Link>
          {/* Aquí añadiremos los enlaces a las siguientes pantallas */}
        </nav>

        {/* Enrutador de Páginas */}
        <Routes>
          <Route path="/" element={<CoursesManager/>} />
          {/* Definiremos las demás rutas próximamente */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
