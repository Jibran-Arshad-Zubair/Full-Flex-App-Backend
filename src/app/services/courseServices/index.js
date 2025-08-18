import { successfulResponse, invalidResponse } from "../../../utils/responses/responseHandler.js";
import { Courses } from "../../models/index.js";
import isValidId from "../../../utils/validations/isValidId.js";
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

export async function getAllCoursesService(queryParams = {}) {
  try {
    const { category, price, sort, limit = 10 } = queryParams;
    
    const filter = {};
    if (category) filter.category = category;
    if (price) {
      if (price.gte) filter.price = { $gte: Number(price.gte) };
      if (price.lte) filter.price = { ...filter.price, $lte: Number(price.lte) };
    }

    const sortOptions = {};
    if (sort) {
      if (sort === 'price-asc') sortOptions.price = 1;
      if (sort === 'price-desc') sortOptions.price = -1;
      if (sort === 'newest') sortOptions.createdAt = -1;
    }

    const courses = await Courses.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .populate('teacher', 'fullName email');

    return {
      status: 200,
      json: successfulResponse("Courses retrieved successfully", courses),
    };
  } catch (error) {
    console.error("Error in getAllCoursesService:", error);
    return {
      status: 500,
      json: invalidResponse("Failed to fetch courses"),
    };
  }
}

export async function getCourseByIdService(id) {
  if (!isValidId(id)) {
    return {
      status: 400,
      json: invalidResponse("Invalid course ID"),
    };
  }

  try {
    const course = await Courses.findById(id)
      .populate('teacher', 'fullName email')
      .populate('students', 'fullName email')
      .populate('ratings.user', 'fullName');

    if (!course) {
      return {
        status: 404,
        json: invalidResponse("Course not found"),
      };
    }

    return {
      status: 200,
      json: successfulResponse("Course retrieved successfully", course),
    };
  } catch (error) {
    console.error("Error in getCourseByIdService:", error);
    return {
      status: 500,
      json: invalidResponse("Failed to fetch course"),
    };
  }
}


export async function updateCourseService(id, updateData, userId) {
  if (!isValidId(id)) {
    return {
      status: 400,
      json: invalidResponse("Invalid course ID"),
    };
  }

  try {
    
    const course = await Courses.findById(id);
    if (!course) {
      return {
        status: 404,
        json: invalidResponse("Course not found"),
      };
    }

    if (course.teacher.toString() !== userId.toString()) {
      return {
        status: 403,
        json: invalidResponse("Unauthorized to update this course"),
      };
    }

    const updatedCourse = await Courses.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('teacher', 'fullName email');

    return {
      status: 200,
      json: successfulResponse("Course updated successfully", updatedCourse),
    };
  } catch (error) {
    console.error("Error in updateCourseService:", error);
    return {
      status: 500,
      json: invalidResponse("Failed to update course"),
    };
  }
}


export async function deleteCourseService(id, userId) {
  if (!isValidId(id)) {
    return {
      status: 400,
      json: invalidResponse("Invalid course ID"),
    };
  }

  try {
  
    const course = await Courses.findById(id);
    if (!course) {
      return {
        status: 404,
        json: invalidResponse("Course not found"),
      };
    }
    await Courses.findByIdAndDelete(id);
    return {
      status: 200,
      json: successfulResponse("Course deleted successfully"),
    };
  } catch (error) {
    console.error("Error in deleteCourseService", error);
    return {
      status: 500,
      json: invalidResponse("Failed to delete course"),
    };
  }
}

// Add Video to Course
export async function addVideoToCourseService(courseId, videoData, userId) {
  if (!isValidId(courseId)) {
    return {
      status: 400,
      json: invalidResponse("Invalid course ID"),
    };
  }

  try {
    const course = await Courses.findById(courseId);
    if (!course) {
      return {
        status: 404,
        json: invalidResponse("Course not found"),
      };
    }

    if (course.teacher.toString() !== userId.toString()) {
      return {
        status: 403,
        json: invalidResponse("Unauthorized to add videos to this course"),
      };
    }

    course.videos.push(videoData);
    await course.save();

    return {
      status: 200,
      json: successfulResponse("Video added successfully", course),
    };
  } catch (error) {
    console.error("Error in addVideoToCourseService:", error);
    return {
      status: 500,
      json: invalidResponse("Failed to add video"),
    };
  }
}