import { selectFields } from 'express-validator/src/select-fields';
import mongoose from 'mongoose';
import { PasswordManager } from '../services/password';

export interface UserPayload {
  email: string;
  password: string;
}
interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build: (attrs: UserAttrs) => UserDoc;
}

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

userSchema.pre<UserDoc>('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.password);
    this.password = hashed;
  }
  done();
});

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
