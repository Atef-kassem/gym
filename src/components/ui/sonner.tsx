import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"
import { useEffect, useState } from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme, systemTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">("system")

  useEffect(() => {
    const resolvedTheme = theme === "system" ? systemTheme : theme
    setCurrentTheme(resolvedTheme as "light" | "dark" | "system")
  }, [theme, systemTheme])

  return (
    <Sonner
      theme={currentTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
