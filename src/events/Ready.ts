import type { Event } from "@/types/Event";
import { ActivityType, type Client, Events } from "discord.js";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute: async (c: Client) => {
    console.info(`Logged in as ${c.user?.tag}!`);
    await c.user?.setPresence({
      status: "online",
      activities: [
        {
          name: "customstatus",
          type: ActivityType.Custom,
          state: `Evilbot v${process.env.npm_package_version}`,
        },
      ],
    });
  },
};

export default event;
