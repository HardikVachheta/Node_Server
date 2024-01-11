import mongoose, { Schema, model, Document, Types } from "mongoose";

interface IMessage extends Document {
  message: {
    text: string;
  };
  users: Array<string>; // You might want to replace 'any' with a more specific type
  sender: string;
}

const messageSchema = new Schema<IMessage>(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = model<IMessage>("Messages", messageSchema);

export default MessageModel;
