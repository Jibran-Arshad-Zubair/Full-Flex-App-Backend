import { successfulResponse, invalidResponse } from "../../../utils/responses/responseHandler.js";
import { Courses } from "../../models/index.js";

export async function createCourseService(data) {
  const { title, description, price, teacher, category, thumbnail } = data;

  if (!title || !description || !price || !teacher || !category) {
    return {
      status: 400,
      json: invalidResponse("Title, description, price, teacher, and category are required."),
    };
  }

  try {
    const newCourse = await Courses.create({
      title,
      description,
      price,
      teacher,
      category,
      thumbnail: thumbnail || null,
    });

    return {
      status: 201,
      json: successfulResponse("Course created successfully", newCourse),
    };
  } catch (error) {
    console.error("Error in createCourseService:", error);
    return {
      status: 500,
      json: invalidResponse("Failed to create course"),
    };
  }
}