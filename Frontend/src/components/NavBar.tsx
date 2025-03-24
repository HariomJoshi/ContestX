import React from "react";
import { Link, useNavigate } from "react-router-dom"; // or use <a href> if not using Next.js
import { HomeIcon, PlusCircleIcon, ClockIcon, Code } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // shadcn DropdownMenu components
import useAuth from "@/customHooks/useAuth";
import { useDispatch } from "react-redux";
import { removeToken } from "@/redux/slices/authSlice";

const NavBar = () => {
  const loggedIn = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/* Navigation Tabs */}
      <div className="flex space-x-8">
        <NavItem
          href="/"
          label="Home"
          icon={<HomeIcon className="w-5 h-5" />}
        />
        <NavItem
          href="/make-contest"
          label="Make Your Contest"
          icon={<PlusCircleIcon className="w-5 h-5" />}
        />
        <NavItem
          href="/ongoing-contest"
          label="Ongoing Contest"
          icon={<ClockIcon className="w-5 h-5" />}
        />
        <NavItem
          href="/questions"
          label="Solve Questions"
          icon={<Code className="w-5 h-5" />}
        />
      </div>

      {/* Profile Dropdown */}
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
            {loggedIn && (
              <>
                <DropdownMenuItem onSelect={() => console.log("Edit Profile")}>
                  Edit Profile
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
            )}
            {!loggedIn && (
              <>
                <DropdownMenuItem onSelect={() => navigate("/auth")}>
                  Log in
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, icon }) => {
  return (
    <Link to={href}>
      <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition cursor-pointer">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default NavBar;
