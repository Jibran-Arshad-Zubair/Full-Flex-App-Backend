import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, loginUser, updateUser } from "../app/controllers/userController";

const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/get-all", getAllUsers);
router.get("/get-by-id/:id", getUserById);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
