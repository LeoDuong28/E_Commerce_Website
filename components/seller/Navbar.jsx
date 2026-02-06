import { assets } from "../../assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useClerk, useUser } from "@clerk/nextjs";
import { FiHome, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { router, isDemoSeller, exitDemoMode } = useAppContext();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleExitDemo = () => {
    exitDemoMode();
    router.push("/");
  };

  return (
    <div className="flex items-center px-4 md:px-8 py-3 justify-between border-b bg-white">
      <Image
        onClick={() => router.push("/")}
        className="w-28 lg:w-32 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      {isDemoSeller && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm text-amber-800 font-medium">Demo Mode</span>
          <span className="text-xs text-amber-600">View only</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {!isDemoSeller && user && (
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-medium">
              {user.firstName?.[0] || user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "S"}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-800">
                {user.firstName || "Seller"}
              </p>
              <p className="text-gray-500 text-xs">Seller Dashboard</p>
            </div>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="bg-[#1877f2] hover:bg-[#1466d8] text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <FiHome className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Store</span>
        </button>

        {isDemoSeller ? (
          <button
            onClick={handleExitDemo}
            className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 sm:px-5 sm:py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Demo</span>
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 sm:px-5 sm:py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
