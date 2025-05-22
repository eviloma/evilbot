import { REST, Routes } from "discord.js";
import { getAllCommands } from ".";
import env from "./env";

async function deployCommands() {
  const commands = await getAllCommands().then(c =>
    c.map(c => c.data.toJSON()),
  );

  const rest = new REST({ version: "10" }).setToken(env.BOT_TOKEN);

  try {
    console.info(
      `[INFO] Started refreshing ${commands.length} application (/) commands.`,
    );
    const data = (await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
      body: commands,
    })) as { length: number };

    console.info(
      `[INFO] Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (err) {
    console.error("[ERROR] Failed to refresh application (/) commands:", err);
  }
}

deployCommands();
