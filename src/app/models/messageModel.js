import { COLLECTIONS } from "../../utils/constants/collections.js";


export default function MessageModel({ Schema, model, models, Types }) {
  const messageSchema = new Schema({
    senderId: {
      type: Types.ObjectId,
      ref: COLLECTIONS.USERS,
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: COLLECTIONS.USERS,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  }, {
    timestamps: true,
  });

  const Message = models[COLLECTIONS.MESSAGES] || model(COLLECTIONS.MESSAGES, messageSchema);
  return Message;
}

