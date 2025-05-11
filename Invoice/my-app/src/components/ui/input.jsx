import * as React from "react";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full p-2 border rounded-md ${className}`}
      {...props}
    />
  );
});
