import { useAxios } from '.';
import { useState, useEffect } from 'react';

export default function useUsername() {
  const [username, setUsername] = useState<String | undefined>('');
  const axios = useAxios();

  async function getUsername() {
    try {
      const res = await axios.get('/api/user/me');
      console.log(res);
      setUsername(res.data.username);
    } catch {
      setUsername(undefined);
    }
  }

  useEffect(() => {
    getUsername();
  }, []);

  return username;
}
