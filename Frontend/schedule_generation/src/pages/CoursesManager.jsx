import React, { useState, useEffect } from 'react';
import CourseModal from '../components/CourseModal';
import '../stylish/CoursesManager.css';
import { API_BASE_URL } from '../config/apiConfig';
import PrerequisitesModal from '../components/PrerequisitesModal';

export default function CoursesManager() {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPrereqModalOpen, setIsPrereqModalOpen] = useState(false);
  const [courseForPrereq, setCourseForPrereq] = useState(null);

  // Cargar materias desde el backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/courses`);
      if (!response.ok) throw new Error('No se pudo obtener la lista de materias.');
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setCourseToEdit(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (course) => {
    setCourseToEdit(course);
    setIsModalOpen(true);
  };

  // Guardar (Crear o Modificar)
  const handleSaveCourse = async (formData, isEditing) => {
    try {
      const url = isEditing 
        ? `${API_BASE_URL}/api/courses/${courseToEdit.id}` 
        : `${API_BASE_URL}/api/courses`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al guardar la materia.');

      setIsModalOpen(false);
      fetchCourses(); // Recargamos la lista
    } catch (err) {
      alert(err.message);
    }
  };

  // Eliminar materia
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta materia?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar la materia.');
      fetchCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  // Asignar Prerrequisitos (función lógica de apoyo o redirección)
  const handleAssignPrerequisites = (course) => {
    setCourseForPrereq(course);
    setIsPrereqModalOpen(true);
  };
  const handleSavePrerequisites = async (courseId, prerequisiteIds) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/prerequisites`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prerequisiteIds })
        });

        if (!response.ok) throw new Error('Error al guardar los prerrequisitos.');

        alert('Prerrequisitos actualizados correctamente');
        setIsPrereqModalOpen(false);
        fetchCourses(); // Recargamos la lista
    } catch (err) {
        alert(err.message);
    }
    };

  return (
    <div className="courses-manager-container">
      <div className="courses-header">
        <div>
          <h2>Gestión de Materias Disponibles</h2>
          <p>Administra el catálogo de cursos para la generación de horarios</p>
        </div>
        <button className="btn-primary" onClick={handleOpenCreate}>
          + Registrar Materia
        </button>
      </div>

      {error && <p className="courses-error">{error}</p>}
      {loading && <p className="courses-loading">Cargando materias...</p>}

      {!loading && courses.length === 0 && (
        <p className="courses-empty">No hay materias registradas actualmente.</p>
      )}

      <div className="courses-list">
        {courses.map((course) => {
          const displayTime = (isoString) => {
            if (!isoString) return '';
            try {
              const date = new Date(isoString);
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            } catch {
              return '';
            }
          };
          const prereqsList = course.prerequisites_prerequisites_course_idTocourses || [];
          const prereqNames = prereqsList
            .map(p => p.courses_prerequisites_prerequisite_course_idTocourses?.name)
            .filter(Boolean)
            .join(', ');
        
          return (
            <div key={course.id} className="card course-row-card">
              <div className="course-info">
                <h3 className="course-title">{course.name}</h3>
                <p className="course-details">
                  Créditos: {course.credits} | Dificultad: {course.difficulty || 'Media'} | Día: {course.day} ({displayTime(course.start_time)} - {displayTime(course.end_time)}) | Modalidad: {course.modality}
                </p>
                {/* Mostramos los prerrequisitos asignados */}
                <p className="course-prerequisites">
                  Prerrequisitos: {prereqNames ? prereqNames : 'Ninguno'}
                </p>
              </div>
              
              <div className="course-actions">
                <button 
                  onClick={() => handleOpenEdit(course)} 
                  className="btn-action-edit"
                >
                  Modificar
                </button>
                <button 
                  onClick={() => handleAssignPrerequisites(course)} 
                  className="btn-action-prereq"
                >
                  Prerrequisitos
                </button>
                <button 
                  onClick={() => handleDelete(course.id)} 
                  className="btn-action-delete"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Inteligente para Crear / Modificar */}
      <CourseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCourse}
        courseToEdit={courseToEdit}
      />
      {/* Modal Inteligente para asignar prerequisitos */}
      <PrerequisitesModal
        isOpen={isPrereqModalOpen}
        onClose={() => setIsPrereqModalOpen(false)}
        course={courseForPrereq}
        allCourses={courses}
        onSavePrerequisites={handleSavePrerequisites}
      />
    </div>
  );
}