
// // import {
// //   Server,
// //   Socket
// // } from "socket.io";

// // import Message from "../models/message.model";

// // import User from "../models/user.model";

// // const onlineUsers =
// //   new Map();

// // const socketSetup =
// //   (io: Server) => {

// //     io.on(

// //       "connection",

// //       (socket: Socket) => {

// //         console.log(
// //           "User Connected:",
// //           socket.id
// //         );

// //         socket.on(

// //           "join",

// //           async (
// //             userId: string
// //           ) => {

// //             onlineUsers.set(
// //               userId,
// //               socket.id
// //             );

// //             await User.findByIdAndUpdate(

// //               userId,

// //               {
// //                 isOnline: true
// //               }
// //             );

// //             io.emit(

// //               "online-users",

// //               Array.from(
// //                 onlineUsers.keys()
// //               )
// //             );

// //             console.log(
// //               "Online Users:",
// //               onlineUsers
// //             );
// //           }
// //         );

// //         // SEND MESSAGE
// //         socket.on(

// //           "send-message",

// //           async (data) => {

// //             try {

// //               const {

// //                 sender,

// //                 receiver,

// //                 text

// //               } = data;

// //               // SAVE MESSAGE
// //               // const message =
// //               //   await Message.create({

// //               //     sender,

// //               //     receiver,

// //               //     text,

// //               //     seen: false
// //               //   });

// //               const newMessage =
// //                 await Message.create({

// //                   sender,

// //                   receiver,

// //                   text,

// //                   seen: false
// //                 });

// //               const message =
// //                 await Message.findById(
// //                   newMessage._id
// //                 )

// //               .populate(
// //                 "sender",
// //                 "name email"
// //               )

// //               .populate(
// //                 "receiver",
// //                 "name email"
// //               );
// //               // RECEIVER SOCKET
// //               const receiverSocketId =
// //                 onlineUsers.get(
// //                   receiver
// //                 );

// //               // REALTIME SEND
// //               if (
// //                 receiverSocketId
// //               ) {

// //                 io.to(
// //                   receiverSocketId
// //                 ).emit(

// //                   "receive-message",

// //                   message
// //                 );
// //               }

// //             } catch (error) {

// //               console.log(error);
// //             }
// //           }
// //         );

// //         // SEEN MESSAGE
// //         socket.on(

// //           "message-seen",

// //           async ({
// //             senderId,
// //             receiverId
// //           }) => {

// //             await Message.updateMany(

// //               {

// //                 sender:
// //                   senderId,

// //                 receiver:
// //                   receiverId,

// //                 seen: false
// //               },

// //               {

// //                 seen: true
// //               }
// //             );

// //             const senderSocketId =
// //               onlineUsers.get(
// //                 senderId
// //               );

// //             // DOUBLE TICK UPDATE
// //             if (
// //               senderSocketId
// //             ) {

// //               io.to(
// //                 senderSocketId
// //               ).emit(

// //                 "messages-seen",

// //                 {
// //                   senderId
// //                 }
// //               );
// //             }
// //           }
// //         );

// //         // DISCONNECT
// //         socket.on(

// //           "disconnect",

// //           async () => {

// //             console.log(
// //               "User Disconnected:",
// //               socket.id
// //             );

// //             for (

// //               const [
// //                 key,
// //                 value
// //               ]

// //               of onlineUsers.entries()

// //             ) {

// //               if (
// //                 value ===
// //                 socket.id
// //               ) {

// //                 // REMOVE USER
// //                 onlineUsers.delete(
// //                   key
// //                 );

// //                 // UPDATE LAST SEEN
// //                 await User.findByIdAndUpdate(

// //                   key,

// //                   {

// //                     isOnline: false,

// //                     lastSeen:
// //                       new Date()
// //                   }
// //                 );
// //               }
// //             }

// //             // SEND ONLINE USERS
// //             io.emit(

// //               "online-users",

// //               Array.from(
// //                 onlineUsers.keys()
// //               )
// //             );
// //           }
// //         );
// //       }
// //     );
// // };

// // export default socketSetup;


// import { Server, Socket } from "socket.io";

