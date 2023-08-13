import { Document, Schema, Model, Connection } from 'mongoose';

import { IVideo } from '../video/video.model';
import { IComment } from '../comment/comment.model';
import { IProduct } from '../product/product.model';

import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  role: 'admin' | 'user';
  description: string;
  password?: string;
  videos?: IVideo[];
  comments?: IComment[];
  products?: IProduct[];
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserModel {
  create(user: IUser): Promise<IUser>;
  login(email: string, password: string): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser | null>;
  createMany(users: IUser[]): Promise<IUser[]>;
}

export class UserModel {
  private model: Model<IUser>;

  constructor(connection: Connection) {
    this.model = defineModel(connection);

    // bind
    this.create = this.create.bind(this);
    this.login = this.login.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.createMany = this.createMany.bind(this);
  }

  public async create(user: IUser): Promise<IUser> {
    return await this.model.create(user);
  }

  // insertMany
  public async createMany(users: IUser[]): Promise<IUser[]> {
    return await this.model.insertMany(users);
  }

  public async login(email: string, password: string): Promise<IUser | null> {
    const user = await this.model.findOne({ email }).select('+password');

    if (!user) return null;
    const isMatch = await user.comparePassword(password);

    if (!isMatch) return null;

    delete user.password;
    return user;
  }

  public async getAll(): Promise<IUser[]> {
    return await this.model.find();
  }

  public async getById(id: string): Promise<IUser | null> {
    return await this.model.findById(id).populate('videos comments products');
  }
}

const defineModel = (connection: Connection): Model<IUser> => {
  const UserSchema = new Schema<IUser>({
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^[a-zA-Z0-9]+$/.test(v); // only letters and numbers
        },
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v); // email format
        },
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      // // uncomment for password validation
      // validate: {
      //   validator: function (v: string) {
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v); // 8 chars, 1 uppercase, 1 lowercase, 1 number
      //   }
      // }
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    description: {
      type: String,
      default: '',
    },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  });

  UserSchema.index({ email: 1, username: 1 }, { unique: true });

  UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  });

  // saveMany
  UserSchema.pre<IUser[]>('insertMany', async function (next) {
    const users = this as IUser[];

    for (const user of users) {
      if (!user.isModified('password')) continue;

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password!, salt);
    }

    next();
  });

  UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password!);
  };

  return connection.model<IUser>('User', UserSchema);
};
