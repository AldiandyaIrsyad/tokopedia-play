import { useAxios } from '../hooks';

import { useState, useEffect } from 'react';
// import Link
import { Link } from 'react-router-dom';
import Header from '../components/Header';
// example
// <Link to={`/video/${video.id}`}>

function Video(video: any) {
  return (
    <Link to={`/video/${video._id}`}>
      <div className="w-64 bg-neutral-600 rounded-md ">
        <img src={video.thumbnail} alt="" />
        <div className="p-2">
          <div>{video.title}</div>

          <div className="text-neutral-300">{video.user.username}</div>
        </div>
      </div>
    </Link>
  );
}
export default function index() {
  const axios = useAxios();

  const [videos, setVideos] = useState([]);

  async function getVideos() {
    const { data } = await axios.get('/api/video');
    setVideos(data);
  }

  useEffect(() => {
    getVideos();
  }, []);

  return (
    <div className="">
      <div className="flex justify-between">
        <Header />
      </div>
      <div className="debug p-4 flex flex-wrap gap-5 ">
        {/* < */}
        {videos.map((video: any) => (
          <Video key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
}
