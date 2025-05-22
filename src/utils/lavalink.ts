import {
  MusicBotInOtherChannel,
  MusicChannelNotEqual,
  MusicClientNotFound,
  MusicMissingVoiceChannel,
  MusicModuleDisabled,
} from "@/classes/CustomError";
import type {
  ChatInputCommandInteraction,
  Client,
  GuildMember,
} from "discord.js";
import { Library, Rainlink } from "rainlink";
import { nodes } from "../../lavalink.json";
import env from "./env";

export default function createLavalinkClient(c: Client) {
  return new Rainlink({
    library: new Library.DiscordJS(c),
    nodes,
  });
}

export function isAvalableToUseMusicCommands(i: ChatInputCommandInteraction) {
  const member = i.member as GuildMember;
  const botVoiceChannel = i.guild?.members.me?.voice.channel;

  if (!env.MUSIC_TEXT_CHANNEL_ID) throw MusicModuleDisabled;
  const channel = i.client.channels.cache.get(env.MUSIC_TEXT_CHANNEL_ID);
  if (!channel?.isTextBased()) throw MusicModuleDisabled;

  if (i.channel !== channel) throw MusicChannelNotEqual;
  if (!member.voice.channel) throw MusicMissingVoiceChannel;
  if (botVoiceChannel && member.voice.channel !== botVoiceChannel)
    throw MusicBotInOtherChannel;
}

export async function getLavalinkPlayer(i: ChatInputCommandInteraction) {
  const member = i.member as GuildMember;

  if (!member.voice.channel) throw MusicMissingVoiceChannel;
  if (!env.MUSIC_TEXT_CHANNEL_ID) throw MusicModuleDisabled;

  if (!i.client.lavalink) throw MusicClientNotFound;
  if (!i.guild) throw MusicClientNotFound;

  return (
    i.client.lavalink.players.get(i.guild.id) ??
    (await i.client.lavalink.create({
      guildId: i.guild.id,
      shardId: i.guild.shardId,
      voiceId: member.voice.channel.id,
      textId: env.MUSIC_TEXT_CHANNEL_ID,
    }))
  );
}
