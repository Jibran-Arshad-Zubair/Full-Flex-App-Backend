import isValidId from "../../../utils/validations/isValidId.js";
import {
  successfulResponse,
  invalidResponse,
} from "../../../utils/responses/responseHandler.js";
import { createHash, createToken, verifyHash } from "../../../utils/tokenService/index.js";
import { Users } from "../../models/index.js";

export async function createUserService(data) {
  const { email, userName , password,gender,...rest } = data;

  if (!email || !password || !userName) {
    return {
      status: 400,
      json: invalidResponse("Email, User Name , and Password are required fields."),
    };
  }

  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    return {
      status: 400,
      json: invalidResponse("User with this email already exists."),
    };
  }

  const hashedPassword = await createHash(password);
  const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
  const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

  const newUser = await Users.create({
    email,
    userName,
    profilePhoto:gender==="male"?maleProfilePhoto:femaleProfilePhoto,
    password: hashedPassword,
    ...rest,
  });

  return {
    status: 201,
    json: successfulResponse("User created successfully", newUser),
  };
}

export async function loginUserService(email, password) {
  if (!email || !password) {
    return {
      status: 400,
      json: invalidResponse("Email and password are required."),
    };
  }

  const user = await Users.findOne({ email }).select("+password");

  if (!user) {
    return {
      status: 404,
      json: invalidResponse("User not found."),
    };
  }

  const isPasswordValid = await verifyHash(user.password, password);

  if (!isPasswordValid) {
    return {
      status: 401,
      json: invalidResponse("Invalid password."),
    };
  }

  const token = createToken({ id: user._id, role: user.role });

  return {
    status: 200,
    json: successfulResponse("Login successful", { token, user }),
  };
}

export async function getOtherUsersService(id) {

  try {
     if (!isValidId(id)) {
    return {
      status: 400,
      json: invalidResponse("Invalid user ID."),
    };
  }
  const loggedUserId = id;
  const users = await Users.find({ _id: { $ne: loggedUserId } });
  if (!users) {
    return {
      status: 404,
      json: invalidResponse("No users found."),
    };
  }
  return {
    status: 200,
    json: successfulResponse("Users retrieved successfully", users),
  };
    
  } catch (error) {
    console.error(error);
  }
 
  
}


export async function updateUserService(id, updateData) {
  if (!isValidId(id)) {
    return {
      status: 400,
      json: invalidResponse("Invalid user ID."),
    };
  }

  const updatedUser = await Users.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return {
      status: 404,
      json: invalidResponse("User not found."),
    };
  }

  return {
    status: 200,
    json: successfulResponse("User updated successfully", updatedUser),
  };
}

export async function deleteUserService(id) {
  if (!isValidId(id)) {
    return {
      status: 400,
      json: invalidResponse("Invalid user ID."),
    };
  }

  const deletedUser = await Users.findByIdAndDelete(id);

  if (!deletedUser) {
    return {
      status: 404,
      json: invalidResponse("User not found."),
    };
  }

  return {
    status: 200,
    json: successfulResponse("User deleted successfully", deletedUser),
  };
}

export async function getAllUsersService() {
  const users = await Users.find();

  if (!users.length) {
    return {
      status: 404,
      json: invalidResponse("No users found."),
    };
  }

  return {
    status: 200,
    json: successfulResponse("Users retrieved successfully", users),
  };
}

export async function getUserByIdService(id) {
  if (!isValidId(id)) {
    return {
      status: 400,
      json: invalidResponse("Invalid user ID."),
    };
  }

  const user = await Users.findById(id);

  if (!user) {
    return {
      status: 404,
      json: invalidResponse("User not found."),
    };
  }

  return {
    status: 200,
    json: successfulResponse("User found successfully", user),
  };
}
