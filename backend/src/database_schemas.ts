import { model, Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";


export enum VideoVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

interface User extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Video extends Document {
  title: string;
  description: string;
  url: string;
  visibility: VideoVisibility;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<User> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre<User>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error: any) {
    return next(error);
  }
});

const VideoSchema: Schema<Video> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    visibility: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", UserSchema);
export const VideoModel = model<Video>("Video", VideoSchema);
