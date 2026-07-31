import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../stylish/ScheduleDetail.css';
import MathConceptsPanel from '../components/MathConceptsPanel';

export default function ScheduleDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedSchedule = location.state?.datHor;

  if (!selectedSchedule) {
    return (
      <div className="schedule-detail-container">
        <div className="schedule-detail-empty card">
          <h2>No hay datos de horario para mostrar</h2>
          <p>Debes seleccionar un horario generado previamente para consultar sus detalles.</p>
          <button className="btn-back" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
            ← Volver a Generador
          </button>
        </div>
      </div>
    );
  }

  // Función para extraer solo la hora (HH:mm) limpia de formatos largos ISO o strings de fecha
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      return timeString.substring(0, 5);
    } catch {
      return timeString;
    }
  };

  const razonGlobalDescarte = selectedSchedule.razonDescarte;
  const rawMaterias = selectedSchedule.materiasAnalizadas || selectedSchedule.materiasComoConjunto || [];
  const cursosDetallados = selectedSchedule.cursosDetallados || [];

  let coursesList = [];

  if (cursosDetallados.length > 0) {
    coursesList = cursosDetallados;
  } else if (rawMaterias.length > 0) {
    coursesList = rawMaterias.map((item, idx) => {
      if (typeof item === 'object' && item !== null) {
        return {
          id: item.id || idx,
          name: item.name || item.nombre,
          day: item.day || item.dia || 'N/A',
          start_time: item.start_time || item.horaInicio || '',
          end_time: item.end_time || item.horaFin || '',
          credits: item.credits || item.creditos || '-',
          modality: item.modality || item.modalidad || 'Presencial',
          difficulty: item.difficulty || item.dificultad || 'Media',
          discardReason: selectedSchedule.razonDescarte || 'N/A'
        };
      } else {
        return {
          id: idx,
          name: item,
          day: 'N/A',
          start_time: '',
          end_time: '',
          credits: '-',
          modality: 'N/A',
          difficulty: 'N/A',
          discardReason: selectedSchedule.razonDescarte || 'N/A'
        };
      }
    });
  }

  // Extracción dinámica de contadores válidos y descartados desde el objeto o props globales
  const totalMaterias = selectedSchedule.totalMaterias || 8;
  const materiasPorHorario = coursesList.length || 3;
  //const combinacionesTotales = selectedSchedule.totalCombinaciones || selectedSchedule.combinacionesPosibles || 56;

  const validasCount = selectedSchedule.totalValidos ?? 1;
  const descartadasCount = selectedSchedule.totalDescartados ?? 0;
  const combinacionesTotales = (validasCount + descartadasCount);

  // Lógica proposicional descriptiva para el panel matemático
  const estadoLogicoTexto = razonGlobalDescarte 
    ? "Rechazado por evaluación de restricciones (¬P ∨ ¬Q)" 
    : "Aprobado bajo conjunción válida (P ∧ Q)";

  return (
    <div className="schedule-detail-container">
        <MathConceptsPanel
            totalMaterias={totalMaterias}
            materiasPorHorario={materiasPorHorario}
            combinacionesTotales={combinacionesTotales}
            validasCount={validasCount}
            descartadasCount={descartadasCount}
            reglaLogica={estadoLogicoTexto}
        />
      <div className="schedule-detail-header">
        <div>
          <h2>Detalle del Horario #{selectedSchedule.idHorario || 'Óptimo'}</h2>
          <p>Resumen tabular de las asignaturas asignadas para el periodo actual.</p>
        </div>
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>
      </div>

      <div className="table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Materias Seleccionadas</th>
              <th>Días</th>
              <th>Horas</th>
              <th>Modalidades</th>
              <th>Créditos</th>
              <th>Dificultad</th>
              <th>Estado</th>
              <th>Razones de Descarte</th>
            </tr>
          </thead>
          <tbody>
            {coursesList.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  No se encontraron materias registradas para este horario.
                </td>
              </tr>
            ) : (
              coursesList.map((course, idx) => {
                const startTimeFormatted = formatTime(course.start_time || course.horaInicio);
                const endTimeFormatted = formatTime(course.end_time || course.horaFin);

                return (
                  <tr key={course.id || idx}>
                    <td><strong>{course.name}</strong></td>
                    <td>{course.day || course.dia || 'N/A'}</td>
                    <td>
                      {startTimeFormatted && endTimeFormatted 
                        ? `${startTimeFormatted} - ${endTimeFormatted}` 
                        : 'No especificada'}
                    </td>
                    <td>{course.modality || course.modalidad || 'Presencial'}</td>
                    <td>{course.credits || course.creditos || '-'}</td>
                    <td>{course.difficulty || course.dificultad || 'Media'}</td>
                    <td>
                      <span className={razonGlobalDescarte ? "badge-danger" : "badge-success"}>
                        {razonGlobalDescarte ? "Descartado" : "Asignado"}
                      </span>
                    </td>
                    <td>{razonGlobalDescarte || course.discardReason || 'N/A'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}