// import Message from "../models/message.model";
// import User from "../models/user.model";

// const onlineUsers = new Map();

// const socketSetup = (io: Server) => {

//   io.on("connection", (socket: Socket) => {

//     console.log("User Connected:", socket.id);

//     // JOIN
//     socket.on("join", async (userId: string) => {

//       onlineUsers.set(userId, socket.id);

//       await User.findByIdAndUpdate(userId, {
//         isOnline: true
//       });

//       io.emit(
//         "online-users",
//         Array.from(onlineUsers.keys())
//       );
//     });

//     // SEND MESSAGE
//     socket.on("send-message", async (data) => {

//       try {

//         console.log("DATA:", data);

//         const { sender, receiver, text } = data;

//         // VALIDATION
//         if (!sender || !receiver || !text) {
//           console.log("Missing fields");
//           return;
//         }

//         // SAVE MESSAGE
//         const newMessage = await Message.create({
//           sender,
//           receiver,
//           text,
//           seen: false
//         });

//         // POPULATE
//         const message = await Message.findById(newMessage._id)
//           .populate("sender", "name email")
//           .populate("receiver", "name email");

//         console.log("Saved:", message);

//         // RECEIVER SOCKET
//         const receiverSocketId = onlineUsers.get(receiver);

//         // SEND TO RECEIVER
//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit(
//             "receive-message",
//             message
//           );
//         }

//         // SEND BACK TO SENDER
//         socket.emit(
//           "receive-message",
//           message
//         );

//       } catch (error) {

//         console.log("SOCKET ERROR:", error);
//       }
//     });

//     // MESSAGE SEEN
//     socket.on(
//       "message-seen",
//       async ({ senderId, receiverId }) => {

//         await Message.updateMany(
//           {
//             sender: senderId,
//             receiver: receiverId,
//             seen: false
//           },
//           {
//             seen: true
//           }
//         );

//         const senderSocketId =
//           onlineUsers.get(senderId);

//         if (senderSocketId) {

//           io.to(senderSocketId).emit(
//             "messages-seen",
//             { senderId }
//           );
//         }
//       }
//     );

//     // DISCONNECT
//     socket.on("disconnect", async () => {

//       console.log(
//         "User Disconnected:",
//         socket.id
//       );

//       for (const [key, value] of onlineUsers.entries()) {

//         if (value === socket.id) {

//           onlineUsers.delete(key);

//           await User.findByIdAndUpdate(key, {
//             isOnline: false,
//             lastSeen: new Date()
//           });
//         }
//       }

//       io.emit(
//         "online-users",
//         Array.from(onlineUsers.keys())
//       );
//     });
//   });
// };

// export default socketSetup;
// socket/socket.ts
// import { Server, Socket } from "socket.io";
// import User from "../models/user.model";

// const socketSetup = (io: Server) => {
//   io.on("connection", (socket: Socket) => {
//     console.log("[Socket] Connected:", socket.id);

//     // ✅ User login hone par apne userId ke room mein join kare
//     socket.on("join", async (userId: string) => {
//       socket.join(`user_${userId}`);
//       console.log(`[Socket] User ${userId} joined room user_${userId}`);

//       await User.findByIdAndUpdate(userId, {
//         isOnline: true,
//         lastSeen: new Date()
//       });

//       io.emit("user-status", { userId, isOnline: true });
//     });

//     socket.on("disconnect", async () => {
//       // Room se userId nikalo
//       const rooms = Array.from(socket.rooms);
//       const userRoom = rooms.find(r => r.startsWith("user_"));
//       if (userRoom) {
//         const userId = userRoom.replace("user_", "");
//         await User.findByIdAndUpdate(userId, {
//           isOnline: false,
//           lastSeen: new Date()
//         });
//         io.emit("user-status", { userId, isOnline: false });
//       }
//     });
//   });
// };

// export default socketSetup;




// import { Server, Socket } from "socket.io";
// import admin from "../config/firebase"

// import Message from "../models/message.model";
// import User from "../models/user.model";

// const onlineUsers = new Map();

// const socketSetup = (io: Server) => {

//   io.on("connection", (socket: Socket) => {

