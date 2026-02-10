import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  authUserId: string; // Better Auth user id
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
