import catchAsyncError from "../../../utils/errorHandlers/catchAsyncError.js";
import { sendMessageService } from "../../services/userMessages/index.js";

export const sendMessage = catchAsyncError(async (req, res) => {
   const senderid = req.user.id;
   const receiverid = req.params.id;
   const message = req.body.message;
  const { status, json } = await sendMessageService(senderid, receiverid, message);
  return res.status(status).json(json);
});

