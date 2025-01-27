import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";

// Kullanıcı arayüzü güncellendi
export interface IUser extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  gender: string;
  nationality: string;
  bio: string;
  instagram: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    gender: { type: String, required: false },
    nationality: { type: String, required: false },
    bio: { type: String, required: false },
    instagram: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
