// src/app.ts
import express, { Application, Request, Response } from "express";
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
import axios from "axios";

const app: Application = express();
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
  // "mongodb://localhost:27017/temp"  hTTUMAN0SXfnZ3le
  // "mongodb+srv://vachhetahardik987:SqqZbcM4y9y9u6PT@cluster0.bruv1o0.mongodb.net/?retryWrites=true&w=majority";
  "mongodb+srv://vachhetahardik987:hTTUMAN0SXfnZ3le@cluster0.4fg4a.mongodb.net/?retryWrites=true&w=majority";
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


const onlineUsers: Set<{ userId: string; socketId: string }> = new Set();

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // Add user to online users list
  socket.on("add-user", (userId: string) => {
    const userSocket = { userId, socketId: socket.id };
    onlineUsers.add(userSocket);
    console.log("onlineUsers . . . ", onlineUsers);

    // sendData(onlineUsers);

    console.log("Data sent successfully");
    io.emit("online-users", Array.from(onlineUsers));
    console.log(`User ${userId} added with socket ID: ${socket.id}`);
  });

  // Send message to recipient
  socket.on("send-msg", (data: { to: string; msg: string }) => {
    console.log("Message received:", data);

    const recipientUser = Array.from(onlineUsers).find((userSocket) => userSocket.userId === data.to);
    console.log("onlineUsers second . . . ", onlineUsers);
    if (recipientUser) {
      io.to(recipientUser.socketId).emit("msg-recieve", data.msg);
      console.log(`Message sent to user ${data.to}`);
    } else {
      console.log(`User ${data.to} is not online`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from online users list
    onlineUsers.forEach((userSocket) => {
      console.log("check userid",userSocket)
      if (userSocket.socketId === socket.id) {
        onlineUsers.delete(userSocket);
        // sendData(onlineUsers)
        io.emit("online-users", Array.from(onlineUsers));
        console.log(`Removed user ${userSocket.userId} from onlineUsers`);
      }
    });
  });
});
async function sendData(onlineUsers:any) {
  try {
    app.get("/api/onlineUsersData", (req: Request, res: Response) => {
      // Convert onlineUsers Set to an array and send it as JSON
      res.json(Array.from(onlineUsers));
    }); 
  } catch (error) {
    console.error('Error sending data:', error);
  }
}
// const onlineUsers: Map<string, string> = new Map();

// io.on("connection", (socket: Socket) => {
//   console.log(`User connected: ${socket.id}`);

//   // Handle events from the client
//   socket.on("add-user", (userId: string) => {
//     onlineUsers.set(userId, socket.id);
//     console.log(`User ${userId} added with socket ID: ${socket.id}`);
//   });

//   socket.on("send-msg", (data: { to: string; msg: string }) => {
//     console.log("send-msg :-",data)
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       io.to(sendUserSocket).emit("msg-recieve", data.msg);
//       console.log("msg-recieve :-",data)
//     }
//     console.log("onlineUsers",sendUserSocket)
//   });

//   socket.on("error", (error) => {
//     console.error("Socket connection error:", error);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//     onlineUsers.forEach((value, key) => {
//       if (value === socket.id) {
//         console.log(`Removing user ${key} from onlineUsers`);
//         onlineUsers.delete(key);
//       }
//     });
//   });
// });

const PORT: number | string = process.env.APP_PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
