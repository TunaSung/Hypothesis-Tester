import { useEffect, useRef, useState, useCallback } from "react";
import type { NavItem } from "../../types/NavType";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion'
import { SlMenu } from "react-icons/sl";

interface HamburgerMenuProps {
  sectionList: NavItem[]
}

function useOutsideClick<T extends HTMLElement | null>(
  ref: React.RefObject<T>, 
  handler: (ev: MouseEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const el = ref.current
      if (el && el instanceof HTMLElement && !el.contains(event.target as Node)) {
        handler(event);
      }
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
}

function HamburgerMenu({ sectionList }: HamburgerMenuProps) {
  // State: controls whether the menu is open
  const [isOpen, setIsOpen] = useState(false);
  
  // Ref: tracks the component container for outside click detection
  const containerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close the menu when the Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // focus first link when opened
  useEffect(() => {
    if (isOpen) {
      // small timeout to wait for AnimatePresence mount
      const t = setTimeout(() => firstLinkRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Toggle the menu open/closed
  const handleMenuOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // Memoized callback to handle outside clicks (only closes when open)
  const handleOutsideClick = useCallback(() => {
    if (isOpen) handleMenuOpen();
  }, [isOpen]);

  // Attach the outside click listener
  useOutsideClick(containerRef, handleOutsideClick);

  return (
    <div ref={containerRef} className="flex justify-center items-center">
      {/* Start menu icon btn */}
      <button
        onClick={handleMenuOpen}
        className="text-xl sm:text-2xl md:text-3xl text-[#3b82f6]"
        aria-label="Open menu"
      >
        <SlMenu />
      </button>
      {/* End menu icon btn */}

      {/* Start menu list */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul role="menu" 
          className="fixed w-full px-5 sm:px-10 flex flex-col top-full right-0 border rounded-2xl rounded-t-none bg-slate-100/95 backdrop-blur-sm border-slate-200 group"
          initial={{ clipPath: "inset(0% 0% 100% 100%)" }} // inset(T R B L)
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 100%)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {sectionList.map((section) => (
              <li key={`menu-${section.id}`} className="text-center border-b last:border-0">
                <Link
                  to={section.to}
                  className="block text-xl sm:text-2xl font-bold py-3 sm:py-6 group-hover:text-white"
                  role="menuitem"
                  onClick={handleMenuOpen}
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {/* End menu list */}
    </div>
  );
}

export default HamburgerMenu;
