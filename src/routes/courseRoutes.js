import express from "express";
import { checkAuth } from "../app/middlewares/handlers/checkAuth.js";
import { createCourse, deleteCourse, getAllCourses, getSingleCourse } from "../app/controllers/courseController/index.js";



const router = express.Router();


router.post("/create", checkAuth, createCourse);
router.get("/get-all", checkAuth , getAllCourses);
router.get("/get-by-id/:id", checkAuth, getSingleCourse);
router.delete("/delete/:id", checkAuth, deleteCourse);

export default router;