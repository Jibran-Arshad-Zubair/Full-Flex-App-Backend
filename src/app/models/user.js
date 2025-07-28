import { COLLECTIONS } from "../../utils/constants/collections.js";

export default function UsersModel({ Schema, model, models }) {
  const userSchema = new Schema(
    {
      avatar: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        default: null,
      },
      lastName: {
        type: String,
        default: null,
      },
      phoneNumber: {
        type: String,
        default: null,
      },
      role: {
        type: String,
        enum: ["admin", "owner", "member"],
        required: true,
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

      organization: {
        type: Schema.Types.ObjectId,
        ref: COLLECTIONS.ORGANIZATIONS,
        default: null,
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
