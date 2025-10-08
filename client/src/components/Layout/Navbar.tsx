import { useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import type { NavItem } from "../../types/NavType";
import HamburgerMenu from "../Feature/HamburgerMenu";
import { useAuth } from "../Context/authContext";

function Navbar() {
  const isWidth768 = useMediaQuery({ minWidth: 768 });

  const { isAuthenticated, logout } = useAuth()

  const navigate = useNavigate()

  const handleSignOut = () => {
    logout()
    navigate("/", { replace: true })
  };

  const NAV_ITEMS: NavItem[] = useMemo(
    () => [
      { id: "analyze", label: "Analyze", to: isAuthenticated ? "/analyze" : "/sign" },
      { id: "history", label: "History", to: isAuthenticated ? "/history" : "/sign" },
      { id: "docs", label: "Docs", to: "/docs" },
      { id: "about", label: "About", to: "/about" },

      isAuthenticated
        ? { id: "signout", label: "Sign Out", to: "/", onClick: handleSignOut }
        : { id: "signin", label: "Sign In", to: "/sign" },
    ],
    [isAuthenticated]
  );

  return (
    <nav className="sticky top-0 w-full py-0 sm:py-3 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="container-mid sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Start home page btn */}
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
          {/* End home page btn */}

          {/* Start nav item */}
          {!isWidth768 ?
            <HamburgerMenu sectionList={NAV_ITEMS}/>
            :
            <ul className="flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  {item.onClick ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="text-[#475569] hover:text-red-600 cursor-pointer transition-colors duration-400"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={
                        `text-[#475569] hover:text-blue-600 transition-colors duration-400`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          }
          {/* End nav item */}
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
