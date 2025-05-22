import { MusicSearchNotFound } from "@/classes/CustomError";
import type { Command } from "@/types/Command";
import { getDefaultEmbed } from "@/utils/discord-embeds";
import {
  getLavalinkPlayer,
  isAvalableToUseMusicCommands,
} from "@/utils/lavalink";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song by name or URL.")
    .addStringOption(o =>
      o.setName("query").setDescription("The song to play.").setRequired(true),
    ),
  async execute(i) {
    await i.deferReply({ ephemeral: true });
    isAvalableToUseMusicCommands(i);

    const query = i.options.getString("query", true);

    const player = await getLavalinkPlayer(i);
    const result = await player.search(query, { requester: i.user });

    if (!result.tracks.length) throw MusicSearchNotFound;
    if (result.type === "PLAYLIST") {
      for (const track of result.tracks) {
        player.queue.add(track);
      }
    } else {
      player.queue.add(result.tracks[0]);
    }

    if (!player.playing) player.play();

    const embed = getDefaultEmbed(i.client).setTitle("Added to queue");
    embed.setDescription(
      result.type === "PLAYLIST"
        ? `🎶 Added **${result.tracks.length}** tracks from **${result.playlistName}** playlist`
        : `🎶 Added **${result.tracks[0].title}**`,
    );

    await i.editReply({ embeds: [embed] });
  },
};

export default command;