//     console.log("User Connected:", socket.id);

//     // JOIN
//     socket.on("join", async (userId: string) => {

//       onlineUsers.set(userId, socket.id);

//       await User.findByIdAndUpdate(userId, {
//         isOnline: true
//       });

//       io.emit(
//         "online-users",
//         Array.from(onlineUsers.keys())
//       );

//       console.log("ONLINE USERS:", onlineUsers);
//     });

//     // SEND MESSAGE
//     // socket.on("send-message", async (data) => {

//     //   try {

//     //     console.log("SOCKET DATA:", data);

//     //     const { sender, receiver, text } = data;

//     //     // VALIDATION
//     //     if (!sender || !receiver || !text) {

//     //       console.log("Missing fields");

//     //       return;
//     //     }

//     //     // SAVE MESSAGE
//     //     const newMessage = await Message.create({

//     //       sender,
//     //       receiver,
//     //       text,
//     //       seen: false
//     //     });

//     //     // POPULATE
//     //     const message = await Message.findById(
//     //       newMessage._id
//     //     )

//     //     .populate(
//     //       "sender",
//     //       "name email"
//     //     )

//     //     .populate(
//     //       "receiver",
//     //       "name email"
//     //     );

//     //     console.log("MESSAGE SAVED:", message);

//     //     // RECEIVER SOCKET
//     //     const receiverSocketId =
//     //       onlineUsers.get(receiver);

//     //     // SEND TO RECEIVER
//     //     if (receiverSocketId) {

//     //       io.to(receiverSocketId).emit(

//     //         "receive-message",

//     //         message
//     //       );
//     //     }

//     //     // SEND TO SENDER
//     //     socket.emit(

//     //       "receive-message",

//     //       message
//     //     );

//     //   } catch (error) {

//     //     console.log(
//     //       "SOCKET ERROR:",
//     //       error
//     //     );
//     //   }
//     // });

// //     socket.on("send-message", async (data) => {
// //   try {
// //     const { sender, receiver, text } = data;
// //     if (!sender || !receiver || !text) return;

// //     const newMessage = await Message.create({ sender, receiver, text, seen: false });

// //     const message = await Message.findById(newMessage._id)
// //       .populate("sender", "name email")
// //       .populate("receiver", "name email");

// //     // Receiver ka socket (tab open hai)
// //     const receiverSocketId = onlineUsers.get(receiver);
// //     if (receiverSocketId) {
// //       io.to(receiverSocketId).emit("receive-message", message);
// //     }

// //     socket.emit("receive-message", message);

// //     // ✅ FCM Push — tab closed ho tab bhi notification
// //     const receiverUser = await User.findById(receiver).select("fcmToken name");
// //     const senderUser = await User.findById(sender).select("name");

// //     if (receiverUser?.fcmToken) {
// //       try {
// //         await admin.messaging().send({
// //           token: receiverUser.fcmToken,
// //           notification: {
// //             title: senderUser?.name ?? "New Message",
// //             body: text,
// //           },
// //           data: {
// //             senderId: sender.toString(),
// //           },
// //           webpush: {
// //             notification: {
// //               icon: "/chat.png",
// //               tag: sender.toString(),
// //               // renotify: "true",  // same sender ki notification replace hogi
// //             },
// //             fcmOptions: {
// //               link: "/chat",
// //             },
// //           },
// //         });
// //         console.log("[FCM] Push sent to:", receiverUser.name);
// //       } catch (fcmErr) {
// //         console.error("[FCM] Send error:", fcmErr);
// //       }
// //     }

// //   } catch (error) {
// //     console.log("SOCKET ERROR:", error);
// //   }
// // });


// socket.on("send-message", async (data) => {
//   try {
//     const { sender, receiver, text } = data;
//     if (!sender || !receiver || !text) return;

//     const newMessage = await Message.create({ sender, receiver, text, seen: false });

//     const message = await Message.findById(newMessage._id)
//       .populate("sender", "name email")
//       .populate("receiver", "name email");

//     const receiverSocketId = onlineUsers.get(receiver);

