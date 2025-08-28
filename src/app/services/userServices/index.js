import isValidId from "../../../utils/validations/isValidId.js";
import {successfulResponse,invalidResponse} from "../../../utils/responses/responseHandler.js";
import {createHash,createToken,verifyHash} from "../../../utils/tokenService/index.js";
import { Users } from "../../models/index.js";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { emailService } from "../../../utils/nodemailer/nodemailer-services.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function createUserService(data) {
  const { email, userName, password, gender, ...rest } = data;

  if (!email || !password || !userName) {
    return {
      status: 400,
      json: invalidResponse(
        "Email, User Name , and Password are required fields."
      ),
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
    profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
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

    const users = await Users.find({ _id: { $ne: id } });

    if (!users || users.length === 0) {
      return {
        status: 404,
        json: invalidResponse("No other users found."),
      };
    }

    return {
      status: 200,
      json: successfulResponse("Other users retrieved successfully", users),
    };
  } catch (error) {
    console.error("Error in getOtherUsersService:", error);
    return {
      status: 500,
      json: invalidResponse("An error occurred while fetching users."),
    };
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

export async function handleChangePassword(body, userId) {
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return {
        status: 400,
        json: { success: false, message: "Old and new password are required." },
      };
    }

    const user = await Users.findById(userId).select('+password');
    if (!user) {
      return {
        status: 404,
        json: { success: false, message: "User not found!" },
      };
    }

   
    const isMatch = await verifyHash(user.password, oldPassword);
    if (!isMatch) {
      return {
        status: 400,
        json: { success: false, message: "Old password is incorrect!" },
      };
    }

    const hashedPassword = await createHash(newPassword);
    user.password = hashedPassword;
    await user.save();

    return {
      status: 200,
      json: { success: true, message: "Password updated successfully!" },
    };
  }

  export async function handleGoogleLogin(body) {
    try {
      const { token } = body; 
      if (!token) {
        return { status: 400, json: invalidResponse("Google token is required!") };
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name, picture } = payload;

      if (!email) {
        return { status: 400, json: invalidResponse("Google login failed! No email found.") };
      }

      let user = await Users.findOne({ email });
      if (!user) {
        user = await Users.create({
          username: name?.toLowerCase().replace(/\s+/g, "_"),
          email,
          picture,
          role: "user",
          password: null,
        });
      }

      const payloadData = { id: user._id, email: user.email};
      const appToken = createToken(payloadData);

      const userObj = user.toObject();
      delete userObj.password;

      return {
        status: 200,
        json: successfulResponse("Google login successful!", {
          user: userObj,
          token: appToken,
        }),
      };
    } catch (error) {
      console.error("Error in handleGoogleLogin:", error);
      return {
        status: 500,
        json: invalidResponse("Google login failed!"),
      };
    }
  }

 export   async function handleForgotPassword(body) {
    const { email } = body;
    const user = await Users.findOne({ email });

    if (!user) {
      return {
        status: 400,
        json: invalidResponse("Email not found!"),
      };
    }

    const resetToken = createToken({ id: user._id }, "1h");
     const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    const emailTemplatePath = path.join(__dirname, '../../../utils/emailService/templates/forgetPassTemplate.ejs');
    const emailData = {
      user_email: user.email,
      reset_link: resetLink,
      subject: 'Password Reset Request',
    };

    try {
      await emailService.sendPasswordResetEmail(emailData, emailTemplatePath);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }

    return {
      status: 200,
      json: successfulResponse("Password reset email sent!"),
    };
  }
