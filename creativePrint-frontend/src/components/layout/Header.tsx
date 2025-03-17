import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ShoppingCart, Menu, X, Home, Phone, Info, ChevronDown, LogOut, User as UserIcon } from "lucide-react"
import { logoutUser } from "../../store/slices/userSlice"
import { openCart } from "../../store/slices/cartSlice" 
import type { RootState } from "../../store/store"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.length)
  const { currentUser, isAuthenticated, role } = useSelector((state: RootState) => state.user)
  const { profile } = useSelector((state: RootState) => state.userProfile)
  
  // Get avatar URL, falling back to local storage if needed
  const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.png')
  
  // Update avatar when profile changes
  useEffect(() => {
    if (profile?.profilePicture) {
      setAvatarUrl(profile.profilePicture)
    } else {
      setAvatarUrl('/default-avatar.png')
    }
  }, [profile])
  
  // Get user data from local storage if not in Redux
  const getUserData = () => {
    if (currentUser) return currentUser;
    
    const userDataStr = localStorage.getItem('user-current');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        return {
          id: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return null;
  };
  
  const userData = getUserData();
  const userRole = role || userData?.role || "";
  
  const handleLogout = () => {
    dispatch(logoutUser() as any)
    navigate('/login')
    setIsProfileMenuOpen(false)
  }
  
  // Define menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { label: "About", icon: Info, path: "/about" },
      { label: "Contact", icon: Phone, path: "/contact" },
    ];
    
    if (userRole === "CLIENT") {
      return [
        { label: "Home", icon: Home, path: "/home" },
        ...commonItems
      ];
    } else if (userRole === "PARTNER") {
      return [
        { label: "Dashboard", icon: Home, path: "/dashboard" },
        ...commonItems
      ];
    } else {
      return [
        { label: "Home", icon: Home, path: "/" },
        ...commonItems
      ];
    }
  };
  
  const menuItems = getMenuItems();

  // Handle cart click
  const handleCartClick = () => {
    dispatch(openCart());
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated && userRole === "CLIENT" ? "/home" : "/"} className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            PrintOnDemand
          </span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {menuItems.map((item) => (
            <Link 
              key={item.label}
              to={item.path} 
              className={`flex items-center px-4 py-2 rounded-lg ${
                location.pathname === item.path 
                  ? "bg-purple-100 text-purple-700" 
                  : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
              } transition-colors`}
            >
              <item.icon size={18} className="mr-2" />
              {item.label}
            </Link>
          ))}
          
          {userRole === "CLIENT" && (
            <button 
              onClick={handleCartClick} 
              className={`relative p-2 rounded-lg ${
                location.pathname === "/cart"
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
              } transition-colors`}
              aria-label="Shopping cart"
            >
              <ShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </button>
          )}
        </nav>
        
        {/* Auth buttons for logged-out users */}
        {!isAuthenticated && (
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              to="/login" 
              className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
        
        {/* Profile section */}
        {isAuthenticated && (
          <div className="relative hidden md:block">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200">
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
              </div>
              <ChevronDown size={16} className={`text-gray-600 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{userData?.firstName} {userData?.lastName}</p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <UserIcon size={16} className="mr-2" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Mobile navigation drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold">Menu</h3>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              {isAuthenticated && (
                <div className="p-4 border-b flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 mr-3">
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.png';
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{userData?.firstName} {userData?.lastName}</p>
                    <p className="text-xs text-gray-500">{userData?.role}</p>
                  </div>
                </div>
              )}
              
              <nav className="p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <Link 
                        to={item.path} 
                        className={`flex items-center py-3 px-4 rounded-lg ${
                          location.pathname === item.path 
                            ? "bg-purple-100 text-purple-700" 
                            : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon size={18} className="mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  
                  {userRole === "CLIENT" && (
                    <li>
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleCartClick();
                        }}
                        className={`flex items-center w-full py-3 px-4 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-700`}
                      >
                        <ShoppingCart size={18} className="mr-3" />
                        Cart
                        {cartItemsCount > 0 && (
                          <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {cartItemsCount}
                          </span>
                        )}
                      </button>
                    </li>
                  )}
                </ul>
                
                {!isAuthenticated ? (
                  <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      className="flex items-center justify-center py-2 px-4 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t">
                    <Link
                      to="/profile"
                      className="flex items-center py-3 px-4 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserIcon size={18} className="mr-3" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left py-3 px-4 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      <LogOut size={18} className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}