import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        // Neobrutalism base styles
        "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
          "bg-white text-black hover:bg-gray-50": variant === "outline",
          "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
          "bg-green-500 text-white hover:bg-green-600": variant === "success",
          "h-10 px-4 py-2": size === "default",
          "h-9 px-3": size === "sm",
          "h-11 px-8": size === "lg",
        },
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
