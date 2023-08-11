import mongoose, { Document, Schema, Model, Connection } from 'mongoose';

import { IUser } from '../user/user.model';
import { IVideo } from '../video/video.model';

export interface IProduct extends Document {
  title: string;
  timestamp: Date;
  user?: IUser;
  video?: IVideo;
}

export interface IProductModel {
  create(product: IProduct): Promise<IProduct>;
  findById(id: string): Promise<IProduct | null>;
}

export class ProductModel implements IProductModel {
  public model: Model<IProduct>;
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
    this.model = defineModel(connection);
  }

  public async create(product: IProduct): Promise<IProduct> {
    return this.model.create(product);
  }

  public async findById(id: string): Promise<IProduct | null> {
    return this.model.findById(id).populate('user').populate('video');
  }

  public async getAll(): Promise<IProduct[]> {
    return this.model.find();
  }
}

const defineModel = (connection: Connection): Model<IProduct> => {
  const ProductSchema = new Schema<IProduct>(
    {
      title: { type: String, required: true },
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    },
    { timestamps: true }
  );

  ProductSchema.index({ title: 'text' });

  ProductSchema.pre('save', async function (next) {
    const product = this as IProduct;

    const UserModel = mongoose.model<IUser>('User');
    const VideoModel = mongoose.model<IVideo>('Video');

    await VideoModel.updateOne(
      { _id: product.video },
      { $push: { products: product._id }, $slice: { products: -30 } }
    );

    await UserModel.updateOne(
      { _id: product.user },
      { $push: { products: product._id }, $slice: { products: -30 } }
    );

    next();
  });

  ProductSchema.pre(/^remove$/, async function (next) {
    const product = this as IProduct;

    const UserModel = mongoose.model<IUser>('User');
    const VideoModel = mongoose.model<IVideo>('Video');

    await VideoModel.updateOne(
      { _id: product.video },
      { $pull: { products: product._id } }
    );

    await UserModel.updateOne(
      { _id: product.user },
      { $pull: { products: product._id } }
    );

    next();
  });

  return connection.model<IProduct>('Product', ProductSchema);
};
