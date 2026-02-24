import express from "express";

import { createServer } from "node:http";
import { Server } from "socket.io";

import cors from "cors";
import { connectToSocket } from "../controllers/socketManager.js";

import mongoose from "mongoose";
import { connect } from "node:http2";

import userRoutes from "../routes/user.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 1010);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
  return res.json({ hello: "world" });
});

const start = async () => {
  const connectionDb = await mongoose.connect(
    "mongodb+srv://chiranjeevi:chiri2166@cluster0.jbhwmqx.mongodb.net/?appName=Cluster0",
  );
  console.log(`mongo connected: ${connectionDb.connection.host}`);
  server.listen(app.get("port"), (req, res) => {
    return console.log("listening on port 1010");
  });
};

start();
