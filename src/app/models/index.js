import mongoose from 'mongoose';
const { Schema, model, models, Types } = mongoose;

import UsersModel from './user.js';

const args = {Schema,model,models,Types};

const Users = UsersModel(args);


export { Users };
