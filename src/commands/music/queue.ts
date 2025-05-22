import type { Command } from "@/types/Command";
import { getDefaultEmbed } from "@/utils/discord-embeds";
import {
  getLavalinkPlayer,
  isAvalableToUseMusicCommands,
} from "@/utils/lavalink";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the current queue."),
  async execute(i) {
    await i.deferReply({ ephemeral: true });
    isAvalableToUseMusicCommands(i);

    const player = await getLavalinkPlayer(i);
    let data = "";

    for (let i = 0; i < Math.min(player.queue.length, 10); i++) {
      const song = player.queue[i];
      data += `**${i + 1}.** ${song.title} - ${song.author}\n`;
    }

    if (player.queue.length > 10) {
      data += `\nand **${player.queue.length - 10}** more...`;
    }

    const embed = getDefaultEmbed(i.client)
      .setTitle("Queue")
      .setDescription(data);
    await i.editReply({ embeds: [embed] });
  },
};

export default command;
