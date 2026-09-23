"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const customerRoutes = require("./routes/customer");
const admRoutes = require("./routes/admin");
const productRoutes = require("./routes/product");
const productInventoryRoutes = require("./routes/productInventory");
const couponRoutes = require("./routes/coupon");
const configRoutes = require("./routes/config");
const reviewRoutes = require("./routes/review");
const cartRoutes = require("./routes/cart");
const directionRoutes = require("./routes/direction");
const saleRoutes = require("./routes/sale");
const stripeRoutes = require("./routes/stripe");
const orderRoutes = require("./routes/order");
const promotionRoutes = require("./routes/promotion");
const contactRoutes = require("./routes/contact");
const uploadRoutes = require("./routes/uploads");

const {
  createInitialEcommerceConfig,
} = require("./config/defaultConfigurations");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false, limit: "5000mb" }));
// parse
app.use(bodyparser.json({ limit: "5000mb" }));

// Directory
app.use(express.static(__dirname + "/uploads/configs"));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads", "products")),
);

// Routes
app.use("/api", customerRoutes);
app.use("/api", admRoutes);
app.use("/api", productRoutes);
app.use("/api", productInventoryRoutes);
app.use("/api", couponRoutes);
app.use("/api", configRoutes);
app.use("/api", reviewRoutes);
app.use("/api", cartRoutes);
app.use("/api", directionRoutes);
app.use("/api", saleRoutes);
app.use("/api", stripeRoutes);
app.use("/api", orderRoutes);
app.use("/api", promotionRoutes);
app.use("/api", contactRoutes);
app.use("/api", uploadRoutes);

const server = require("http").createServer(app);
const socket = require("socket.io")(server, {
  cors: { origin: "*" },
});

const port = process.env.PORT || 4201;
const MONGO_URI = process.env.MONGO_URI || "";

socket.on("connection", function (socket) {
  socket.on("deleteProductCart", function (data) {
    socket.emit("cart", data);
    console.log(data);
  });
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    server.listen(port, async () => {
      console.log(`Server running on port: ${port}`);

      // create default configuration
      await createInitialEcommerceConfig();
    });
  } catch (error) {
    console.error("Error trying to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
