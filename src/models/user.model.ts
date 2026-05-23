import mongoose, {

  Document,

  Schema

} from "mongoose";

export interface IUser
  extends Document {

  name: string;

  email: string;

  password: string;

  isOnline: boolean;

  lastSeen: Date;
  fcmToken: string;
}

const userSchema =
  new Schema<IUser>(

    {

      name: {

        type: String,

        required: true
      },

      email: {

        type: String,

        required: true,

        unique: true
      },

      password: {

        type: String,

        required: true
      },

      isOnline: {

        type: Boolean,

        default: false
      },

      lastSeen: {

        type: Date,

        default: Date.now
      },
        fcmToken: { type: String, default: null }, 

    },

    {

      timestamps: true
    }
  );

const User =
  mongoose.model<IUser>(

    "User",

    userSchema
  );

export default User;