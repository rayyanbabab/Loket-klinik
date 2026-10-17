import * as React from "react"

import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1, disabled = false, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      onValueChange([newValue])
    }

    const percentage = ((value[0] || 0) - min) / (max - min) * 100

    return (
      <div className={cn("relative flex w-full items-center", className)}>
        <div className="relative w-full h-6 flex items-center">
          {/* Track */}
          <div className="absolute inset-0 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            {/* Progress */}
            <div 
              className="h-full bg-teal-600 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* Thumb */}
          <div 
            className={cn(
              "absolute w-4 h-4 bg-white border-2 border-teal-600 rounded-full shadow-xs transition-all duration-150 ease-out transform -translate-x-1/2",
              "hover:scale-105",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{ left: `${percentage}%` }}
          />
          
          {/* Hidden range input */}
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0] || 0}
            onChange={handleChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            {...props}
          />
        </div>
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }