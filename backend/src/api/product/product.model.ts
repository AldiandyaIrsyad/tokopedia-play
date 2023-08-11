import mongoose, { Document, Schema, Model, Connection } from 'mongoose';

import { IUser } from '../user/user.model';
import { IVideo } from '../video/video.model';

export interface IProduct extends Document {
  title: string;
  url: string;
  thumbnail_url: string;
  createdAt?: Date;
  user?: IUser;
  video?: IVideo;
}

export interface IProductModel {
  create(product: IProduct): Promise<IProduct>;
  getById(id: string): Promise<IProduct | null>;
  getAll(): Promise<IProduct[]>;
  getProductsByVideoId(videoId: string): Promise<IProduct[]>;
  getProductsByUserId(userId: string): Promise<IProduct[]>;
  searchProductsByTitle(title: string): Promise<IProduct[]>;
}

export class ProductModel implements IProductModel {
  public model: Model<IProduct>;

  constructor(connection: Connection) {
    this.model = defineModel(connection);

    // bind
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getProductsByVideoId = this.getProductsByVideoId.bind(this);
    this.getProductsByUserId = this.getProductsByUserId.bind(this);
  }

  public async create(product: IProduct): Promise<IProduct> {
    return this.model.create(product);
  }

  public async getById(id: string): Promise<IProduct | null> {
    return this.model.findById(id).populate('user video');
  }

  public async getAll(): Promise<IProduct[]> {
    return this.model.find();
  }

  public async getProductsByVideoId(videoId: string): Promise<IProduct[]> {
    return this.model.find({ video: videoId });
  }

  public async getProductsByUserId(userId: string): Promise<IProduct[]> {
    return this.model.find({ user: userId });
  }

  public async searchProductsByTitle(title: string): Promise<IProduct[]> {
    return this.model
      .find({ $text: { $search: title } })
      .populate('user video');
  }
}

const defineModel = (connection: Connection): Model<IProduct> => {
  const ProductSchema = new Schema<IProduct>(
    {
      title: { type: String, required: true },
      url: {
        type: String,
        required: true,
        validate: {
          validator: (v: string) => {
            // verify if url is a valid url
            return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
              v
            );
          },
        },
      },
      thumbnail_url: {
        type: String,
        required: true,
        validate: {
          validator: (v: string) => {
            return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(v);
          },
        },
      },
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    },
    {
      timestamps: {
        createdAt: 'createdAt',
      },
    }
  );

  ProductSchema.index({ title: 'text' });

  ProductSchema.pre('save', async function (next) {
    const product = this as IProduct;

    const UserModel = mongoose.model<IUser>('User');
    const VideoModel = mongoose.model<IVideo>('Video');

    await VideoModel.updateOne(
      { _id: product.video },
      { $push: { products: product._id } },
      { $slice: { products: -30 } }
    );

    await UserModel.updateOne(
      { _id: product.user },
      { $push: { products: product._id } },
      { $slice: { products: -30 } }
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
