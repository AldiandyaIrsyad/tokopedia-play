import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div>
      <Link to="/">LOGO</Link>
      <Link to="/login">Login</Link>
    </div>
  );
}
