import { Outlet } from 'react-router-dom';
import tokopedia from '@/assets/tokopedia.svg';

import { Link } from '@/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';

import useUsername from '@/hooks/useUsername';

import { useNavigate } from 'react-router-dom';
export default function _layout_root() {
  const username = useUsername();
  const navigate = useNavigate();

  const handleSearch = (values: any) => {
    console.log(values);
    navigate(`/?video_title=${values.search}`);
  };

  console.log(username);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between px-6 py-3 gap-64 border-b-2 ">
        <div className=" flex items-center">
          <Link to="/">
            <img src={tokopedia} alt="" />
          </Link>
        </div>
        <div className="focus-within:outline-green-600 flex-1 flex outline outline-neutral-400 rounded  w-full px-3 gap-3">
          <div className="flex items-center justify-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
          <div className="h-full flex-1 ">
            {/* <input type="text" className="h-full w-full focus:outline-none" /> */}

            <Formik initialValues={{ search: '' }} onSubmit={handleSearch}>
              <Form className="h-full w-full focus:outline-none">
                <Field
                  name="search"
                  className="h-full w-full focus:outline-none"
                />
              </Form>
            </Formik>
          </div>
        </div>
        <div className="flex gap-5">
          {/* if username not null, print Hello, {username} */}
          {username ? (
            <div className="flex items-center gap-2">
              <span>Hello,</span>
              <span className="font-bold">{username}</span>
            </div>
          ) : (
            <div>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </div>
          )}

          {/* if username not null, show logout, else show register */}
          {username ? (
            <div>
              <Link to="/logout">
                <Button inverse>Logout</Button>
              </Link>
            </div>
          ) : (
            <div>
              <Link to="/register">
                <Button inverse>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

function Button({ children, inverse = false, ...props }: any) {
  let customClass = '';
  if (inverse) {
    customClass = 'bg-white border border-green-600 text-green-600';
  } else {
    customClass = 'bg-green-600 text-white';
  }
  return (
    <button className={`${customClass} px-4 py-2 rounded`} {...props}>
      {children}
    </button>
  );
}
