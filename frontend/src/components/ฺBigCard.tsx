import React, { type CSSProperties } from "react";

interface CardProps {
  children: React.ReactNode;
  bgColor?: string; // สีพื้นหลัง
  style?: CSSProperties; // props style จาก component ลูก
  className?: string; // สำหรับเพิ่ม class เพิ่มเติม
}

function Card({
  children,
  bgColor = "#f9fafb",
  style,
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-lg px-4 py-4 flex-1 shadow-lg ${className}`}
      style={{ backgroundColor: bgColor, ...style }}
    >
      {children}
    </div>
  );
}

export default Card;
