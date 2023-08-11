import mongoose, { Document, Schema, Model, Connection } from 'mongoose';

import { IUser } from '../user/user.model';
import { IVideo } from '../video/video.model';

export interface IComment extends Document {
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  user?: IUser;
  video?: IVideo;
}

export interface ICommentModel {
  create(comment: IComment): Promise<IComment>;
  getById(id: string): Promise<IComment | null>;
  getAll(): Promise<IComment[]>;
  getCommentsByVideoId(videoId: string): Promise<IComment[]>;
  getCommentsByUserId(userId: string): Promise<IComment[]>;
}

export class CommentModel implements ICommentModel {
  private model: Model<IComment>;
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
    this.model = defineModel(connection);

    // bind
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getCommentsByVideoId = this.getCommentsByVideoId.bind(this);
    this.getCommentsByUserId = this.getCommentsByUserId.bind(this);
  }

  async create(comment: IComment): Promise<IComment> {
    return this.model.create(comment);
  }

  async getById(id: string): Promise<IComment | null> {
    return this.model.findById(id).populate('user video');
  }

  async getAll(): Promise<IComment[]> {
    return this.model.find();
  }

  async getCommentsByVideoId(videoId: string): Promise<IComment[]> {
    return this.model.find({ video: videoId });
  }

  async getCommentsByUserId(userId: string): Promise<IComment[]> {
    return this.model.find({ user: userId });
  }
}

const defineModel = (connection: Connection): Model<IComment> => {
  const CommentSchema = new Schema<IComment>(
    {
      text: { type: String, required: true },
      likes: { type: Number, default: 0 },
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    },
    { timestamps: true }
  );

  CommentSchema.index({ text: 'text' });

  CommentSchema.pre('save', async function (next) {
    const comment = this;

    const UserModel = mongoose.model<IUser>('User');
    const VideoModel = mongoose.model<IVideo>('Video');

    await VideoModel.updateOne(
      { _id: comment.video },
      { $push: { comments: comment._id } },
      { $slice: { comments: -30 } }
    );

    await UserModel.updateOne(
      { _id: comment.user },
      { $push: { comments: comment._id } },
      { $slice: { comments: -30 } }
    );

    next();
  });

  CommentSchema.pre(/^remove$/, async function (next) {
    const comment = this as IComment;

    const UserModel = mongoose.model<IUser>('User');
    const VideoModel = mongoose.model<IVideo>('Video');

    await VideoModel.updateOne(
      { _id: comment.video },
      { $pull: { comments: comment._id } }
    );

    await UserModel.updateOne(
      { _id: comment.user },
      { $pull: { comments: comment._id } }
    );

    next();
  });

  return connection.model<IComment>('Comment', CommentSchema);
};
