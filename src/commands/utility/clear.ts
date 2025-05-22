import { OnlyGuildTextChannel } from "@/classes/CustomError";
import type { Command } from "@/types/Command";
import { getDefaultEmbed } from "@/utils/discord-embeds";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(
      "Clear the current channel's messages, but maximum 14 days old.",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(el =>
      el
        .setName("amount")
        .setDescription("The amount of messages to delete.")
        .setRequired(true)
        .setMinValue(2)
        .setMaxValue(100),
    ),
  async execute(i) {
    const { client, options, channel } = i;
    if (!channel?.isTextBased() || channel.isDMBased())
      throw OnlyGuildTextChannel;

    const messages = await channel.bulkDelete(
      options.getInteger("amount", true),
      true,
    );
    i.reply({
      embeds: [
        getDefaultEmbed(client)
          .setTitle("Successful clear!")
          .setDescription(`🧹 Cleared ${messages.size} messages!`),
      ],
      ephemeral: true,
    });
  },
};

export default command;
