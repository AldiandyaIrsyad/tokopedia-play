import { Outlet } from 'react-router-dom';

// import something to check current url
import { useLocation, Link } from 'react-router-dom';

import tokopedia from '@/assets/tokopedia.svg';

export default function _layout() {
  const location = useLocation();
  // get current url
  const currentUrl = location.pathname;

  const linkUrl = currentUrl === '/login' ? '/register' : '/login';
  const linkText = currentUrl === '/login' ? 'Daftar' : 'Masuk';
  const title = currentUrl === '/login' ? 'Masuk' : 'Daftar';

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-neutral-50 ">
      <div className="w-screen sm:max-w-xl  bg-white shadow-md pt-12 px-8 pb-10 ">
        <Link to="/">
          <div className="w-full h-14 mb-6 flex justify-center">
            <img src={tokopedia} alt="" />
          </div>
        </Link>

        <div className="flex items-end justify-between mb-12 ">
          <div>
            <h2 className="text-2xl font-bold uppercase">{title}</h2>
          </div>
          <div className="text-green-600 cursor-pointer ">
            <Link to={linkUrl}>{linkText}</Link>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
