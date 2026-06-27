const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", verifyToken, authorizeRole('ADMIN'), productController.createProduct);
router.put("/:id", verifyToken, authorizeRole('ADMIN'), productController.updateProduct);
router.delete("/:id", verifyToken, authorizeRole('ADMIN'), productController.deleteProduct);

module.exports = router;