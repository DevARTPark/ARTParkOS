import React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number; // px
  className?: string;
}

/**
 * Small avatar wrapper. If src is provided it renders an <img>, otherwise initials fallback.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "avatar",
  size = 40,
  className = "",
  children,
  ...props
}) => {
  const sizeClass = `w-[${size}px] h-[${size}px]`;

  return (
    <div
      {...props}
      className={`flex items-center justify-center rounded-full bg-slate-100 text-slate-700 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={alt}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      ) : (
        // fallback: children or placeholder
        children ?? (
          <span className="text-sm font-medium">
            {(alt || "").slice(0, 1).toUpperCase()}
          </span>
        )
      )}
    </div>
  );
};

export default Avatar;
