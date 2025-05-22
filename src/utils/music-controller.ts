import musicControllRow from "@/rows/Music";
import { type Client, GuildChannel } from "discord.js";
import { RainlinkLoopMode, type RainlinkPlayer } from "rainlink";
import { getDefaultEmbed } from "./discord-embeds";
import env from "./env";

export default async function updateMusicController(
  c: Client,
  player: RainlinkPlayer,
) {
  if (!env.MUSIC_TEXT_CHANNEL_ID) return;
  const channel = c.channels.cache.get(env.MUSIC_TEXT_CHANNEL_ID);
  if (!(channel?.isTextBased() && channel instanceof GuildChannel)) return;

  c.musicMessage = await c.musicMessage
    ?.delete()
    .catch(() => null)
    .finally(() => null);

  const track = c.nowPlaying;
  if (!track) return;

  let description = `**Now playing**: [${track.title}](${track.uri})\n`;
  description += `**Author**: ${track.author}\n\n`;
  description += `**Requester**: ${track.requester}\n\n`;
  description += `**Loop mode**: ${player.loop === RainlinkLoopMode.NONE ? "Off" : player.loop === RainlinkLoopMode.QUEUE ? "Queue" : "Track"}`;

  const embed = getDefaultEmbed(c)
    .setTitle("EvilPlayer")
    .setDescription(description)
    .setImage(track.artworkUrl ?? null);

  const message = await channel
    .send({ embeds: [embed], components: [musicControllRow] })
    .catch(() => null);
  if (!message) return;
  c.musicMessage = message;
}
