import { useAxios } from '@/hooks';

import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

export default function index() {
  const axios = useAxios();

  const [videos, setVideos] = useState([]);

  const location = useLocation();

  async function getVideos() {
    const { data } = await axios.get(`/api/video${location.search}`);
    setVideos(data);
  }


  useEffect(() => {
    getVideos();
  }, [location.search]);

  return (
    <div className="flex-1">
      <div className="flex flex-wrap gap-5 py-10 px-5">
        {videos.map((video: any) => (
          <Video key={video._id} {...video} />
        ))}
      </div>
    </div>
  );
}

function Video(video: any) {
  return (
    <Link to={`/video/${video._id}`}>
      <div className="w-64 h-72  flex flex-col shadow-md rounded-md  ">
        <div>
          <img src={video.thumbnail} alt="" />
        </div>
        <div className="p-2 flex flex-1 flex-col justify-between ">
          <div>
            {video.title.substring(0, 40) +
              (video.title.length > 40 ? '...' : '')}
          </div>

          <div className="text-neutral-500 flex justify-between">
            <div>{video.user.username}</div>
            <div>{video.views} Views</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
