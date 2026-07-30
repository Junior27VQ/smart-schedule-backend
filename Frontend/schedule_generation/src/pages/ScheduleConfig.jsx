import React, { useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import '../stylish/ScheduleConfig.css';

export default function ScheduleConfig() {
  const navigate = useNavigate();

  const [configData, setConfigData] = useState({
    numberOfCourses: 3,
    maximumCredits: 12,
    maximumDifficultCourses: 2,
    requiredCourses: 'Programación', // Lo manejamos temporalmente como texto separado por comas
    requiredModality: 'Cualquiera',
    validatePrerequisites: true,
    avoidTimeConflicts: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfigData({
      ...configData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- VALIDACIONES PREVIAS EN EL FRONTEND ---
    if (Number(configData.numberOfCourses) <= 0) {
      setError('El número de cursos debe ser mayor a 0.');
      setLoading(false);
      return;
    }
    if (Number(configData.maximumCredits) <= 0) {
      setError('Los créditos máximos deben ser mayores a 0.');
      setLoading(false);
      return;
    }

    // Convertimos las materias requeridas de texto ("Prog, Base de datos") a un Array de strings para el JSON
    const formattedPayload = {
      ...configData,
      numberOfCourses: Number(configData.numberOfCourses),
      maximumCredits: Number(configData.maximumCredits),
      maximumDifficultCourses: Number(configData.maximumDifficultCourses),
      requiredCourses: configData.requiredCourses 
        ? configData.requiredCourses.split(',').map(item => item.trim()).filter(Boolean)
        : []
    };

    try {
      // Petición POST al backend (exactamente igual que en Postman)
      const response = await fetch(`${API_BASE_URL}/api/course/schedule/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedPayload)
      });

      if (!response.ok) throw new Error('El servidor rechazó la generación del horario. Revisa los parámetros.');

      const result = await response.json();
      
      // Enviamos el resultado al siguiente componente
      navigate('/schedule-result', { state: { scheduleResult: result } });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card schedule-config-card">
      <h2>Configuración del Generador de Horarios</h2>
      <p className="schedule-config-subtitle">
        Establece los criterios de restricciones para que el sistema calcule tu horario óptimo.
      </p>

      {error && <p className="schedule-config-error">{error}</p>}

      <form onSubmit={handleGenerate} className="schedule-config-form">
        
        <div className="schedule-config-row">
          <div className="schedule-config-field">
            <label className="schedule-config-label">Número de Cursos:</label>
            <input 
              type="number" 
              name="numberOfCourses" 
              value={configData.numberOfCourses} 
              onChange={handleChange} 
              min="1" 
              max="10"
              className="schedule-config-input" 
              required
            />
          </div>
          <div className="schedule-config-field">
            <label className="schedule-config-label">Créditos Máximos:</label>
            <input 
              type="number" 
              name="maximumCredits" 
              value={configData.maximumCredits} 
              onChange={handleChange} 
              min="1" 
              max="30"
              className="schedule-config-input" 
              required
            />
          </div>
        </div>

        <div className="schedule-config-row">
          <div className="schedule-config-field">
            <label className="schedule-config-label">Máx. Cursos Difíciles:</label>
            <input 
              type="number" 
              name="maximumDifficultCourses" 
              value={configData.maximumDifficultCourses} 
              onChange={handleChange} 
              min="0" 
              max="5"
              className="schedule-config-input" 
              required
            />
          </div>
          <div className="schedule-config-field">
            <label className="schedule-config-label">Modalidad Requerida:</label>
            <select 
              name="requiredModality" 
              value={configData.requiredModality} 
              onChange={handleChange}
              className="schedule-config-select"
            >
              <option value="Cualquiera">Cualquiera</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
            </select>
          </div>
        </div>

        <div className="schedule-config-field">
          <label className="schedule-config-label">Materias Obligatorias (separadas por coma):</label>
          <input 
            type="text" 
            name="requiredCourses" 
            value={configData.requiredCourses} 
            onChange={handleChange} 
            placeholder="Ej: Programación, Bases de datos" 
            className="schedule-config-input" 
          />
        </div>

        <div className="schedule-config-checkboxes">
          <label className="schedule-config-checkbox-label">
            <input 
              type="checkbox" 
              name="validatePrerequisites" 
              checked={configData.validatePrerequisites} 
              onChange={handleChange}
              className="schedule-config-checkbox"
            />
            Validar Prerrequisitos
          </label>

          <label className="schedule-config-checkbox-label">
            <input 
              type="checkbox" 
              name="avoidTimeConflicts" 
              checked={configData.avoidTimeConflicts} 
              onChange={handleChange}
              className="schedule-config-checkbox"
            />
            Evitar Cruces de Horario
          </label>
        </div>

        <button 
          type="submit" 
          className="btn-primary schedule-config-submit"
          disabled={loading}
        >
          {loading ? 'Calculando horario óptimo...' : 'Generar Horario'}
        </button>
      </form>
    </div>
  );
}