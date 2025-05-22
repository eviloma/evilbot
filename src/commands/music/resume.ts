import type { Command } from "@/types/Command";
import { getDefaultEmbed } from "@/utils/discord-embeds";
import {
  getLavalinkPlayer,
  isAvalableToUseMusicCommands,
} from "@/utils/lavalink";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the current paused song."),
  async execute(i) {
    await i.deferReply({ ephemeral: true });
    isAvalableToUseMusicCommands(i);

    const player = await getLavalinkPlayer(i);
    await player.setPause(false);

    await i.editReply({
      embeds: [
        getDefaultEmbed(i.client)
          .setTitle("Music")
          .setDescription("▶️ Resumed playing"),
      ],
    });
  },
};

export default command;
