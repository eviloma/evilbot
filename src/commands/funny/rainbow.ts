import {
  FailedGenerateImage,
  OnlyGuildTextChannel,
} from "@/classes/CustomError";
import type { Command } from "@/types/Command";
import { canvacord } from "canvacord";
import { GuildMember, SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("rainbow")
    .setDescription("Create an rainbow avatar and send it!")
    .addUserOption(el =>
      el.setName("user").setDescription("The user to rainbowify."),
    ),
  async execute(i) {
    const { channel, member } = i;
    if (!(channel?.isTextBased() && member instanceof GuildMember))
      throw OnlyGuildTextChannel;

    await i.deferReply();

    const avatarUrl = (i.options.getUser("user") ?? member)?.displayAvatarURL({
      extension: "png",
    });
    const image = await canvacord.rainbow(avatarUrl);
    if (!image) throw FailedGenerateImage;

    await i.editReply({ files: [{ attachment: image, name: "rainbow.png" }] });
  },
};

export default command;
