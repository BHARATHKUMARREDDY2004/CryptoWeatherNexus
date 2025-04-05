import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  FaSun,
  FaChartLine,
  FaNewspaper,
  FaHeart,
  FaBars,
  FaTimes,
  FaBell,
  FaTachometerAlt,
} from "react-icons/fa";
import { loadPreferencesFromLocalStorage } from "../redux/userPreferencesActions";

const Navbar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { alerts } = useSelector((state) => state.crypto);
  const { favoriteCities } = useSelector((state) => state.userPreferences);
  const { favoriteCryptos } = useSelector((state) => state.userPreferences);

  useEffect(() => {
    dispatch(loadPreferencesFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const totalFavorites = favoriteCities.length + favoriteCryptos.length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary-light text-2xl font-semibold">
              CryptoWeather
            </span>
            <span className="text-white text-lg">Nexus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                isActive("/") && pathname === "/"
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaTachometerAlt className="text-lg" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/weather"
              className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                isActive("/weather")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaSun className="text-lg" />
              <span>Weather</span>
            </Link>
            <Link
              href="/crypto"
              className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                isActive("/crypto")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaChartLine className="text-lg" />
              <span>Crypto</span>
            </Link>
            <Link
              href="/news"
              className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                isActive("/news")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaNewspaper className="text-lg" />
              <span>News</span>
            </Link>
            <Link
              href="/favorites"
              className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                isActive("/favorites")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaHeart className="text-lg" />
              <span>Favorites</span>
              {totalFavorites > 0 && (
                <span className="bg-primary-light text-white text-xs rounded-full px-2 py-1">
                  {totalFavorites}
                </span>
              )}
            </Link>
            <Link
              href="/notifications"
              className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                isActive("/notifications")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaBell className="text-lg" />
              <span>Alerts</span>
              {alerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {alerts.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-gray-700">
          <div className="container mx-auto px-4 py-2 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-3 rounded-md flex items-center gap-2 ${
                isActive("/") && pathname === "/"
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaTachometerAlt className="text-lg" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/weather"
              className={`block px-3 py-3 rounded-md flex items-center gap-2 ${
                isActive("/weather")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaSun className="text-lg" />
              <span>Weather</span>
            </Link>
            <Link
              href="/crypto"
              className={`block px-3 py-3 rounded-md flex items-center gap-2 ${
                isActive("/crypto")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaChartLine className="text-lg" />
              <span>Crypto</span>
            </Link>
            <Link
              href="/news"
              className={`block px-3 py-3 rounded-md flex items-center gap-2 ${
                isActive("/news")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaNewspaper className="text-lg" />
              <span>News</span>
            </Link>
            <Link
              href="/favorites"
              className={`block px-3 py-3 rounded-md flex items-center gap-2 ${
                isActive("/favorites")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaHeart className="text-lg" />
              <span>Favorites</span>
              {totalFavorites > 0 && (
                <span className="bg-primary-light text-white text-xs rounded-full px-2 py-1">
                  {totalFavorites}
                </span>
              )}
            </Link>
            <Link
              href="/notifications"
              className={`block px-3 py-3 rounded-md flex items-center gap-2 ${
                isActive("/notifications")
                  ? "bg-primary-dark text-white"
                  : "text-gray-300 hover:bg-secondary-light hover:text-white"
              }`}>
              <FaBell className="text-lg" />
              <span>Alerts</span>
              {alerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {alerts.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
