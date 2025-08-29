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
        },
      ],
      category: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        default: "pending",
        enum: ["active", "inactive", "pending"],
      },
      resetOtpExpires: { type: Date, default: null },
      resetOtp: { type: String, default: null },

      ratings: [
        {
          user: { type: Schema.Types.ObjectId, ref: COLLECTIONS.USERS },
          rating: { type: Number, min: 1, max: 5 },
          review: String,
        },
      ],

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: COLLECTIONS.USERS,
        required: true,
      },
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
