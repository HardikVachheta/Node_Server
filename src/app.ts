// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import loanApplicationRoutes from "./routes/loanApplicationRoutes";
import task from "./routes/taskRoutes";
import filter from "./routes/filterRoutes";
import count from "./routes/taskCountRoutes";
import admin from "./routes/adminRoutes";
import messages from "./routes/messages";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MONGO_URL =
  "mongodb+srv://vachhetahardik987:SqqZbcM4y9y9u6PT@cluster0.bruv1o0.mongodb.net/?retryWrites=true&w=majority";
// "mongodb+srv://vachhetahardik987:SqqZbcM4y9y9u6PT@hardik.ebxu8h3.mongodb.net/?retryWrites=true&w=majority";
// "mongodb+srv://vachhetahardik987:3DlCuPO1wknLlZ82@hardik.ebxu8h3.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api", userRoutes);
app.use("/api", loanApplicationRoutes);
app.use("/api", task);
app.use("/api", filter);
app.use("/api", count);
app.use("/api", admin);
app.use("/api", messages);

const onlineUsers: Map<string, string> = new Map();

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  // Handle events from the client
  socket.on("add-user", (userId: string) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data: { to: string; msg: string }) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
    console.log(sendUserSocket)
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT: number | string = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
