import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  PlusCircleIcon,
  ClockIcon,
  Code,
  Menu,
  X,
  FileQuestion,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/customHooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { removeToken } from "@/redux/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/redux/store";

const NavBar = () => {
  const loggedIn = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const id = useSelector((state: RootState) => state.user.data.id);
  console.log(id);

  // Navigation items
  const navItems = [
    { href: `/${id}`, label: "Home", icon: <HomeIcon className="w-5 h-5" /> },
    {
      href: "/make-contest",
      label: "Make Your Contest",
      icon: <PlusCircleIcon className="w-5 h-5" />,
    },
    {
      href: "/ongoing-contest",
      label: "Ongoing Contest",
      icon: <ClockIcon className="w-5 h-5" />,
    },
    {
      href: "/questions",
      label: "Solve Questions",
      icon: <Code className="w-5 h-5" />,
    },
    {
      href: "/add-question",
      label: "Add Question",
      icon: <FileQuestion className="w-5 h-5" />,
    },
  ];

  const userId = useSelector((state: RootState) => {
    return state.user.data.id;
  });

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Mobile Hamburger Icon */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Dropdown (visible on all screen sizes) */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full overflow-hidden border border-gray-200 w-10 h-10">
              <img
                src="/images/profile.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {loggedIn ? (
              <>
                <DropdownMenuItem
                  onSelect={() => navigate(`/profile/${userId}`)}
                >
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    dispatch(removeToken());
                    navigate("/auth");
                  }}
                >
                  Log Out
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onSelect={() => navigate("/auth")}>
                Log in
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 bg-white shadow z-50 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <NavItem
                  key={index}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, icon, onClick }) => {
  return (
    <Link to={href} onClick={onClick}>
      <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition cursor-pointer">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default NavBar;
