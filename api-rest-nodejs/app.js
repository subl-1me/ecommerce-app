"use strict";

const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

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

let port = process.env.PORT || 4201;

mongoose.connect("mongodb://127.0.0.1:27017/shop", (err, res) => {
  if (err) {
    console.log(err);
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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS, PATCH"
  );
  res.header("Allow", "GET, PUT, POST, DELETE, OPTIONS, PATCH");
  next();
});

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
