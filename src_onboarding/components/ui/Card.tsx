import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export function Card({
  children,
  className = "",
  onClick,
  hoverEffect = false,
}: CardProps) {
  return (
    <motion.div
      whileHover={
        hoverEffect && onClick
          ? {
              y: -2,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }
          : {}
      }
      className={`bg-white rounded-lg border border-gray-100 shadow-sm ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
