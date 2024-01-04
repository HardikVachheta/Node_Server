import mongoose, { Document, Schema, Types } from "mongoose";

interface IMessage extends Document {
  message: {
    text: string;
  };
  users: Types.Array<any>; // Adjust the type accordingly
  sender: Types.ObjectId;
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>(
  {
    message: {
      text: { type: String, required: true },
    },
    users: [{}], // Adjust the type accordingly
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model<IMessage>("Messages", MessageSchema);

export default MessageModel;
