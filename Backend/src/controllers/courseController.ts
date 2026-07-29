import {type Request, type Response } from 'express';
import prisma from '../config/prisma.js';

// 1. Obtener todas las materias con sus prerrequisitos
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        prerequisites_prerequisites_course_idTocourses: {
          include: {
            courses_prerequisites_prerequisite_course_idTocourses: {
                select: {
                    name: true
                }
            }
          }
        }
      }
    });
    return res.json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las materias' });
  }
};

//Create Recuperar Update Delete
// Crear una nueva materia POST
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, day, start_time, end_time, modality, difficulty, credits } = req.body;
    
    const newCourse = await prisma.courses.create({
      data: {
        name,
        day,
        start_time,
        end_time,
        modality,
        difficulty,
        credits
      }
    });

    return res.status(201).json(newCourse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear la materia' });
  }
};

// Leer Todas las materias GET:
export const readCourses = async (req: Request, res: Response) => {
    try {
        const materias = await prisma.courses.findMany({
            select: {
                id: true,
                name: true,
                day: true,
                start_time: true,
                end_time: true,
                modality: true,
                difficulty: true,
                credits: true      
            }
        });
        res.json(materias);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error al obtener las materias"})
    }
}

// Leer materias por id GET:
export const readCourse = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const course = await prisma.courses.findUnique({
            where: { id: Number(id)}
        });
        if (!course) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }
        res.json(course);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error al obtener la materia"})
    }
}

// Actualizar materias por id PUT/PATCH:
export const updateCourse = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const { name, day, start_time, end_time, modality, difficulty, credits } = req.body;
        const editCourse = await prisma.courses.update({
            where: { id: Number(id)},
            data: {
                name,
                day,
                start_time,
                end_time,
                modality,
                difficulty,
                credits
            }
    });

    return res.status(200).json(editCourse);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error al actualizar la materia"})
    }
}

// Eliminar materias por id DELETE:
export const deleteCourse = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const materia = await prisma.courses.delete({
            where: { id: Number(id)}
        });
        return res.status(200).json({body: "Materia eliminada correctamente"});

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2003') {
            return res.status(400).json({ message: "No se puede eliminar la materia porque tiene prerrequisitos asociados." });
        }
        return res.status(500).json({ message: "Error al eliminar la materia" });
    }
}

export const prereqisito = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // ID de la materia actual
        const { prerequisiteIds } = req.body; // Array de IDs de las materias que son prerrequisito
        const courseId = Number(id);

        // 1. Validar que prerequisiteIds sea un arreglo
        if (!Array.isArray(prerequisiteIds)) {
            return res.status(400).json({ error: 'El formato de prerequisiteIds debe ser un arreglo.' });
        }

        // 2. Eliminar los prerrequisitos anteriores de esta materia para evitar duplicados
        await prisma.prerequisites.deleteMany({
            where: { course_id: courseId }
        });

        // 3. Si se seleccionaron nuevos prerrequisitos, los insertamos en la tabla intermedia
        if (prerequisiteIds.length > 0) {
            const dataToInsert = prerequisiteIds.map(predId => ({
                course_id: courseId,
                prerequisite_course_id: Number(predId)
            }));

            await prisma.prerequisites.createMany({
                data: dataToInsert,
                skipDuplicates: true
            });
        }

        // 4. Consultar el resultado actualizado para devolverlo al cliente
        const updatedCourse = await prisma.courses.findUnique({
            where: { id: courseId },
            include: {
                prerequisites_prerequisites_course_idTocourses: {
                    include: {
                        courses_prerequisites_prerequisite_course_idTocourses: true
                    }
                }
            }
        });

        res.json(updatedCourse);
    } catch (error) {
        console.error("Error al asignar prerrequisitos:", error);
        res.status(500).json({ error: 'Error al asignar prerrequisitos' });
    }
}