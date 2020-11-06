const express = require("express");
const env = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");

// environtment variable
env.config();

// mongoDB connection
// mongodb+srv://ecommerceadmin:<password>@cluster0.p3soq.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.p3soq.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority?authSource=${process.env.MONGO_DB_DATABASE}&w=1`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

app.use(bodyParser());

app.use("/api", authRoutes);
app.use("/api", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