//     if (receiverSocketId) {
//       // ✅ Online hai — socket se bhejo, FCM nahi
//       io.to(receiverSocketId).emit("receive-message", message);
//     } else {
//       // ✅ Offline hai — tabhi FCM push bhejo
//       const receiverUser = await User.findById(receiver).select("fcmToken name");
//       const senderUser = await User.findById(sender).select("name");

//       if (receiverUser?.fcmToken) {
//         try {
//           await admin.messaging().send({
//             token: receiverUser.fcmToken,
//             notification: {
//               title: senderUser?.name ?? "New Message",
//               body: text,
//             },
//             data: {
//               senderId: sender.toString(),
//             },
//             webpush: {
//               notification: {
//                 icon: "/chat.png",
//                 tag: sender.toString(),
//               },
//               fcmOptions: {
//                 link: "/chat",
//               },
//             },
//           });
//           console.log("[FCM] Push sent to:", receiverUser?.name);
//         } catch (fcmErr) {
//           console.error("[FCM] Send error:", fcmErr);
//         }
//       }
//     }

//     // Sender ko apna message wapas bhejo
//     socket.emit("receive-message", message);

//   } catch (error) {
//     console.log("SOCKET ERROR:", error);
//   }
// });

//     // MESSAGE SEEN
//     socket.on(

//       "message-seen",

//       async ({
//         senderId,
//         receiverId
//       }) => {

//         await Message.updateMany(

//           {
//             sender: senderId,
//             receiver: receiverId,
//             seen: false
//           },

//           {
//             seen: true
//           }
//         );

//         const senderSocketId =
//           onlineUsers.get(senderId);

//         if (senderSocketId) {

//           io.to(senderSocketId).emit(

//             "messages-seen",

//             { senderId }
//           );
//         }
//       }
//     );

//     // DISCONNECT
//     socket.on(

//       "disconnect",

//       async () => {

//         console.log(
//           "User Disconnected:",
//           socket.id
//         );

//         for (

//           const [key, value]

//           of onlineUsers.entries()

//         ) {

//           if (value === socket.id) {

//             onlineUsers.delete(key);

//             await User.findByIdAndUpdate(

//               key,

//               {
//                 isOnline: false,
//                 lastSeen: new Date()
//               }
//             );
//           }
//         }

//         io.emit(

//           "online-users",

//           Array.from(
//             onlineUsers.keys()
//           )
//         );
//       }
//     );
//   });
// };


// // import admin from "../lib/firebaseAdmin";


// // send-message event ke andar, message save karne ke baad:



// export default socketSetup;




// import { Server, Socket } from "socket.io";
// import admin from "../config/firebase";
// import Message from "../models/message.model";
// import User from "../models/user.model";

// const onlineUsers = new Map<string, string>(); // userId -> socketId

// const socketSetup = (io: Server) => {
//   io.on("connection", (socket: Socket) => {
//     console.log("User Connected:", socket.id);

//     // JOIN
//     socket.on("join", async (userId: string) => {
//       onlineUsers.set(userId, socket.id);

//       await User.findByIdAndUpdate(userId, { isOnline: true });

//       io.emit("online-users", Array.from(onlineUsers.keys()));
//       console.log("ONLINE USERS:", onlineUsers);
//     });

//     // SEND MESSAGE
//     socket.on("send-message", async (data) => {
//       try {
//         const { sender, receiver, text } = data;
//         if (!sender || !receiver || !text) return;

//         // ✅ FIX 1: Self-message block karo
//         if (sender === receiver) {
//           console.log("[Socket] Self-message blocked");
//           return;
//         }

//         const newMessage = await Message.create({
//           sender,
//           receiver,
//           text,
//           seen: false
//         });

//         const message = await Message.findById(newMessage._id)
//           .populate("sender", "name email")
//           .populate("receiver", "name email");

//         // ✅ FIX 2: Sirf sender ko apna message wapas bhejo (receiver ko nahi)
//         socket.emit("receive-message", message);

//         const receiverSocketId = onlineUsers.get(receiver);

//         if (receiverSocketId) {
//           // ✅ Receiver online hai — socket se bhejo
//           io.to(receiverSocketId).emit("receive-message", message);

