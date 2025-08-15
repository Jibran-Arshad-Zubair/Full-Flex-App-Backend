import catchAsyncError from "../../../utils/errorHandlers/catchAsyncError.js";
import { createCourseService } from "../../services/courseServices/index.js";

export const createCourse = catchAsyncError(async (req, res) => {
  const { status, json } = await createCourseService({
    ...req.body,
    teacher: req.user.id, 
  });
  return res.status(status).json(json);
});