import catchAsyncError from "../../../utils/errorHandlers/catchAsyncError.js";
import { createCourseService, deleteCourseService, getAllCoursesService, getCourseByIdService } from "../../services/courseServices/index.js";

export const createCourse = catchAsyncError(async (req, res) => {
  const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].filename : null;

 
  let videos = [];
  if (req.body.videos) {
    try {
    
      videos = JSON.parse(req.body.videos);
    } catch {
     
      const bodyVideos = [];
      Object.keys(req.body).forEach((key) => {
        const match = key.match(/^videos\[(\d+)\]\[(title|url)\]$/);
        if (match) {
          const index = parseInt(match[1], 10);
          const field = match[2];
          bodyVideos[index] = bodyVideos[index] || {};
          bodyVideos[index][field] = req.body[key];
        }
      });
      videos = bodyVideos;
    }
  }

  const { status, json } = await createCourseService({
    ...req.body,
    teacher: req.user.id,
    thumbnail,
    videos,
  });
  return res.status(status).json(json);
});


export const getAllCourses = catchAsyncError(async (req, res) => {
  const { status, json } = await getAllCoursesService(req.query);
  return res.status(status).json(json);
});

export const getSingleCourse = catchAsyncError(async (req , res ) => {
  const { id } = req.params;
  const { status, json } = await getCourseByIdService(id);
  return res.status(status).json(json);
}) 

export const deleteCourse = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { status, json } = await deleteCourseService(id, req.user.id);
  return res.status(status).json(json);
});