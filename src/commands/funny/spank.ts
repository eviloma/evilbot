import {
  FailedGenerateImage,
  OnlyGuildTextChannel,
} from "@/classes/CustomError";
import type { Command } from "@/types/Command";
import { canvacord } from "canvacord";
import { GuildMember, SlashCommandBuilder, type User } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("spank")
    .setDescription("Create an spanked avatar and send it!")
    .addUserOption(el =>
      el
        .setName("first-user")
        .setRequired(true)
        .setDescription("The first user to spank."),
    )
    .addUserOption(el =>
      el
        .setName("second-user")
        .setRequired(true)
        .setDescription("The second user to spank."),
    ),
  async execute(i) {
    const { channel, member } = i;
    if (!(channel?.isTextBased() && member instanceof GuildMember))
      throw OnlyGuildTextChannel;

    await i.deferReply();

    const firstUser = i.options.getUser("first-user") as User;
    const secondUser = i.options.getUser("second-user") as User;

    const image = await canvacord
      .spank(
        firstUser.displayAvatarURL({ extension: "png" }),
        secondUser.displayAvatarURL({ extension: "png" }),
      )
      .catch(() => null);
    if (!image) throw FailedGenerateImage;

    await i.editReply({ files: [{ attachment: image, name: "spank.png" }] });
  },
};

export default command;
