import { useState, useEffect } from 'react';
import { useAxios } from './useAxios';

interface IVideo extends Document {
  title: string;
  thumbnail: string;
  url: string;
  views?: number;
  createdAt?: Date;
  user?: any;
  comments?: any;
  products?: any;
}
export const useVideo = (id: string) => {
  const axios = useAxios();
  const [video, setVideo] = useState<IVideo>({
    title: '',
    thumbnail: '',
    url: '',
    views: 0,
    createdAt: new Date(),
    user: {},
    comments: [],
    products: [],
  } as IVideo);

  const getVideo = async () => {
    const { data } = await axios.get(`/api/video/${id}`);
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
    const youtubeId = data.url.match(regex)[0].split('=')[1];
    data.url = `https://www.youtube.com/embed/${youtubeId}`;
    setVideo(data);
  };

  useEffect(() => {
    getVideo();
  }, []);

  return video;
};
