import { getUserIdFromToken } from '../../helpers/getUserIdFromToken';

import { IComment, ICommentModel } from './comment.model';
import { IUserModel } from '../user';
import { IVideoModel } from '../video';
import { ICommentSocket } from './comment.socket';

export interface ICommentService {
  create(text: string, token: string, videoId: string): Promise<IComment>;
  getAll(): Promise<IComment[]>;
  getById(id: string): Promise<IComment>;
  getCommentsByVideoId(videoId: string): Promise<IComment[]>;
  getCommentsByUserId(userId: string): Promise<IComment[]>;
}

export class CommentService implements ICommentService {
  constructor(
    private readonly commentModel: ICommentModel,
    private readonly userModel: IUserModel,
    private readonly videoModel: IVideoModel,
    private readonly commentSocket: ICommentSocket
  ) {}

  create = async (
    text: string,
    token: string,
    videoId: string
  ): Promise<IComment> => {
    console.log('createservice  ');
    const userId = getUserIdFromToken(token);
    console.log('createservice  ');

    const user = await this.userModel.getById(userId);
    console.log('createservice  ');

    if (!user) {
      throw new Error('User not found');
    }
    console.log('createservice  4');

    const video = await this.videoModel.getById(videoId);
    console.log('createservice  5');

    if (!video) {
      throw new Error('Video not found');
    }
    console.log(text);

    const comment = await this.commentModel.create({
      text,
      user,
      video,
    } as IComment);

    console.log('createservice  7');

    this.commentSocket.addComment(comment);

    return comment;
  };

  getAll = async (): Promise<IComment[]> => {
    return await this.commentModel.getAll();
  };

  getById = async (_id: string): Promise<IComment> => {
    const comment = await this.commentModel.getById(_id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    return comment;
  };

  getCommentsByVideoId = async (videoId: string): Promise<IComment[]> => {
    return await this.commentModel.getCommentsByVideoId(videoId);
  };

  getCommentsByUserId = async (userId: string): Promise<IComment[]> => {
    return await this.commentModel.getCommentsByUserId(userId);
  };
}
