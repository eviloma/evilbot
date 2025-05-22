import type { Command } from "@/types/Command";
import { getDefaultEmbed } from "@/utils/discord-embeds";
import {
  getLavalinkPlayer,
  isAvalableToUseMusicCommands,
} from "@/utils/lavalink";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set the volume of the player.")
    .addIntegerOption(o =>
      o
        .setName("volume")
        .setDescription("The volume to set.")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100),
    ),
  async execute(i) {
    await i.deferReply({ ephemeral: true });
    isAvalableToUseMusicCommands(i);

    const volume = i.options.getInteger("volume", true);

    const player = await getLavalinkPlayer(i);
    await player.setVolume(volume);

    await i.editReply({
      embeds: [
        getDefaultEmbed(i.client)
          .setTitle("Music")
          .setDescription(`🔊 Changed volume to ${volume}%`),
      ],
    });
  },
};

export default command;
