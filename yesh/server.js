require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const startCron = require("./services/cronService");

const PORT = process.env.PORT || 4000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startCron(); // start cron after server starts
});