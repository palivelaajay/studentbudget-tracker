const Product = require("../models/Product");
const TrackedProduct = require("../models/TrackedProduct");
const scrapeAmazonProduct = require("../services/scraperService");


// =============================
// TRACK PRODUCT (Protected)
// =============================
exports.trackProduct = async (req, res) => {
  try {
    const { url, budget } = req.body;

    if (!url || !budget) {
      return res.status(400).json({
        message: "URL and Budget required"
      });
    }

    const scrapedData = await scrapeAmazonProduct(url);

    if (!scrapedData || !scrapedData.currentPrice) {
      return res.status(500).json({
        message: "Failed to scrape product"
      });
    }

    let product = await Product.findOne({ url });

    if (product) {
      product.priceHistory.push({
        price: scrapedData.currentPrice
      });

      product.currentPrice = scrapedData.currentPrice;
      product.originalPrice = scrapedData.originalPrice;
      product.image = scrapedData.image;
      product.title = scrapedData.title;

      await product.save();

    } else {
      product = new Product({
        title: scrapedData.title,
        url,
        image: scrapedData.image,
        currentPrice: scrapedData.currentPrice,
        originalPrice: scrapedData.originalPrice,
        priceHistory: [
          { price: scrapedData.currentPrice }
        ]
      });

      await product.save();
    }

    const existingTracked = await TrackedProduct.findOne({
      userId: req.userId,
      productId: product._id
    });

    if (existingTracked) {
      return res.status(400).json({
        message: "Already tracking this product"
      });
    }

    const trackedItem = new TrackedProduct({
      userId: req.userId,
      productId: product._id,
      budget,
      url,
      platform: "AMAZON"
    });

    await trackedItem.save();

    res.status(201).json({
      message: "Product added successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



// =============================
// MY PRODUCTS (Protected)
// =============================
exports.getMyProducts = async (req, res) => {
  try {
    const trackedProducts = await TrackedProduct.find({
      userId: req.userId
    })
      .populate("productId")
      .sort({ createdAt: -1 });

    const response = trackedProducts.map(item => {
      const currentPrice = item.productId.currentPrice;
      const budget = item.budget;

      const difference = currentPrice - budget;
      const percentage = ((difference / budget) * 100).toFixed(2);

      let status = "WAIT";

      if (currentPrice <= budget) {
        status = "BUY";
      } else if (currentPrice <= budget * 1.05) {
        status = "NEAR";
      }

      return {
        _id: item._id,
        title: item.productId.title,
        image: item.productId.image,
        currentPrice,
        budget,
        difference,
        percentage,
        status
      };
    });

    res.json({ products: response });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
};



// =============================
// UPDATE BUDGET (Protected)
// =============================
exports.updateBudget = async (req, res) => {
  try {
    const { budget } = req.body;

    if (!budget) {
      return res.status(400).json({
        message: "Budget is required"
      });
    }

    const updated = await TrackedProduct.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId
      },
      {
        budget: Number(budget)
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Budget updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update budget",
      error: error.message
    });
  }
};



// =============================
// DELETE PRODUCT (Protected)
// =============================
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await TrackedProduct.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
};



// =============================
// TRACK AMAZON (Public)
// =============================
exports.trackAmazon = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL required" });
    }

    const scrapedData = await scrapeAmazonProduct(url);

    if (!scrapedData || !scrapedData.currentPrice) {
      return res.status(500).json({
        message: "Failed to scrape product"
      });
    }

    let product = await Product.findOne({ url });

    if (product) {
      product.priceHistory.push({
        price: scrapedData.currentPrice
      });

      product.currentPrice = scrapedData.currentPrice;
      product.originalPrice = scrapedData.originalPrice;
      product.image = scrapedData.image;
      product.title = scrapedData.title;

      await product.save();

    } else {
      product = new Product({
        title: scrapedData.title,
        url,
        image: scrapedData.image,
        currentPrice: scrapedData.currentPrice,
        originalPrice: scrapedData.originalPrice,
        priceHistory: [
          { price: scrapedData.currentPrice }
        ]
      });

      await product.save();
    }

    res.json({
      message: "Product tracked successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};