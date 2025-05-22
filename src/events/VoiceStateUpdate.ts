import type { Event } from "@/types/Event";
import env from "@/utils/env";
import { getTempVoiceName } from "@/utils/holiday";
import {
  type CategoryChannel,
  ChannelType,
  Events,
  type GuildMember,
  PermissionFlagsBits,
  type VoiceBasedChannel,
  type VoiceState,
} from "discord.js";

async function CreateVoiceChannel(
  member: GuildMember,
  channel: VoiceBasedChannel,
  parent: CategoryChannel,
) {
  const voiceChannel = await member.guild.channels
    .create({
      name: getTempVoiceName(member.displayName),
      type: ChannelType.GuildVoice,
      reason: `Create temp voice chat for ${member.displayName}`,
      permissionOverwrites: [
        {
          id: member.id,
          allow: [PermissionFlagsBits.ManageChannels],
        },
      ],
      parent,
    })
    .catch(err => {
      console.error(`[ERROR] Failed to create voice channel: ${err}`);
      return null;
    });
  if (voiceChannel) {
    await member.voice.setChannel(voiceChannel).catch(err => {
      console.error(`[ERROR] Failed to set voice channel: ${err}`);
    });
    await channel.permissionOverwrites.edit(member.id, {
      Connect: false,
    });
    setTimeout(() => {
      channel.permissionOverwrites.edit(member.id, {
        Connect: true,
      });
    }, 10000);
  }
}

async function RemoveVoiceChannel(
  member: GuildMember,
  parent: CategoryChannel,
) {
  const channels = member.guild.channels.cache.filter(
    el =>
      el.parent === parent &&
      el.type === ChannelType.GuildVoice &&
      el.members.size === 0,
  );

  for (const [_, voiceChannel] of channels) {
    await voiceChannel.delete().catch(err => {
      console.error(`[ERROR] Failed to delete voice channel: ${err}`);
    });
  }
}

const event: Event = {
  name: Events.VoiceStateUpdate,
  execute: async (oldState: VoiceState, newState: VoiceState) => {
    if (env.JOIN_TO_TALK_CHANNEL_ID && env.JOIN_TO_TALK_GROUP_ID) {
      const { member, guild } = oldState;
      const { channel } = newState;

      const joinToTalkChannel = guild.channels.cache.get(
        env.JOIN_TO_TALK_CHANNEL_ID,
      );
      const joinToTalkGroup = guild.channels.cache.get(
        env.JOIN_TO_TALK_GROUP_ID,
      );

      if (!(joinToTalkChannel && joinToTalkGroup && member && guild)) return;
      if (
        !joinToTalkChannel.isVoiceBased ||
        joinToTalkGroup.type !== ChannelType.GuildCategory
      )
        return;

      if (channel === joinToTalkChannel) {
        await CreateVoiceChannel(member, joinToTalkChannel, joinToTalkGroup);
      }

      await RemoveVoiceChannel(member, joinToTalkGroup);
    }
  },
};

export default event;
