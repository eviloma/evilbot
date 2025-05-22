import { readdir } from "node:fs/promises";
import type { Button } from "@/types/Button";
import type { Command } from "@/types/Command";
import type { Event } from "@/types/Event";
import { Collection } from "discord.js";

export async function getAllCommands() {
  const commands = new Collection<string, Command>();
  const commandFolders = await readdir(`${__dirname}/../commands/`);

  for (const folder of commandFolders) {
    const commandFiles = await readdir(`${__dirname}/../commands/${folder}`);
    for (const commandFile of commandFiles) {
      const command: Command = await import(
        `../commands/${folder}/${commandFile}`
      ).then(e => e.default);
      if ("data" in command && "execute" in command) {
        commands.set(command.data.name, command);
      } else {
        console.warn(
          `[WARNING] The command at ./commands/${folder}/${commandFile} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  return commands;
}

export async function getAllEvents() {
  const events: Event[] = [];
  const eventFiles = await readdir(`${__dirname}/../events`);

  for (const eventFile of eventFiles) {
    const event: Event = await import(`../events/${eventFile}`).then(
      e => e.default,
    );
    if ("name" in event && "execute" in event) {
      events.push(event);
    }
  }
  return events;
}

export async function getAllButons() {
  const buttons: Collection<string, Button> = new Collection();
  const buttonFiles = await readdir(`${__dirname}/../buttons`);

  for (const buttonFile of buttonFiles) {
    const button: Button = await import(`../buttons/${buttonFile}`).then(
      e => e.default,
    );
    if ("id" in button && "execute" in button) {
      buttons.set(button.id, button);
    }
  }
  return buttons;
}
