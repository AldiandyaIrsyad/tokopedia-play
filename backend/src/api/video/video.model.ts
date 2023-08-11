import { Document, Schema, Model, Connection } from 'mongoose';

import { IUser } from '../user/user.model';
import { IComment } from '../comment/comment.model';
import { IProduct } from '../product/product.model';

export interface IVideo extends Document {
  title: string;
  thumbnail: string;
  views?: number;
  createdAt?: Date;
  user?: IUser;
  comments?: IComment[];
  products?: IProduct[];
}

export interface IVideoModel {
  create(video: IVideo): Promise<IVideo>;
  getById(id: string): Promise<IVideo | null>;
  getAll(): Promise<IVideo[]>;
  getVideosByUserId(userId: string): Promise<IVideo[]>;
}

export class VideoModel implements IVideoModel {
  private model: Model<IVideo>;

  constructor(mongoose: Connection) {
    this.model = defineModel(mongoose);
  }

  public create(video: IVideo): Promise<IVideo> {
    return this.model.create(video);
  }

  public getById(id: string): Promise<IVideo | null> {
    return this.model
      .findByIdAndUpdate({ _id: id }, { $inc: { views: 1 } })
      .populate('user comments products');
  }

  public getAll(): Promise<IVideo[]> {
    return this.model.find();
  }

  public getVideosByUserId(userId: string): Promise<IVideo[]> {
    return this.model.find({ user: userId });
  }
}

const defineModel = (connection: Connection): Model<IVideo> => {
  const VideoSchema = new Schema<IVideo>(
    {
      title: { type: String, required: true },
      thumbnail: { type: String, required: true },
      views: { type: Number, default: 0 },
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
      products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    },
    {
      timestamps: {
        createdAt: 'createdAt',
      },
    }
  );

  VideoSchema.index({ title: 'text' });

  VideoSchema.pre('save', async function (next) {
    const video = this;

    const UserModel = connection.model<IUser>('User');
    await UserModel.updateOne(
      { _id: video.user },
      { $push: { videos: video._id } },
      { $slice: { videos: -30 } }
    );

    next();
  });

  VideoSchema.pre(/^remove$/, async function (next) {
    const video = this as IVideo;

    const UserModel = connection.model<IUser>('User');
    await UserModel.updateOne(
      { _id: video.user },
      { $pull: { videos: video._id } }
    );

    next();
  });

  return connection.model<IVideo>('Video', VideoSchema);
};
