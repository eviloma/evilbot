import type { Command } from "@/types/Command";
import { getDefaultEmbed } from "@/utils/discord-embeds";
import {
  getLavalinkPlayer,
  isAvalableToUseMusicCommands,
} from "@/utils/lavalink";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the current song and clear the queue."),
  async execute(i) {
    await i.deferReply({ ephemeral: true });
    isAvalableToUseMusicCommands(i);

    const player = await getLavalinkPlayer(i);
    await player.stop(true);

    await i.editReply({
      embeds: [
        getDefaultEmbed(i.client)
          .setTitle("Music")
          .setDescription("⏹️ Stopped playing"),
      ],
    });
  },
};

export default command;
