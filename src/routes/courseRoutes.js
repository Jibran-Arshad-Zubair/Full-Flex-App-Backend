import express from "express";
import { checkAuth } from "../app/middlewares/handlers/checkAuth.js";
import { createCourse,deleteCourse,getAllCourses,getSingleCourse,updateCourse} from "../app/controllers/courseController/index.js";
import { upload } from "../app/middlewares/multer/multer.js";
const router = express.Router();

router.post(
  "/create",
  checkAuth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videos", maxCount: 5 },
    { name: "files", maxCount: 5 },
  ]),
  createCourse
);
router.get("/get-all", checkAuth, getAllCourses);
router.get("/get-by-id/:id", checkAuth, getSingleCourse);
router.delete("/delete/:id", checkAuth, deleteCourse);
router.put(
  "/update/:id",
  checkAuth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videos", maxCount: 5 },
    { name: "files", maxCount: 5 },
  ]),
  updateCourse
);

export default router;
