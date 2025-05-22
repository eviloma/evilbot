import { DefaultButtonError, MusicQueueIsEmpty } from "@/classes/CustomError";
import type { Button } from "@/types/Button";
import { getDefaultEmbed } from "@/utils/discord-embeds";

const button: Button = {
  id: "music-stop",
  async execute(i) {
    const { guild, client } = i;
    if (!guild) throw DefaultButtonError;

    const player = client.lavalink?.players.get(guild.id);
    if (!player) throw MusicQueueIsEmpty;

    player.stop(true);

    await i.reply({
      embeds: [
        getDefaultEmbed(client)
          .setTitle("Music")
          .setDescription("⏹️ Stopped playing"),
      ],
      ephemeral: true,
    });
  },
};

export default button;
