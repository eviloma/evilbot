import type { Command } from "@/types/Command";
import { getDefaultEmbed } from "@/utils/discord-embeds";
import {
  getLavalinkPlayer,
  isAvalableToUseMusicCommands,
} from "@/utils/lavalink";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current track."),
  async execute(i) {
    await i.deferReply({ ephemeral: true });
    isAvalableToUseMusicCommands(i);

    const player = await getLavalinkPlayer(i);
    await player.setPause(true);

    await i.editReply({
      embeds: [
        getDefaultEmbed(i.client)
          .setTitle("Music")
          .setDescription("⏸ Paused playing"),
      ],
    });
  },
};

export default command;
