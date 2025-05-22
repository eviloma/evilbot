import { GreetingsCard } from "@/canvacord/GreetingsCard";
import type { Event } from "@/types/Event";
import env from "@/utils/env";
import { Events, type GuildMember } from "discord.js";

const event: Event = {
  name: Events.GuildMemberAdd,
  execute: async (m: GuildMember) => {
    // Add join role
    if (env.JOIN_ROLE_ID) {
      const role = m.guild.roles.cache.get(env.JOIN_ROLE_ID);
      if (role) {
        await m.roles
          .add(role, "User joined")
          .catch(err => console.error(`[ERROR] Failed to add role: ${err}`));
      }
    }

    // Create and send welcome card
    const mainChannel = m.guild.channels.cache.get(env.MAIN_TEXT_CHANNEL_ID);
    if (mainChannel?.isTextBased() && !mainChannel.isDMBased()) {
      const card = new GreetingsCard()
        .setMember(m)
        .setType("welcome")
        .setMessage("Welcome to the server!");
      await mainChannel.send({
        content: `<@${m.id}>`,
        files: [await card.build({ format: "png" })],
      });
    }
  },
};

export default event;
