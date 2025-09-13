import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import type { NavItem } from "../../types/NavType";
import HamburgerMenu from "../Feature/HamburgerMenu";

const NAV_ITEMS: NavItem[] = [
  { id: "analyze", label: "Analyze", to: "/analyze" },
  { id: "history", label: "History", to: "/history" },
  { id: "docs", label: "Docs", to: "/docs" },
  { id: "about", label: "About", to: "/about" },
  { id: "sign", label: "Sign In", to: "/sign" },
];

function Navbar() {
  const isWidth768 = useMediaQuery({ minWidth: 768 });

  return (
    <nav className="sticky top-0 w-full py-0 sm:py-3 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="container-mid sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            aria-label="Go to landing page"
            className="flex items-center space-x-2 text-xl font-bold cursor-pointer group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 group-hover:from-teal-400 group-hover:to-blue-500 transition-colors duration-400">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-slate-800 group-hover:text-blue-500 transition-all duration-250">
              Hypothesis Tester
            </span>
          </Link>

          {!isWidth768 ?
            <HamburgerMenu sectionList={NAV_ITEMS}/>
            :
            <ul className="flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    className="text-[#475569] hover:text-black cursor-pointer transition-colors duration-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
