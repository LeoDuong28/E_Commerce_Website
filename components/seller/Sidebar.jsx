import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiPlus, FiPackage, FiClipboard, FiHelpCircle } from "react-icons/fi";

const menuItems = [
  {
    name: "Add Product",
    path: "/seller",
    icon: <FiPlus className="w-5 h-5" />,
  },
  {
    name: "Product List",
    path: "/seller/product-list",
    icon: <FiPackage className="w-5 h-5" />,
  },
  {
    name: "Orders",
    path: "/seller/orders",
    icon: <FiClipboard className="w-5 h-5" />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="md:w-64 w-16 border-r min-h-screen bg-white flex flex-col">
      <div className="hidden md:block px-6 py-4 border-b">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </h2>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link href={item.path} key={item.name}>
              <div
                className={`
                  flex items-center gap-3 mx-2 md:mx-3 px-3 md:px-4 py-3 rounded-lg mb-1 transition-all duration-200
                  ${isActive
                    ? "bg-[#1877f2] text-white shadow-md shadow-[#1877f2]/30"
                    : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <span className={isActive ? "text-white" : "text-gray-500"}>
                  {item.icon}
                </span>
                <span className="hidden md:block font-medium text-sm">
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block p-4 border-t">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiHelpCircle className="w-5 h-5 text-[#1877f2]" />
            <span className="font-medium text-sm text-gray-700">Need Help?</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Contact support for assistance with your seller account.
          </p>
          <button className="w-full text-xs font-medium text-[#1877f2] hover:text-[#1466d8] transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
