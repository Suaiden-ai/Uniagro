import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
}

interface MobileSelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface MobileSelectContentProps {
  children: React.ReactNode
  className?: string
}

interface MobileSelectTriggerProps {
  children: React.ReactNode
  className?: string
}

const MobileSelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  value: undefined,
  onValueChange: undefined,
  isOpen: false,
  setIsOpen: () => {},
})

export const MobileSelect = ({ value, onValueChange, children, className }: MobileSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <MobileSelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className={cn("relative", className)}>
        {children}
      </div>
    </MobileSelectContext.Provider>
  )
}

export const MobileSelectTrigger = ({ children, className }: MobileSelectTriggerProps) => {
  const { isOpen, setIsOpen } = React.useContext(MobileSelectContext)

  return (
    <button
      type="button"
      className={cn(
        "mobile-select-trigger w-full max-w-full flex items-center justify-between",
        "min-h-[36px] px-3 py-2 text-sm font-medium",
        "border border-gray-200 rounded",
        "bg-white text-gray-900",
        "hover:border-green-500 hover:shadow-lg hover:-translate-y-0.5",
        "focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100",
        "transition-all duration-300 ease-in-out",
        "shadow-sm box-border",
        isOpen && "border-green-500 shadow-lg -translate-y-0.5",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <ChevronDown 
        className={cn(
          "w-3.5 h-3.5 text-gray-500 transition-transform duration-300",
          isOpen && "rotate-180 text-green-500"
        )} 
      />
    </button>
  )
}

export const MobileSelectContent = ({ children, className }: MobileSelectContentProps) => {
  const { isOpen } = React.useContext(MobileSelectContext)

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "mobile-select-content absolute top-full left-0 right-0 z-50 mt-2 max-w-full",
        "bg-white border-2 border-gray-200 rounded-xl shadow-2xl",
        "max-h-80 overflow-y-auto box-border",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        className
      )}
    >
      <div className="p-2">
        {children}
      </div>
    </div>
  )
}

export const MobileSelectItem = ({ value, children, className }: MobileSelectItemProps) => {
  const { value: selectedValue, onValueChange, setIsOpen } = React.useContext(MobileSelectContext)
  const isSelected = selectedValue === value

  return (
    <button
      type="button"
      className={cn(
        "mobile-select-item w-full flex items-center justify-between",
        "min-h-[36px] px-3 py-2 text-sm font-medium",
        "rounded transition-all duration-200",
        "hover:bg-gray-50 hover:translate-x-1",
        "focus:outline-none focus:bg-green-50 focus:text-green-700",
        isSelected && "bg-green-100 text-green-700 border-2 border-green-300 font-bold",
        className
      )}
      onClick={() => {
        onValueChange?.(value)
        setIsOpen(false)
      }}
    >
      <span>{children}</span>
      {isSelected && <Check className="w-3 h-3 text-green-600" />}
    </button>
  )
}

export const MobileSelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value } = React.useContext(MobileSelectContext)
  
  return (
    <span className={cn(
      "mobile-select-placeholder text-sm",
      value ? "text-gray-900" : "text-gray-500"
    )}>
      {value || placeholder}
    </span>
  )
}
