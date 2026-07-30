import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../stylish/ScheduleResult.css';

export default function ScheduleResult() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Capturamos la respuesta del backend que viene en location.state.scheduleResult
  const responseData = location.state?.scheduleResult;

  if (!responseData) {
    return (
      <div className="schedule-result-empty">
        <h2>No hay datos de horario disponibles</h2>
        <p>Debes configurar y generar un horario primero.</p>
        <button className="btn-primary" onClick={() => navigate('/config')}>Ir a Configuración</button>
      </div>
    );
  }

  const hendleViewDetail = (datHor) => {navigate('/schedule-detail', {state: {datHor} })}

  // Extraemos las propiedades exactas de tu estructura de backend
  const { message, estadisticas, horariosValidos = [], horariosDescartados = [] } = responseData;

  return (
    <div className="schedule-result-container">
      <div className="schedule-header">
        <div>
          <h2>Resultados de la Generación de Horarios</h2>
          <p>{message || 'Generación completada con éxito.'}</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/config')}>
          ← Nueva Configuración
        </button>
      </div>

      <div className="schedule-content-layout">
        
        {/* Estadísticas Generales */}
        {estadisticas && (
          <section className="card">
            <h3 className="section-title-general">
              📊 Estadísticas del Proceso
            </h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Materias Disponibles</span>
                <strong className="stat-value">{estadisticas.materiasDisponibles}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Materias por Horario</span>
                <strong className="stat-value">{estadisticas.materiasPorHorario}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Combinaciones Posibles</span>
                <strong className="stat-value">{estadisticas.combinacionesPosibles}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Horarios Válidos</span>
                <strong className="stat-value valid">{estadisticas.totalHorariosValidos}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Horarios Descartados</span>
                <strong className="stat-value discarded">{estadisticas.totalHorariosDescartados}</strong>
              </div>
            </div>
          </section>
        )}

        {/* Horarios Válidos */}
        <section className="card card-valid-section">
          <h3 className="section-title-valid">
            ✅ Horarios Válidos ({horariosValidos.length})
          </h3>
          <p className="section-description">Combinaciones que cumplen con todas las reglas académicas y de cruce.</p>
          
          {horariosValidos.length === 0 ? (
            <p className="empty-text">No se encontraron horarios válidos con los filtros actuales.</p>
          ) : (
            <div className="schedules-list">
              {horariosValidos.map((schedule, idx) => (
                <div key={idx} className="schedule-item-valid">
                  <strong>Opción de Horario Válido #{idx + 1}</strong>
                  <div>
                    <pre> <strong>Materias en conjunto:</strong>
                      {schedule.materiasComoConjunto ? schedule.materiasComoConjunto.join(', ') : 'N/A'}
                    </pre>
                    <button className='btn-valid-detail'
                        onClick={() => hendleViewDetail(schedule)} >
                        Ver Detalle del Horario
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Horarios Descartados con Trazabilidad */}
        <section className="card card-discarded-section">
          <h3 className="section-title-discarded">
            ❌ Horarios Descartados ({horariosDescartados.length})
          </h3>
          <p className="section-description">Trazabilidad de las combinaciones que fueron rechazadas por restricciones.</p>
          
          {horariosDescartados.length === 0 ? (
            <p className="empty-text">No hay horarios descartados registrados.</p>
          ) : (
            <div className="schedules-list">
              {horariosDescartados.map((discarded, idx) => (
                <div key={idx} className="schedule-item-discarded">
                  <strong>Descartado #{idx + 1}</strong>
                  <div>
                    <pre> <strong>Materias en conjunto:</strong>
                      {discarded.materiasAnalizadas ? discarded.materiasAnalizadas.join(', ') : 'N/A'}
                    </pre>
                    <button className='btn-des-detail'
                        onClick={() => hendleViewDetail(discarded)} >
                        Ver Detalle del Horario
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}