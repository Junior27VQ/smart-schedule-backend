import { Router } from "express";
import { createCourse, deleteCourse, getCourses, readCourse, updateCourse } from "../controllers/courseController.js";

const router = Router();

router.post('/create', createCourse);
router.get('/leer', getCourses);
router.get('/leer/:id', readCourse);
router.put('/update/:id', updateCourse);
router.delete('/delete/:id', deleteCourse);

export default router;