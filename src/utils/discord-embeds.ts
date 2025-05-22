import { type Client, EmbedBuilder } from "discord.js";

export function getDefaultEmbed(c: Client) {
  return new EmbedBuilder()
    .setColor(0x5620c0)
    .setTimestamp()
    .setFooter({
      text: c.user?.username ?? "Unknown",
      iconURL: c.user?.avatarURL() ?? undefined,
    });
}

export function getErrorEmbed(c: Client, description: string) {
  return getDefaultEmbed(c)
    .setColor("Red")
    .setTitle("Error")
    .setDescription(`⛔ ${description}`);
}

export function getWarningEmbed(c: Client, description: string) {
  return getDefaultEmbed(c)
    .setColor("Yellow")
    .setTitle("Warning")
    .setDescription(`⚠️ ${description}`);
}
