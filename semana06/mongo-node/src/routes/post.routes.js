import express from "express";
import postController from "../controllers/postController.js";

const router = express.Router();

router.get("/", postController.getAll);
router.post("/create", postController.create);
router.get("/edit/:id", postController.getEditForm); 
router.post("/update/:id", postController.update);
router.get("/delete/:id", postController.delete);

export default router;
