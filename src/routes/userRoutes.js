import express from "express";
import { changePassword, createUser, deleteUser, getAllUsers, getOtherUsers, getUserById, loginUser, updateUser } from "../app/controllers/userController/index.js";
import { checkAuth } from "../app/middlewares/handlers/checkAuth.js";

const router = express.Router();

router.post("/register",  createUser);
router.post("/login", loginUser);
router.get("/get-all", checkAuth, getAllUsers);
router.get("/get-by-id/:id",checkAuth, getUserById);
router.put("/update/:id", checkAuth, updateUser);
router.delete("/delete/:id", checkAuth, deleteUser);
router.get("/get-other-users/:id", checkAuth, getOtherUsers);
router.put("/change-password", checkAuth, changePassword);

export default router;
