import { Router } from "express";
import { createCourse, deleteCourse, getCourses, readCourse, updateCourse } from "../controllers/courseController.js";
import { generateSchedule } from "../controllers/scheduleController.js";

const router = Router();

router.post('/courses', createCourse);
router.get('/courses', getCourses);
router.get('/courses/:id', readCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

//scheduleRoutes
router.post('/course/schedule/generate', generateSchedule);

export default router;