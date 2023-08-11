import { getUserIdFromToken } from '../../helpers/getUserIdFromToken';

import { IComment, ICommentModel } from './comment.model';
import { IUserModel } from '../user';
import { IVideoModel } from '../video';

export interface ICommentService {
  create(text: string, token: string, videoId: string): Promise<IComment>;
  getAll(): Promise<IComment[]>;
  getById(id: string): Promise<IComment>;
  getCommentsByVideoId(videoId: string): Promise<IComment[]>;
  getCommentsByUserId(userId: string): Promise<IComment[]>;
}

export class CommentService implements ICommentService {
  private readonly commentModel: ICommentModel;
  private readonly userModel: IUserModel;
  private readonly videoModel: IVideoModel;

  constructor(
    commentModel: ICommentModel,
    userModel: IUserModel,
    videoModel: IVideoModel
  ) {
    this.commentModel = commentModel;
    this.userModel = userModel;
    this.videoModel = videoModel;
  }

  public async create(
    text: string,
    token: string,
    videoId: string
  ): Promise<IComment> {
    const userId = getUserIdFromToken(token);

    const user = await this.userModel.getById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const video = await this.videoModel.getById(videoId);

    if (!video) {
      throw new Error('Video not found');
    }

    const comment = await this.commentModel.create({
      text,
      user,
      video,
    } as IComment);

    return comment;
  }

  public async getAll(): Promise<IComment[]> {
    const comments = await this.commentModel.getAll();

    return comments;
  }

  public async getById(_id: string): Promise<IComment> {
    const comment = await this.commentModel.getById(_id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    return comment;
  }

  public async getCommentsByVideoId(videoId: string): Promise<IComment[]> {
    const comments = await this.commentModel.getCommentsByVideoId(videoId);

    return comments;
  }

  public async getCommentsByUserId(userId: string): Promise<IComment[]> {

    const comments = await this.commentModel.getCommentsByUserId(userId);

    return comments;
  }
}
