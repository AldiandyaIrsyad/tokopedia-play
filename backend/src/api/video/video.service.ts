// import jwt from 'jsonwebtoken';

import { IVideo, IVideoModel } from './video.model';
import { IUser, IUserModel } from '../user/user.model';
import { IUserService } from '../user';
import jwt from 'jsonwebtoken';

export interface IVideoService {
  create: (title: string, thumbnail: string, token: string) => Promise<any>;
  getAll: () => Promise<any>;
  getById: (id: string) => Promise<any>;
  getVideosByUserId: (id: string) => Promise<any>;
}

export class VideoService implements IVideoService {
  private readonly videoModel: IVideoModel;
  private readonly userModel: IUserModel;

  constructor(videoModel: IVideoModel, userModel: IUserModel) {
    this.videoModel = videoModel;
    this.userModel = userModel;
  }

  public async create(
    title: string,
    thumbnail: string,
    token: string
  ): Promise<any> {
    console.log('entering service');
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const tokenString = JSON.stringify(decoded);
    const tokenObject = JSON.parse(tokenString);
    const userID = tokenObject.id;
    console.log('done parsing token: ', userID);

    const user = await this.userModel.getById(userID);

    console.log('user: ', user);
    if (!user) {
      throw new Error('User not found');
    }

    const video = {
      title,
      thumbnail,
      user: user._id.toString(),
      views: 0,
    } as IVideo;

    console.log('done creating video: ', video);

    const newVideo = await this.videoModel.create(video);
    console.log('done creating video: ', newVideo);

    return newVideo;
  }

  public async getAll(): Promise<any> {
    const videos = await this.videoModel.getAll();
    return videos;
  }

  public async getById(id: string): Promise<any> {
    const video = await this.videoModel.getById(id);
    if (!video) {
      throw new Error('Video not found');
    }
    return video;
  }

  public async getVideosByUserId(id: string): Promise<any> {
    const videos = await this.videoModel.getVideosByUserId(id);
    if (!videos) {
      throw new Error('Videos not found');
    }
    return videos;
  }
}
