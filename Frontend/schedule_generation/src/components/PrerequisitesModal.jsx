import React, { useState, useEffect } from 'react';

export default function PrerequisitesModal({ isOpen, onClose, course, allCourses, onSavePrerequisites }) {
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);

  // Cada vez que se abre el modal para un curso, marcamos los que ya tiene asignados
  useEffect(() => {
    if (course) {
      // Suponiendo que course.prerequisites trae un array de objetos con los IDs previos
      const currentIds = course.prerequisites ? course.prerequisites.map(p => p.id) : [];
      setSelectedPrereqs(currentIds);
    }
  }, [course]);

  if (!isOpen || !course) return null;

  // Filtrar para que la materia no pueda ser prerrequisito de sí misma
  const availableCourses = allCourses.filter(c => c.id !== course.id);

  const handleCheckboxChange = (courseId) => {
    if (selectedPrereqs.includes(courseId)) {
      // Si ya estaba, lo quitamos
      setSelectedPrereqs(selectedPrereqs.filter(id => id !== courseId));
    } else {
      // Si no estaba, lo agregamos
      setSelectedPrereqs([...selectedPrereqs, courseId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSavePrerequisites(course.id, selectedPrereqs);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card" style={{ maxWidth: '500px' }}>
        <h3>Asignar Prerrequisitos</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
          Selecciona las materias que se deben aprobar obligatoriamente antes de cursar: <strong>{course.name}</strong>
        </p>

        {availableCourses.length === 0 ? (
          <p>No hay otras materias registradas para usar como prerrequisito.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '250px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
              {availableCourses.map((mat) => {
                const isChecked = selectedPrereqs.includes(mat.id);
                return (
                  <label key={mat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                    <input 
                      type="checkbox" 
                      checked={isChecked} 
                      onChange={() => handleCheckboxChange(mat.id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div>
                      <span style={{ fontWeight: '500', display: 'block' }}>{mat.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Créditos: {mat.credits} | Días: {mat.day}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', background: '#cbd5e1', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" className="btn-primary">Guardar Prerrequisitos</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}