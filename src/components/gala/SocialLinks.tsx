"use client";

import { motion } from "framer-motion";
import { Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SocialLinksProps {
  twitterSpaceUrl?: string;
  discordUrl?: string;
}

export function SocialLinks({
  twitterSpaceUrl = process.env.NEXT_PUBLIC_TWITTER_SPACE_URL || "#",
  discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || "#",
}: SocialLinksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-center gap-4 mb-8"
    >
      <a href={twitterSpaceUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="lg" className="gap-2">
          <Twitter className="w-5 h-5" />
          Entrar a Space
        </Button>
      </a>
      <a href={discordUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" size="lg" className="gap-2">
          <MessageCircle className="w-5 h-5" />
          Unirse a Discord
        </Button>
      </a>
    </motion.div>
  );
}
