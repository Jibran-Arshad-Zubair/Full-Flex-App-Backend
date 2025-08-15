import mongoose from 'mongoose';
const { Schema, model, models, Types } = mongoose;

import UsersModel from './userModel.js';
import MessageModel from './messageModel.js';
import ConversationModel from './conversationModel.js';
import CourseModel from './courseModel.js';

const args = {Schema,model,models,Types};

const Users = UsersModel(args);
const Messages = MessageModel(args);
const Conversations = ConversationModel(args);
const Courses = CourseModel(args);

export { Users , Messages , Conversations, Courses };
