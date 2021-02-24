import { ReactComponent as Logo } from "../assets/logo.svg";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="sticky top-0 w-screen bg-yellow-400 px-4 flex items-center justify-start h-16 shadow">
      <Link
        to="/"
        className="sm:px-6 px-2 py-3 text-gray-600 text-left text-base leading-4 font-medium text-gray-200 uppercase tracking-wider"
      >
        <Logo className="fill-current text-gray-600" />
        Taskster
      </Link>
    </header>
  );
}

export default Header;