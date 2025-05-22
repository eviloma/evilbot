import type { Command } from "@/types/Command";
import { getDefaultEmbed } from "@/utils/discord-embeds";
import {
  getLavalinkPlayer,
  isAvalableToUseMusicCommands,
} from "@/utils/lavalink";
import { SlashCommandBuilder } from "discord.js";
import type { RainlinkLoopMode } from "rainlink";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Change the loop mode.")
    .addStringOption(o =>
      o
        .setName("mode")
        .setDescription("The loop mode to set.")
        .setRequired(true)
        .addChoices(
          { name: "Off", value: "none" },
          { name: "Track", value: "song" },
          { name: "Queue", value: "queue" },
        ),
    ),
  async execute(i) {
    await i.deferReply({ ephemeral: true });
    isAvalableToUseMusicCommands(i);

    const mode = i.options.getString("mode", true) as RainlinkLoopMode;

    const player = await getLavalinkPlayer(i);
    player.setLoop(mode);

    await i.client.updateMusicController(player);
    await i.editReply({
      embeds: [
        getDefaultEmbed(i.client)
          .setTitle("Music")
          .setDescription(
            `🔁 Changed loop mode to ${mode === "none" ? "Off" : mode === "song" ? "Track" : "Queue"}`,
          ),
      ],
    });
  },
};

export default command;
