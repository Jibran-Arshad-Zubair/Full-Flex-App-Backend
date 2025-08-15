import { COLLECTIONS } from "../../utils/constants/collections.js";

export default function CourseModel({ Schema, model, models }) {
  const courseSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      thumbnail: {
        type: String,
        default: null,
      },
      teacher: {
        type: Schema.Types.ObjectId,
        ref: COLLECTIONS.USERS,
        required: true,
      },
      students: [
        {
          type: Schema.Types.ObjectId,
          ref: COLLECTIONS.USERS,
        },
      ],
      videos: [
        {
          title: String,
          url: String,
          duration: String,
        },
      ],
      category: {
        type: String,
        enum: ["web-development", "ai", "design", "marketing"],
        default: "web-development",
      },
      ratings: [
        {
          user: { type: Schema.Types.ObjectId, ref: COLLECTIONS.USERS },
          rating: { type: Number, min: 1, max: 5 },
          review: String,
        },
      ],
    },
    {
      collection: COLLECTIONS.COURSES,
      timestamps: true,
    }
  );

  const Courses =
    models[COLLECTIONS.COURSES] || model(COLLECTIONS.COURSES, courseSchema);

  return Courses;
}