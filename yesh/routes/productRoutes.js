const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

// Track product (Protected)
router.post("/track-product", authMiddleware, productController.trackProduct);

// Get my tracked products (Protected)
router.get("/my-products", authMiddleware, productController.getMyProducts);

// Update budget (Protected)
router.put("/update-budget/:id", authMiddleware, productController.updateBudget);

// Delete tracked product (Protected)
router.delete("/delete-product/:id", authMiddleware, productController.deleteProduct);

// Track Amazon (Public test route)
router.post("/track-amazon", productController.trackAmazon);

module.exports = router;