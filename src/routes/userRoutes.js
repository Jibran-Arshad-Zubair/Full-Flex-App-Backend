import express from "express";
import { changePassword, createUser, deleteUser, forgotChangePassword, getAllUsers, getOtherUsers, getUserById, googleLogin, loginUser, sendOTP, updateUser } from "../app/controllers/userController/index.js";
import { checkAuth } from "../app/middlewares/handlers/checkAuth.js";
import { upload } from "../app/middlewares/multer/multer.js";
import { validateRequest } from "../app/middlewares/validate-request.js";

const router = express.Router();

router.post("/register", validateRequest, createUser);
router.post("/login",validateRequest , loginUser);
router.get("/get-all",  checkAuth,validateRequest ,getAllUsers);
router.get("/get-by-id/:id",checkAuth, validateRequest ,getUserById);
router.put("/update/:id",checkAuth, validateRequest,upload.single("profilePhoto"),updateUser);
router.delete("/delete/:id", checkAuth,validateRequest ,deleteUser);
router.get("/get-other-users/:id", checkAuth,validateRequest ,getOtherUsers);
router.put("/change-password", checkAuth,validateRequest ,changePassword);
router.post("/google-login",validateRequest,googleLogin);
router.post("/send-otp",validateRequest ,sendOTP);
router.post("/forgot-password",validateRequest ,forgotChangePassword);


export default router;
