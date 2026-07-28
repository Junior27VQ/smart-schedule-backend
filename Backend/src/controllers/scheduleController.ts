import { type Request, type Response } from 'express';
import { validateAndGenerateSchedule } from '../services/scheduleService.js';

export const generateSchedule = async (req: Request, res: Response) => {
  try {
    const { 
      courseIds,
      numberOfCourses, 
      maximumCredits, 
      maximumDifficultCourses, 
      requiredCourses, 
      requiredModality,
      validatePrerequisites,
      avoidTimeConflicts
    } = req.body;

    const result = await validateAndGenerateSchedule({
      courseIds,
      numberOfCourses,
      maximumCredits,
      maximumDifficultCourses,
      requiredCourses,
      requiredModality,
      validatePrerequisites,
      avoidTimeConflicts
    });

    return res.status(200).json(result);

  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message || 'Error al generar el horario' });
  }
};