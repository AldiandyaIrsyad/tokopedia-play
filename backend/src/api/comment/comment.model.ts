import mongoose, { Document, Schema, Model, Connection } from 'mongoose';

import { IUser } from '../user/user.model';
import { IVideo } from '../video/video.model';

export interface IComment extends Document {
  text: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  user?: IUser;
  video?: IVideo;
}

export class CommentModel {
  private model: Model<IComment>;
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
    this.model = defineModel(connection);
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
      { $push: { comments: comment._id }, $slice: { comments: -30 } }
    );

    await UserModel.updateOne(
      { _id: comment.user },
      { $push: { comments: comment._id }, $slice: { comments: -30 } }
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
