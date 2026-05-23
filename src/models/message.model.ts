import mongoose, {

  Document,

  Schema

} from "mongoose";

export interface IMessage
  extends Document {

  sender:
    mongoose.Types.ObjectId;

  receiver:
    mongoose.Types.ObjectId;

  text: string;

  seen: boolean;
}

const messageSchema =
  new Schema<IMessage>(

    {

      sender: {

        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true
      },

      receiver: {

        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true
      },

      text: {

        type: String,

        required: true
      },

      seen: {

        type: Boolean,

        default: false
      }

    },

    {

      timestamps: true
    }
  );

const Message =
  mongoose.model<IMessage>(

    "Message",

    messageSchema
  );

export default Message;