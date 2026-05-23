
// import dotenv from "dotenv";
// dotenv.config();

// import http from "http";
// import { Server } from "socket.io";

// import app from "./app";
// import connectDB from "./config/db";

// import socketSetup from "./socket/socket";

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {

//   await connectDB();

//   const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//       origin: "*"
//     }
//   });

//   // socket setup
//   socketSetup(io);
//   server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };

// startServer();


import dotenv from "dotenv";

dotenv.config();

import http from "http";

import { Server } from "socket.io";

import app from "./app";

import connectDB from "./config/db";

import socketSetup from "./socket/socket";

const PORT =
  process.env.PORT || 5000;

// EXPORT IO
export let io: Server;

const startServer = async () => {

  await connectDB();

  const server =
    http.createServer(app);

  io = new Server(server, {

    cors: {

      origin: "*"
    }
  });

  // SOCKET SETUP
  socketSetup(io);

  server.listen(PORT, () => {

    console.log(

      `Server running on port ${PORT}`
    );
  });
};

startServer();