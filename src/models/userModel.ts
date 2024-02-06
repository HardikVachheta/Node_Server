import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  status: string
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // minlength: 6,
  },
  status:{
    type:String,
    default:'online'
  }
});

const UserModel = model<IUser>("Users", userSchema);

export default UserModel;
