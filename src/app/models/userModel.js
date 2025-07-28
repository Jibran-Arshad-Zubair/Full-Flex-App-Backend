import { COLLECTIONS } from "../../utils/constants/collections.js";

export default function UsersModel({ Schema, model, models }) {
  const userSchema = new Schema(
    {
      profilePhoto: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
      },
      fullName: {
        type: String,
        default: null,
      },
      userName: {
        type: String,
        unique: true,
      },
      phoneNumber: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
      },

      gender: {
        type: String,
        enum: ["male", "female"],
        default: "male",
      },
    },
    {
      collection: COLLECTIONS.USERS,
      timestamps: true,
    }
  );

  const Users =
    models[COLLECTIONS.USERS] || model(COLLECTIONS.USERS, userSchema);

  return Users;
}
