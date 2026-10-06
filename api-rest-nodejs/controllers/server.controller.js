"use strict";

const ServerService = require("../services/server.service");

const deepCheck = async function (_req, res) {
  const startTime = Date.now();
  try {
    await ServerService.checkDB();
    const latency = Date.now() - startTime;
    return res.status(200).json({
      status: "healthy", // server
      dbLatency: `${latency}ms`, // mongo
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(503).json({
      status: "unhealthy",
      dbLatency: `${latency}ms`, // mongo
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = {
  deepCheck,
};
