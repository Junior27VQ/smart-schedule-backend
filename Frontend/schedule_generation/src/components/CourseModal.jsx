import React, { useState, useEffect } from 'react';
import '../stylish/CourseModal.css';

export default function CourseModal({ isOpen, onClose, onSave, courseToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    credits: 3, // Valor por defecto 
    day: 'Lunes',
    start_time: '08:00',
    end_time: '10:00',
    modality: 'Presencial',
    difficulty: 'Media'
  });

  useEffect(() => {
    if (courseToEdit) {
      // Extraemos solo la parte de la hora "HH:mm" si viene en formato ISO con fecha
      const formatTimeForInput = (isoString) => {
        if (!isoString) return '08:00';
        try {
          const date = new Date(isoString);
          const hours = String(date.getUTCHours()).padStart(2, '0');
          const minutes = String(date.getUTCMinutes()).padStart(2, '0');
          return `${hours}:${minutes}`;
        } catch {
          return '08:00';
        }
      };

      setFormData({
        ...courseToEdit,
        start_time: formatTimeForInput(courseToEdit.start_time),
        end_time: formatTimeForInput(courseToEdit.end_time),
        difficulty: courseToEdit.difficulty || 'Media'
      });
    } else {
      setFormData({
        name: '',
        credits: 3,
        day: 'Lunes',
        start_time: '08:00',
        end_time: '10:00',
        modality: 'Presencial',
        difficulty: 'Media'
      });
    }
  }, [courseToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación en frontend para el rango de créditos (Mínimo 1, Máximo 6)
    const creditsNum = Number(formData.credits);
    if (creditsNum < 1 || creditsNum > 6) {
      alert('Los créditos deben estar en un rango válido entre 1 y 6.');
      return;
    }
    // Convertimos las horas simples ("08:00") a un formato ISO válido que Prisma acepta
    // Usamos una fecha base de referencia (ej. hoy o una fecha fija) combinada con la hora
    const baseDate = new Date().toISOString().split('T')[0]; // Ej: "2026-07-29"
    const formattedStartTime = `${baseDate}T${formData.start_time}:00.000Z`;
    const formattedEndTime = `${baseDate}T${formData.end_time}:00.000Z`;

    const dataToSend = {
      ...formData,
      credits: creditsNum,
      start_time: formattedStartTime,
      end_time: formattedEndTime
    };

    onSave(dataToSend, Boolean(courseToEdit));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-card card">
        <h3 className="modal-title">{courseToEdit ? 'Modificar Materia' : 'Registrar Nueva Materia'}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          
          <div className="modal-field">
            <label className="modal-label">Nombre de la Materia:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="modal-input" 
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Créditos (1 - 6):</label>
              <input 
                type="number" 
                name="credits" 
                min="1" 
                max="6" 
                value={formData.credits} 
                onChange={handleChange} 
                required 
                className="modal-input" 
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">Dificultad:</label>
              <select 
                name="difficulty" 
                value={formData.difficulty} 
                onChange={handleChange} 
                className="modal-select"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Hora Inicio:</label>
              <input 
                type="time" 
                name="start_time" 
                value={formData.start_time} 
                onChange={handleChange} 
                required 
                className="modal-input" 
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">Hora Fin:</label>
              <input 
                type="time" 
                name="end_time" 
                value={formData.end_time} 
                onChange={handleChange} 
                required 
                className="modal-input" 
              />
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Día:</label>
              <select 
                name="day" 
                value={formData.day} 
                onChange={handleChange} 
                className="modal-select"
              >
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Modalidad:</label>
              <select 
                name="modality" 
                value={formData.modality} 
                onChange={handleChange} 
                className="modal-select"
              >
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-modal-cancel">Cancelar</button>
            <button type="submit" className="btn-primary">{courseToEdit ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}