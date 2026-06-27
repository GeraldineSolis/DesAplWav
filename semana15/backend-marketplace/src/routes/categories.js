const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", verifyToken, authorizeRole('ADMIN'), categoryController.createCategory);
router.put("/:id", verifyToken, authorizeRole('ADMIN'), categoryController.updateCategory);
router.delete("/:id", verifyToken, authorizeRole('ADMIN'), categoryController.deleteCategory);

module.exports = router;
