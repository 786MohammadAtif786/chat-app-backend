// import { Response } from "express";

// import Message from "../models/message.model";
// import { AuthRequest } from "../middleware/auth.middleware";

// // // send message
// // export const sendMessage = async (
// //   req: AuthRequest,
// //   res: Response
// // ): Promise<void> => {
// //   try {
// //     const { receiverId, text } = req.body;

// //     const message = await Message.create({
// //       sender: req.user._id,
// //       receiver: receiverId,
// //       text
// //     });

// //     res.status(201).json({
// //       success: true,
// //       message
// //     });
// //   } catch (error) {
// //     console.log(error);

// //     res.status(500).json({
// //       success: false,
// //       message: "Server Error"
// //     });
// //   }
// // };

// // get chats between two users
// export const getMessages = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const receiverId = req.params.id;

//     // const messages = await Message.find({
//     //   $or: [
//     //     {
//     //       sender: req.user._id,
//     //       receiver: receiverId
//     //     },
//     //     {
//     //       sender: receiverId,
//     //       receiver: req.user._id
//     //     }
//     //   ]
//     // })
//     //   .sort({ createdAt: 1 });

//     const messages = await Message.find({
//         $or: [
//           {
//             sender: req.user._id,
//             receiver: receiverId
//           },
//           {
//             sender: receiverId,
//             receiver: req.user._id
//           }
//         ]
//       })
//       .populate("sender", "name email")
//       .populate("receiver", "name email")
//       .sort({ createdAt: 1 });

//     res.status(200).json({
//       success: true,
//       messages
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error"
//     });
//   }
// };



// // messageController.ts
// // import { Response } from "express";
// // import Message from "../models/message.model";
// import User from "../models/user.model";
// // import { AuthRequest } from "../middleware/auth.middleware";
// import admin from "../config/firebase";
// import { io } from "../server";

// export const sendMessage = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { receiverId, text } = req.body;
//     const senderId = req.user._id.toString();

//     // ✅ Self-message check
//     if (senderId === receiverId) {
//       res.status(400).json({
//         success: false,
//         message: "Khud ko message nahi kar sakte"
//       });
//       return;
//     }

//     const message = await Message.create({
//       sender: senderId,
//       receiver: receiverId,
//       text
//     });

//     // ✅ Socket: Sirf receiver ke room mein emit karo
//     io.to(`user_${receiverId}`).emit("new-message", {
//       message,
//       senderId,
//       senderName: req.user.name
//     });

//     // ✅ FCM Push Notification: Sirf receiver ko
//     const receiver = await User.findById(receiverId);
//     if (receiver?.fcmToken) {
//       await admin.messaging().send({
//         token: receiver.fcmToken,
//         notification: {
//           title: req.user.name,   // sender ka naam
//           body: text
//         },
//         data: {
//           senderId: senderId,
//           senderName: req.user.name
//         }
//       });
//       console.log("[FCM] Notification sent to receiver");
//     }

//     res.status(201).json({ success: true, message });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };



import { Response } from "express";

import Message from "../models/message.model";
import { AuthRequest } from "../middleware/auth.middleware";

// // send message
// export const sendMessage = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { receiverId, text } = req.body;

//     const message = await Message.create({
//       sender: req.user._id,
//       receiver: receiverId,
//       text
//     });

//     res.status(201).json({
//       success: true,
//       message
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error"
//     });
//   }
// };

// get chats between two users
export const getMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const receiverId = req.params.id;

    // const messages = await Message.find({
    //   $or: [
    //     {
    //       sender: req.user._id,
    //       receiver: receiverId
    //     },
    //     {
    //       sender: receiverId,
    //       receiver: req.user._id
    //     }
    //   ]
    // })
    //   .sort({ createdAt: 1 });

    const messages = await Message.find({
        $or: [
          {
            sender: req.user._id,
            receiver: receiverId
          },
          {
            sender: receiverId,
            receiver: req.user._id
          }
        ]
      })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};



// messageController.ts
// import { Response } from "express";
// import Message from "../models/message.model";
import User from "../models/user.model";
// import { AuthRequest } from "../middleware/auth.middleware";
import admin from "../config/firebase";
import { io } from "../server";

export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id.toString();

    // ✅ Self-message check
    if (senderId === receiverId) {
      res.status(400).json({
        success: false,
        message: "Khud ko message nahi kar sakte"
      });
      return;
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text
    });

    // ✅ Socket: Sirf receiver ke room mein emit karo
    io.to(`user_${receiverId}`).emit("new-message", {
      message,
      senderId,
      senderName: req.user.name
    });

    // ✅ FCM Push Notification: Sirf receiver ko
    const receiver = await User.findById(receiverId);
    if (receiver?.fcmToken) {
      await admin.messaging().send({
        token: receiver.fcmToken,
        notification: {
          title: req.user.name,   // sender ka naam
          body: text
        },
        data: {
          senderId: senderId,
          senderName: req.user.name
        }
      });
      console.log("[FCM] Notification sent to receiver");
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};