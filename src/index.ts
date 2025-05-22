import { Font } from "canvacord";
import { Client, GatewayIntentBits } from "discord.js";
import type { RainlinkPlayer } from "rainlink";
import { getAllButons } from "./utils";
import env from "./utils/env";
import { registerClientEvents, registerLavalinkEvents } from "./utils/handlers";
import createLavalinkClient from "./utils/lavalink";
import updateMusicController from "./utils/music-controller";

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
Font.loadDefault();
await registerClientEvents(client);

client.lavalink = createLavalinkClient(client);
await registerLavalinkEvents(client);

client.buttons = await getAllButons();
client.updateMusicController = (player: RainlinkPlayer) =>
  updateMusicController(client, player);

client.login(env.BOT_TOKEN);
