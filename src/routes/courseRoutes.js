import express from "express";
import { checkAuth } from "../app/middlewares/handlers/checkAuth.js";
import { createCourse } from "../app/controllers/courseController/index.js";



const router = express.Router();


router.post("/create", checkAuth, createCourse);

export default router;