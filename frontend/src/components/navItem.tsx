function NavItem({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md ${
        active
          ? "bg-gray-200 dark:bg-slate-700 font-semibold"
          : "hover:bg-gray-100 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}
export default NavItem;
