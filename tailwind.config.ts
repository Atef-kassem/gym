/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          cyan: "hsl(var(--secondary-cyan))",
          "cyan-foreground": "hsl(var(--secondary-cyan-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        /* Dark Mode Specific Colors */
        dark: {
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          card: "hsl(var(--card))",
          "card-foreground": "hsl(var(--card-foreground))",
          muted: "hsl(var(--muted))",
          "muted-foreground": "hsl(var(--muted-foreground))",
          accent: "hsl(var(--accent))",
          "accent-foreground": "hsl(var(--accent-foreground))",
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
        },
        /* Meta Codecx Brand Colors */
        daglwa: {
          DEFAULT: "hsl(var(--primary))" /* الذهبي الأساسي */,
          gold: "hsl(var(--secondary-cyan))" /* الذهبي الفاتح المميز */,
          "gold-foreground": "hsl(var(--secondary-cyan-foreground))",
        },
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        sans: ["Cairo", "Poppins", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-daglwa": "var(--gradient-daglwa)",
        "gradient-card": "var(--gradient-card)",
        "gradient-hero": "var(--gradient-hero)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "bubble-float": {
          "0%": {
            transform: "translateY(100px) scale(0)",
          },
          "50%": {
            transform: "translateY(-50px) scale(1)",
          },
          "100%": {
            transform: "translateY(-100px) scale(0)",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px hsl(var(--primary) / 0.3)",
          },
          "50%": {
            boxShadow: "0 0 20px hsl(var(--primary) / 0.6)",
          },
        },
        "bounce-in": {
          "0%": {
            transform: "scale(0.3)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "0.8",
          },
          "70%": {
            transform: "scale(0.9)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "bubble-float": "bubble-float 8s linear infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
        wiggle: "wiggle 1s ease-in-out infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        shimmer: "shimmer 2s linear infinite",
        ripple: "ripple 0.6s linear",
        morph: "morph 8s ease-in-out infinite",
        heartbeat: "heartbeat 1.5s ease-in-out infinite both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
