import type { Client } from "discord.js";
import { getAllEvents } from ".";
import env from "./env";

export async function registerClientEvents(client: Client) {
  const events = await getAllEvents();

  for (const event of events) {
    if (event.once) {
      client.once(event.name, event.execute);
    } else {
      client.on(event.name, event.execute);
    }
  }

  console.info("[INFO] Registered all client events!");
}

export async function registerLavalinkEvents(client: Client) {
  const { lavalink } = client;
  if (!lavalink) {
    console.warn("[WARN] Lavalink is not created!");
    return;
  }

  lavalink.on("debug", logs => {
    if (!env.isDev) return;
    console.info("[DEBUG] Lavalink,", logs);
  });

  lavalink.on("nodeClosed", node => {
    console.warn(`[WARN] Lavalink ${node.options.name}: Closed`);
  });

  lavalink.on("nodeConnect", node => {
    console.info(`[INFO] Lavalink ${node.options.name}: Connected`);
  });

  lavalink.on("nodeError", (node, error) => {
    console.error(`[ERROR] Lavalink ${node.options.name}: Error`, error);
  });

  lavalink.on("nodeReconnect", node => {
    console.info(`[INFO] Lavalink ${node.options.name}: Reconnecting`);
  });

  lavalink.on("playerCreate", player => {
    console.info(`[INFO] Lavalink ${player.textId}: Created`);
  });

  lavalink.on("playerException", (player, error) => {
    console.error(`[ERROR] Lavalink ${player.textId}: Exception`, error);
  });

  lavalink.on("trackStart", (player, track) => {
    client.nowPlaying = track;
    client.updateMusicController(player);
  });

  lavalink.on("trackEnd", () => {
    client.nowPlaying = undefined;
  });

  lavalink.on("playerDestroy", player => {
    client.nowPlaying = undefined;
    client.updateMusicController(player);
  });

  console.info("[INFO] Registered all lavalink events!");
}