//           // ✅ FIX 3: Online ho BUT alag tab mein ho —
//           // FCM bhi bhejo taaki notification aaye
//           const receiverUser = await User.findById(receiver).select("fcmToken name");
//           const senderUser = await User.findById(sender).select("name");

//           if (receiverUser?.fcmToken) {
//             try {
//               await admin.messaging().send({
//                 token: receiverUser.fcmToken,
//                 notification: {
//                   title: senderUser?.name ?? "New Message",
//                   body: text,
//                 },
//                 data: {
//                   senderId: sender.toString(),
//                 },
//                 webpush: {
//                   notification: {
//                     icon: "/chat.png",
//                     tag: sender.toString(),
//                   },
//                   fcmOptions: {
//                     link: "/chat",
//                   },
//                 },
//               });
//               console.log("[FCM] Push sent (online, different tab):", receiverUser.name);
//             } catch (fcmErr) {
//               console.error("[FCM] Send error:", fcmErr);
//             }
//           }
//         } else {
//           // ✅ Receiver offline hai — FCM push
//           const receiverUser = await User.findById(receiver).select("fcmToken name");
//           const senderUser = await User.findById(sender).select("name");

//           if (receiverUser?.fcmToken) {
//             try {
//               await admin.messaging().send({
//                 token: receiverUser.fcmToken,
//                 notification: {
//                   title: senderUser?.name ?? "New Message",
//                   body: text,
//                 },
//                 data: {
//                   senderId: sender.toString(),
//                 },
//                 webpush: {
//                   notification: {
//                     icon: "/chat.png",
//                     tag: sender.toString(),
//                   },
//                   fcmOptions: {
//                     link: "/chat",
//                   },
//                 },
//               });
//               console.log("[FCM] Push sent (offline):", receiverUser.name);
//             } catch (fcmErr) {
//               console.error("[FCM] Send error:", fcmErr);
//             }
//           }
//         }
//       } catch (error) {
//         console.log("SOCKET ERROR:", error);
//       }
//     });

//     // MESSAGE SEEN
//     socket.on("message-seen", async ({ senderId, receiverId }) => {
//       await Message.updateMany(
//         { sender: senderId, receiver: receiverId, seen: false },
//         { seen: true }
//       );

//       const senderSocketId = onlineUsers.get(senderId);
//       if (senderSocketId) {
//         io.to(senderSocketId).emit("messages-seen", { senderId });
//       }
//     });

//     // DISCONNECT
//     socket.on("disconnect", async () => {
//       console.log("User Disconnected:", socket.id);

//       for (const [key, value] of onlineUsers.entries()) {
//         if (value === socket.id) {
//           onlineUsers.delete(key);
//           await User.findByIdAndUpdate(key, {
//             isOnline: false,
//             lastSeen: new Date()
//           });
//         }
//       }

//       io.emit("online-users", Array.from(onlineUsers.keys()));
//     });
//   });
// };

// export default socketSetup;



import { Server, Socket } from "socket.io";
import Message from "../models/message.model";
import User from "../models/user.model";
import admin from "../config/firebase";

const onlineUsers = new Map<string, string>(); // userId -> socketId

const socketSetup = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User Connected:", socket.id);

    // JOIN — user apne userId room mein enter kare
    socket.on("join", async (userId: string) => {
      socket.join(`user_${userId}`);
      onlineUsers.set(userId, socket.id);

      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("online-users", Array.from(onlineUsers.keys()));
      console.log("ONLINE USERS:", onlineUsers);
    });

    // MESSAGE SEEN
    socket.on("message-seen", async ({ senderId, receiverId }) => {
      await Message.updateMany(
        { sender: senderId, receiver: receiverId, seen: false },
        { seen: true }
      );

      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messages-seen", { senderId });
      }
    });

    // DISCONNECT
    socket.on("disconnect", async () => {
      console.log("User Disconnected:", socket.id);

      for (const [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          await User.findByIdAndUpdate(key, {
            isOnline: false,
            lastSeen: new Date(),
          });
        }
      }

      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });
};

export default socketSetup;
