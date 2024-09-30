"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes/customer");
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

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const server = require("http").createServer(app);
const socket = require("socket.io")(server, {
  cors: { origin: "*" },
});

socket.on("connection", function (socket) {
  socket.on("deleteProductCart", function (data) {
    socket.emit("cart", data);
    console.log(data);
  });
});

const port = process.env.PORT || 4201;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose.connect(MONGO_URI, (err, res) => {
  if (err) {
    console.log(err);
    console.log(`Current URI URL: ${MONGO_URI}`);
  } else {
    server.listen(port, function () {
      console.log("Server running in port:" + port);
    });
  }
});

// x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false, limit: "5000mb" }));
// parse
app.use(bodyparser.json({ limit: "5000mb" }));

// Directory
app.use(express.static(__dirname + "/uploads/configs"));
app.use(express.static(__dirname + "/uploads/products/"));

app.use("/api", routes);
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

module.exports = app;
