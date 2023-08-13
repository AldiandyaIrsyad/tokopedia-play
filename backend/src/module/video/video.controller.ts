import { IVideoService } from './video.service';

import { Request, Response } from 'express';

import { getErrorMessage } from '../../helpers/getErrorMessage';
export interface IVideoController {
  getAllVideos(req: Request, res: Response): Promise<void>;
  getVideoById(req: Request, res: Response): Promise<void>;
  createVideo(req: Request, res: Response): Promise<void>;
  getVideosByUserId(req: Request, res: Response): Promise<void>;
}

export class VideoController implements IVideoController {
  private readonly videoService: IVideoService;

  constructor(videoService: IVideoService) {
    this.videoService = videoService;

    // bind
    this.getAllVideos = this.getAllVideos.bind(this);
    this.getVideoById = this.getVideoById.bind(this);
    this.createVideo = this.createVideo.bind(this);
    this.getVideosByUserId = this.getVideosByUserId.bind(this);
  }

  public async getAllVideos(req: Request, res: Response): Promise<void> {
    try {
      const { video_title } = req.query;
      const videos = await this.videoService.getAll(video_title as string);
      res.status(200).json(videos);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  public async getVideoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const video = await this.videoService.getById(id);
      res.status(200).json(video);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  public async createVideo(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.cookies;

      const { title, thumbnail, url } = req.body;
      const video = await this.videoService.create(
        title,
        thumbnail,
        token,
        url
      );
      res.status(200).json(video);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  public async getVideosByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const videos = await this.videoService.getVideosByUserId(id);
      res.status(200).json(videos);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
