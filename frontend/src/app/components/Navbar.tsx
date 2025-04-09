"use client";
import { useUser } from "./UserContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  PlusCircle,
  Home,
  Briefcase,
  Shield,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://assignment-2-tjzw.onrender.com/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [setUser]);

  const handleLogout = async () => {
    await fetch("https://assignment-2-tjzw.onrender.com/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-sky-800 text-white px-4 py-10 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center">
        <Link href="/" className="font-bold text-lg flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Business Directory
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>

          {!user ? (
            <>
              <Link href="/login" className="hover:underline flex items-center gap-1">
                <User className="w-4 h-4" /> Login
              </Link>
              <Link href="/register" className="hover:underline flex items-center gap-1">
                <PlusCircle className="w-4 h-4" /> Register
              </Link>
            </>
          ) : (
            <div className="relative group">
                {/* Username + Icon */}
                <div className="flex items-center gap-1 font-semibold cursor-pointer">
                    <User className="w-4 h-4" />
                    {user.username}
                    <ChevronDown className="w-4 h-4" />
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white text-black shadow-md rounded p-2 z-50
                                invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150">
                    <p className="px-3 py-1 text-sm font-medium">Role: {user.role}</p>
                    <hr className="my-1" />

                    {user.role === "Admin" && (
                    <Link href="/adminPage" className="block px-3 py-1 hover:bg-gray-100 rounded flex items-center">
                        <Shield className="inline w-4 h-4 mr-2" />
                        Admin Dashboard
                    </Link>
                    )}

                    {user.role === "Business Owner" && (
                      <>
                        <Link
                          href="/AddBusiness"
                          className="block px-3 py-1 hover:bg-gray-100 rounded"
                        >
                          Add Business
                        </Link>
                      </>
                    )}



                    <button
                    onClick={handleLogout}
                    className="block px-3 py-1 hover:bg-gray-100 text-left w-full rounded flex items-center"
                    >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                    </button>
                </div>
                </div>

          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-3 flex flex-col gap-2">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>

          {!user ? (
            <>
              <Link href="/login" className="hover:underline flex items-center gap-1">
                <User className="w-4 h-4" /> Login
              </Link>
              <Link href="/register" className="hover:underline flex items-center gap-1">
                <PlusCircle className="w-4 h-4" /> Register
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">Role: {user.role}</p>

              {user.role === "Admin" && (
                <Link href="/adminPage" className="hover:underline flex items-center gap-1">
                  <Shield className="w-4 h-4" /> Admin Dashboard
                </Link>
              )}
              {user.role === "Business Owner" &&
                (user.hasBusiness ? (
                  <Link href="/update-business" className="hover:underline">
                    Update Business
                  </Link>
                ) : (
                  <Link href="/add-business" className="hover:underline">
                    Add Business
                  </Link>
                ))}
              {user.role === "User" && (
                <Link href="/upgrade-role" className="hover:underline">
                  Become Business Owner
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="hover:underline text-left flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
