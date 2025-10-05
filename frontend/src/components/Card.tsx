import React from "react";

function Card({
  children,
  color = "sky-700", // ตั้ง default ได้ด้วย
}: {
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg px-4 py-2 flex-1 bg-${color}`}>{children}</div>
  );
}

export default Card;
