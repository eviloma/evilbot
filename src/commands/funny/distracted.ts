import {
  FailedGenerateImage,
  OnlyGuildTextChannel,
} from "@/classes/CustomError";
import type { Command } from "@/types/Command";
import { canvacord } from "canvacord";
import { GuildMember, SlashCommandBuilder, type User } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("distracted")
    .setDescription("Create an distracted avatar and send it!")
    .addUserOption(el =>
      el
        .setName("first-user")
        .setRequired(true)
        .setDescription("The first user to distract."),
    )
    .addUserOption(el =>
      el
        .setName("second-user")
        .setRequired(true)
        .setDescription("The second user to distract."),
    )
    .addUserOption(el =>
      el
        .setName("third-user")
        .setRequired(true)
        .setDescription("The third user to distract."),
    ),
  async execute(i) {
    const { channel, member } = i;
    if (!(channel?.isTextBased() && member instanceof GuildMember))
      throw OnlyGuildTextChannel;

    await i.deferReply();

    const firstUser = i.options.getUser("first-user") as User;
    const secondUser = i.options.getUser("second-user") as User;
    const thirdUser = i.options.getUser("third-user") as User;

    const image = await canvacord
      .distracted(
        firstUser.displayAvatarURL({ extension: "png" }),
        secondUser.displayAvatarURL({ extension: "png" }),
        thirdUser.displayAvatarURL({ extension: "png" }),
      )
      .catch(() => null);
    if (!image) throw FailedGenerateImage;

    await i.editReply({
      files: [{ attachment: image, name: "distracted.png" }],
    });
  },
};

export default command;
