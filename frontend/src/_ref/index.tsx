import { useAxios } from '../hooks';
import { useState, useEffect } from 'react';
export default function index() {
  const axios = useAxios();

  const [videos, setVideos] = useState([]);

  async function getVideo() {
    const res = await axios.get('/api/video');
    setVideos(res.data);
  }

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div>
      <pre>
        <code>{JSON.stringify(videos, null, 2)}</code>
      </pre>
    </div>
  );
}
