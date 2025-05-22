import { GreetingsCard } from "@/canvacord/GreetingsCard";
import type { Command } from "@/types/Command";
import { type GuildMember, SlashCommandBuilder } from "discord.js";

const commands: Command = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Replies with Pong!"),
  async execute(i) {
    await i.deferReply();

    const card = new GreetingsCard()
      .setMember(i.member as GuildMember)
      .setType("welcome")
      .setMessage("Welcome to the server!");

    await i.editReply({ files: [await card.build({ format: "png" })] });
  },
};

export default commands;
