// const puppeteer = require("puppeteer");

// const scrapeAmazonProduct = async (url) => {
//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"]
//     });

//     const page = await browser.newPage();

//     await page.goto(url, {
//       waitUntil: "domcontentloaded",
//       timeout: 60000
//     });

//     const data = await page.evaluate(() => {
//       const title =
//         document.querySelector("#productTitle")?.innerText.trim();

//       const priceText =
//         document.querySelector(".a-price .a-offscreen")?.innerText;

//       const image =
//         document.querySelector("#imgTagWrapperId img")?.src;

//       const originalPriceText =
//         document.querySelector(".a-price.a-text-price .a-offscreen")
//           ?.innerText;

//       const cleanPrice = (text) => {
//         if (!text) return null;
//         return Number(text.replace(/[^\d]/g, ""));
//       };

//       return {
//         title,
//         currentPrice: cleanPrice(priceText),
//         originalPrice: cleanPrice(originalPriceText),
//         image
//       };
//     });

//     await browser.close();

//     return data;

//   } catch (error) {
//     console.log("Scraper error:", error.message);
//     return null;
//   }
// };

// module.exports = scrapeAmazonProduct;



const puppeteer = require("puppeteer");

const scrapeAmazonProduct = async (url) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    const data = await page.evaluate(() => {
      const title =
        document.querySelector("#productTitle")?.innerText.trim();

      const priceText =
        document.querySelector(".a-price .a-offscreen")?.innerText;

      const image =
        document.querySelector("#imgTagWrapperId img")?.src;

      const originalPriceText =
        document.querySelector(".a-price.a-text-price .a-offscreen")
          ?.innerText;

      const cleanPrice = (text) => {
        if (!text) return null;

        return parseFloat(
          text
            .replace(/[₹,]/g, "")  // 🔥 KEEP decimal point
            .trim()
        );
      };

      return {
        title,
        currentPrice: cleanPrice(priceText),
        originalPrice: cleanPrice(originalPriceText),
        image
      };
    });

    await browser.close();

    return data;

  } catch (error) {
    console.log("Scraper error:", error.message);
    return null;
  }
};

module.exports = scrapeAmazonProduct;