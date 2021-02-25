import { ReactComponent as Logo } from "../assets/logo.svg";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="sticky top-0 w-screen bg-yellow-400 px-4 flex items-center justify-start h-16 shadow">
      <Link
        to="/"
        className="px-2 py-3 text-gray-600 text-left text-lg leading-4 font-bold text-gray-200 uppercase tracking-wider"
      >
        <Logo className="fill-current text-gray-600" />
        Taskster
      </Link>
    </header>
  );
}

export default Header;