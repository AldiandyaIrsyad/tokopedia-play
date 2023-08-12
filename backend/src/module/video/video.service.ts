import { IVideo, IVideoModel } from './video.model';
import { IUserModel } from '../user/user.model';

import { getUserIdFromToken } from '../../helpers/getUserIdFromToken';

export interface IVideoService {
  create: (
    title: string,
    thumbnail: string,
    token: string,
    url: string
  ) => Promise<IVideo>;
  getAll: (video_title?: string | null) => Promise<IVideo[]>;
  getById: (id: string) => Promise<IVideo>;
  getVideosByUserId: (id: string) => Promise<IVideo[]>;
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
    token: string,
    url: string
  ): Promise<IVideo> {
    const userID = getUserIdFromToken(token);
    const user = await this.userModel.getById(userID);

    if (!user) {
      throw new Error('User not found');
    }

    const video = {
      title,
      thumbnail,
      user: user._id.toString(),
      url,
    } as IVideo;

    return await this.videoModel.create(video);
  }

  public async getAll(video_title?: string | null): Promise<IVideo[]> {
    if (video_title != null) {
      console.log('this ran');
      return await this.videoModel.getVideosByTitle(video_title as string);
    }
    return await this.videoModel.getAll();
  }

  public async getById(id: string): Promise<IVideo> {
    const video = await this.videoModel.getById(id);
    if (!video) {
      throw new Error('Video not found');
    }
    return video;
  }

  public async getVideosByUserId(id: string): Promise<IVideo[]> {
    const videos = await this.videoModel.getVideosByUserId(id);
    if (!videos) {
      throw new Error('Videos not found');
    }
    return videos;
  }
}
