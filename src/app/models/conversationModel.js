import { COLLECTIONS } from "../../utils/constants/collections.js";

export default function ConversationModel({ Schema, model, models, Types }) {
  const conversationSchema = new Schema(
    {
      participants: [
        {
        type: Types.ObjectId,
        ref: COLLECTIONS.USERS,
        required: true,
      }],

      messages: [
        {
          type: Types.ObjectId,
          ref: COLLECTIONS.MESSAGES,
          required: true,
        },
      ]
     
    },
    {
      timestamps: true,
    }
  );

  const Conversation =
    models[COLLECTIONS.CONVERSATIONS] || model(COLLECTIONS.CONVERSATIONS, conversationSchema);

  return Conversation;
}
