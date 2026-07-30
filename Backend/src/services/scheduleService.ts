import prisma from '../config/prisma.js';
import { 
  calculateCombinations, 
  generateCombinationsArray, 
  validateRequiredCourses, 
  validateModality, 
  validateMaxCredits, 
  validateDifficultCourses, 
  validatePrerequisites, 
  validateTimeConflicts 
} from '../helpers/scheduleHelper.js';

interface ScheduleOptions {
  courseIds?: number[];
  numberOfCourses?: number;
  maximumCredits?: number;
  maximumDifficultCourses?: number;
  requiredCourses?: string[];
  requiredModality?: string;
  validatePrerequisites?: boolean;
  avoidTimeConflicts?: boolean;
}

export const validateAndGenerateSchedule = async (options: ScheduleOptions) => {
  const { 
    numberOfCourses = 3,
    maximumCredits, 
    maximumDifficultCourses, 
    requiredCourses = [], 
    requiredModality,
    validatePrerequisites: validatePrereqs = true,
    avoidTimeConflicts = true
  } = options;

  // Obtener materias de la base de datos
  const whereClause = options.courseIds && options.courseIds.length > 0
    ? { id: { in: options.courseIds } }
    : {};

  const allCourses = await prisma.courses.findMany({
    where: whereClause,
    include: {
      prerequisites_prerequisites_course_idTocourses: {
        include: {
          courses_prerequisites_prerequisite_course_idTocourses: true
        }
      }
    }
  });

  if (numberOfCourses > allCourses.length) {
    throw new Error('No existen suficientes materias disponibles para cumplir la configuración solicitada.');
  }

  // Estadísticas y combinaciones matemáticas
  const totalAvailableCourses = allCourses.length;
  const totalCombinations = calculateCombinations(totalAvailableCourses, numberOfCourses);
  const allCourseIds = allCourses.map(c => c.id);
  const possibleIdCombinations = generateCombinationsArray(allCourseIds, numberOfCourses);

  const validSchedules: any[] = [];
  const rejectedSchedules: any[] = []; // Arreglo para almacenar los horarios descartados y su razón

  // Evaluar cada combinación aplicando las funciones del Helper
  for (const comboIds of possibleIdCombinations) {
    const courses = allCourses.filter(c => comboIds.includes(c.id));
    let rejectionReason = null;

    // Ejecución de validaciones modulares
    // Evaluamos regla por regla y guardamos el motivo exacto si falla
    if (!validateRequiredCourses(courses, requiredCourses)) {
      rejectionReason = "No incluye las materias obligatorias requeridas";
    } else if (!validateModality(courses, requiredModality)) {
      rejectionReason = "No cumple con la modalidad requerida";
    } else if (!validateMaxCredits(courses, maximumCredits)) {
      rejectionReason = "Excede el límite de créditos máximos permitidos";
    } else if (!validateDifficultCourses(courses, maximumDifficultCourses)) {
      rejectionReason = "Excede el número permitido de materias difíciles";
    } else if (validatePrereqs && !validatePrerequisites(courses, comboIds)) {
      rejectionReason = "Faltan prerrequisitos necesarios para alguna materia";
    } else if (avoidTimeConflicts && !validateTimeConflicts(courses)) {
      rejectionReason = "Presenta cruces o solapamientos en los horarios";
    };
    // Si hubo una razón de rechazo, lo mandamos a la lista de descartados
    if (rejectionReason) {
      rejectedSchedules.push({
        materiasAnalizadas: courses.map(c => c.name),
        razonDescarte: rejectionReason
      });
      continue;
    };

    // Si pasa todas las validaciones, se registra como horario válido
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

    validSchedules.push({
      idHorario: validSchedules.length + 1,
      materiasComoConjunto: courses.map(c => c.name),
      totalCreditos: totalCredits,
      cursosDetallados: courses.map(c => ({ 
        id: c.id, 
        name: c.name, 
        day: c.day, 
        credits: c.credits, 
        modality: c.modality 
      }))
    });
  }

  return {
    message: 'Combinaciones de horarios generadas exitosamente.',
    estadisticas: {
      materiasDisponibles: totalAvailableCourses,
      materiasPorHorario: numberOfCourses,
      combinacionesPosibles: totalCombinations,
      totalHorariosValidos: validSchedules.length,
      totalHorariosDescartados: rejectedSchedules.length
    },
    // Colección 1: Horarios aptos para el estudiante
    horariosValidos: validSchedules,
    
    // Colección 2: Horarios descartados con su respectiva trazabilidad
    horariosDescartados: rejectedSchedules
  };
};