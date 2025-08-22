import catchAsyncError from "../../../utils/errorHandlers/catchAsyncError.js";
import { parseVideosFromBody } from "../../../utils/parser/parseVideos.js";
import { createCourseService, deleteCourseService, getAllCoursesService, getCourseByIdService } from "../../services/courseServices/index.js";

export const createCourse = catchAsyncError(async (req, res) => {
  const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].filename : null;
  const videos = parseVideosFromBody(req.body);
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