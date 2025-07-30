import isValidId from "../../../utils/validations/isValidId.js";
import {
  successfulResponse,
  invalidResponse,
} from "../../../utils/responses/responseHandler.js";

import { Conversations, Messages } from "../../models/index.js";

export async function sendMessageService(senderId, receiverId, message) {
  try {
    
    if (!isValidId(senderId) || !isValidId(receiverId)) {
      return {
        status: 400,
        json: invalidResponse("Invalid user ID."),
      };
    }

    let gotConversation = await Conversations.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversations.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Messages.create({ senderId, receiverId, message });

    if (newMessage) {
      gotConversation.messages.push(newMessage._id);
      await gotConversation.save();
    }

    // Socket IO

    return {
      status: 200,
      json: successfulResponse("Message sent successfully", newMessage),
    };
  } catch (error) {
    console.error("Error in sendMessageService:", error);
    return {
      status: 500,
      json: invalidResponse("An error occurred while sending the message."),
    };
  }
}

