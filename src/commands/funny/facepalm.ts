import {
  FailedGenerateImage,
  OnlyGuildTextChannel,
} from "@/classes/CustomError";
import type { Command } from "@/types/Command";
import { canvacord } from "canvacord";
import { GuildMember, SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("facepalm")
    .setDescription("Create an facepalm avatar and send it!")
    .addUserOption(el =>
      el.setName("user").setDescription("The user to facepalm."),
    ),
  async execute(i) {
    const { channel, member } = i;
    if (!(channel?.isTextBased() && member instanceof GuildMember))
      throw OnlyGuildTextChannel;

    await i.deferReply();

    const avatarUrl = (i.options.getUser("user") ?? member)?.displayAvatarURL({
      extension: "png",
    });
    const image = await canvacord.facepalm(avatarUrl).catch(() => null);
    if (!image) throw FailedGenerateImage;

    await i.editReply({ files: [{ attachment: image, name: "facepalm.png" }] });
  },
};

export default command;
