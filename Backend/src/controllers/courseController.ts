import {type Request, type Response } from 'express';
import prisma from '../config/prisma.js';

// 1. Obtener todas las materias con sus prerrequisitos
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        prerequisites_prerequisites_course_idTocourses: {
          include: {
            courses_prerequisites_prerequisite_course_idTocourses: true
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