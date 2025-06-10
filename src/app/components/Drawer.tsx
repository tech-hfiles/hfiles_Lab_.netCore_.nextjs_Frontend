import React, { ReactNode } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string; // e.g. 'w-80', 'w-96'
  position?: "right" | "left"; // drawer position
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  widthClass = "w-80",
  position = "right",
}) => {
  if (!isOpen) return null;

  const drawerPositionClasses =
    position === "right" ? "right-0" : "left-0";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 ${drawerPositionClasses} h-full bg-white shadow-lg z-50 p-6 flex flex-col transition-transform duration-300 ease-in-out ${widthClass}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="self-end mb-4 text-gray-700 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close drawer"
        >
          ✕
        </button>
        {children}
      </aside>
    </>
  );
};

export default Drawer;
