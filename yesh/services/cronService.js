const cron = require("node-cron");
const Product = require("../models/Product");
const scrapeAmazonProduct = require("./scraperService");

let isRunning = false;

const startCron = () => {

  cron.schedule(process.env.CRON_SCHEDULE, async () => {

    if (isRunning) {
      console.log("Previous cron still running. Skipping...");
      return;
    }

    isRunning = true;

    console.log("🔄 Running auto price check...");

    try {

      const products = await Product.find();

      for (let product of products) {

        console.log("Checking:", product.title);

        const scrapedData = await scrapeAmazonProduct(product.url);

        if (scrapedData && scrapedData.currentPrice) {

          const lastEntry =
            product.priceHistory[product.priceHistory.length - 1];

          if (!lastEntry || lastEntry.price !== scrapedData.currentPrice) {

            product.currentPrice = scrapedData.currentPrice;
            product.originalPrice = scrapedData.originalPrice;

            product.priceHistory.push({
              price: scrapedData.currentPrice
            });

            await product.save();

            console.log("Price changed. Updated:", product.title);

          } else {
            console.log("No price change:", product.title);
          }
        }
      }

      console.log("✅ Auto price check completed");

    } catch (error) {
      console.log("❌ Cron job error:", error.message);
    }

    isRunning = false;

  });

};

module.exports = startCron;