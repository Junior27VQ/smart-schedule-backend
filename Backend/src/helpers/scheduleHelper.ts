// Función matemática para calcular factoriales y combinaciones (nCr)
export const calculateCombinations = (n: number, r: number): number => {
  if (r > n || r < 0) return 0;
  if (r === 0 || r === n) return 1;
  
  let factorialN = 1;
  let factorialR = 1;
  let factorialNR = 1;

  for (let i = 1; i <= n; i++) factorialN *= i;
  for (let i = 1; i <= r; i++) factorialR *= i;
  for (let i = 1; i <= (n - r); i++) factorialNR *= i;

  return factorialN / (factorialR * factorialNR);
};

// Función para generar combinaciones posibles de arreglos (subconjuntos)
export const generateCombinationsArray = (arr: number[], k: number): number[][] => {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const head = arr[0];
  const tail = arr.slice(1);
  
  const withHead = generateCombinationsArray(tail, k - 1).map(c => [head, ...c]);
  const withoutHead = generateCombinationsArray(tail, k);
  
  return [...withHead, ...withoutHead] as number[][];
};

// Normalizador de textos para evitar problemas con tildes en materias obligatorias
export const normalizeText = (str: string): string => 
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// Convierte un arreglo de materias en un Set nativo con solo sus nombres
export const getCourseNameSet = (scheduleCourses: any[]): Set<string> => {
  return new Set(scheduleCourses.map(course => course.name));
};

// VALIDACIÓN: Materias Obligatorias
export const validateRequiredCourses = (courses: any[], requiredCourses: string[] = []): boolean => {
  for (const reqName of requiredCourses) {
    const isIncluded = courses.some(c => normalizeText(c.name) === normalizeText(reqName));
    if (!isIncluded) return false;
  }
  return true;
}

// VALIDACIÓN: Modalidad requerida
export const validateModality = (courses: any[], requiredModality?: string): boolean => {
  if (!requiredModality || requiredModality.toLowerCase() === 'cualquiera') return true;
  return !courses.some(c => c.modality.toLowerCase() !== requiredModality.toLowerCase());
};

// VALIDACIÓN: Créditos máximos
export const validateMaxCredits = (courses: any[], maximumCredits?: number): boolean => {
  if (maximumCredits === undefined) return true;
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  return totalCredits <= maximumCredits;
};

// VALIDACIÓN: Materias difíciles
export const validateDifficultCourses = (courses: any[], maximumDifficultCourses?: number): boolean => {
  if (maximumDifficultCourses === undefined) return true;
  const difficultCount = courses.filter(c => c.difficulty === 'Difícil' || c.difficulty === 'Alta').length;
  return difficultCount <= maximumDifficultCourses;
};

// VALIDACIÓN: Prerrequisitos
export const validatePrerequisites = (courses: any[], comboIds: number[]): boolean => {
  for (const course of courses) {
    for (const p of course.prerequisites_prerequisites_course_idTocourses || []) {
      if (!comboIds.includes(p.prerequisite_course_id)) {
        return false;
      }
    }
  }
  return true;
};

// VALIDACIÓN: Cruces de horarios
export const validateTimeConflicts = (courses: any[]): boolean => {
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const c1 = courses[i];
      const c2 = courses[j];

      if (!c1 || !c2 || !c1.start_time || !c1.end_time || !c2.start_time || !c2.end_time) {
        continue;
      }

      if (c1.day === c2.day) {
        const start1 = new Date(c1.start_time).getTime();
        const end1 = new Date(c1.end_time).getTime();
        const start2 = new Date(c2.start_time).getTime();
        const end2 = new Date(c2.end_time).getTime();

        if (start1 < end2 && start2 < end1) {
          return false; // Hay cruce de horario
        }
      }
    }
  }
  return true;
};