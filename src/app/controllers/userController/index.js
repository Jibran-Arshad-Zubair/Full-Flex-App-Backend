import catchAsyncError from "../../../utils/errorHandlers/catchAsyncError.js";
import { createUserService, deleteUserService, getAllUsersService, getOtherUsersService, getUserByIdService, handleChangePassword, handleForgotPassword, handleGoogleLogin, loginUserService, updateUserService } from "../../services/userServices/index.js";

export const createUser = catchAsyncError(async (req, res) => {
  const { status, json } = await createUserService(req.body);
  return res.status(status).json(json);
});

export const loginUser = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  const { status, json } = await loginUserService(email, password);
  return res.status(status).json(json);
});

export const updateUser = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const updateData = {
    ...req.body,
  };

  if (req.file) {
    updateData.profilePhoto = `/uploads/${req.file.filename}`; 
  }

  const { status, json } = await updateUserService(id, updateData);
  return res.status(status).json(json);
});

export const deleteUser = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { status, json } = await deleteUserService(id);
  return res.status(status).json(json);
});

export const getAllUsers = catchAsyncError(async (req, res) => {
  const { status, json } = await getAllUsersService();
  return res.status(status).json(json);
});

export const getUserById = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { status, json } = await getUserByIdService(id);
  return res.status(status).json(json);
});

export const getOtherUsers = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { status, json } = await getOtherUsersService(id);
  return res.status(status).json(json);
});

export  const changePassword = catchAsyncError(async function(req, res) {
    const { body } = req;
    const { status, json } = await handleChangePassword( body, req.user?.id );
    return res.status(status).json(json);
  });

export  const googleLogin = catchAsyncError (async function(req, res) {
    const { status, json } = await handleGoogleLogin(req.body);
    return res.status(status).json(json);
  });

  export const forgotPassword = catchAsyncError(async function(req, res) {
    const { status, json } = await handleForgotPassword(req.body);
    return res.status(status).json(json);
  });