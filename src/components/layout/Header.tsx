"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Vote, Award, Sparkles, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthButton } from "./AuthButton";
import { usePhase } from "@/hooks/usePhase";
import { canNominate, canVote } from "@/lib/phases";
import { Badge } from "@/components/ui/Badge";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  {
    href: "/nominar",
    label: "Nominar",
    icon: Sparkles,
    phase: "nominations" as const,
  },
  { href: "/votar", label: "Votar", icon: Vote, phase: "voting" as const },
  { href: "/gala", label: "Gala", icon: Award, phase: "gala" as const },
];

export function Header() {
  const pathname = usePathname();
  const { phaseInfo } = usePhase();

  const isNavItemEnabled = (item: (typeof navItems)[number]) => {
    if (!item.phase) return true;
    if (!phaseInfo) return false;

    switch (item.phase) {
      case "nominations":
        return canNominate(phaseInfo.phase);
      case "voting":
        return canVote(phaseInfo.phase);
      case "gala":
        return phaseInfo.phase === "gala" || phaseInfo.phase === "results";
      default:
        return true;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-dark-900/90 backdrop-blur-xl border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Trophy className="w-6 h-6 text-gold-400" />
              <span className="hidden sm:block font-bold text-lg text-white">
                Moro TW
              </span>
              <Badge variant="gold" className="text-xs">
                2025
              </Badge>
            </Link>

            {/* Navigation - SIEMPRE VISIBLE */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isEnabled = isNavItemEnabled(item);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={isEnabled ? item.href : "#"}
                    onClick={(e) => !isEnabled && e.preventDefault()}
                    className={cn(
                      "relative flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all text-xs sm:text-sm",
                      isActive
                        ? "text-gold-400 bg-gold-400/10"
                        : isEnabled
                        ? "text-dark-300 hover:text-white hover:bg-dark-800"
                        : "text-dark-600 cursor-not-allowed opacity-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">
                      {item.label}
                    </span>

                    {item.phase === "gala" && phaseInfo?.isLive && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Auth */}
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
