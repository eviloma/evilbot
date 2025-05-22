import env from "@/utils/env";

export default class CustomError extends Error {
  type: "error" | "warning";
  constructor(message: string, type?: "error" | "warning") {
    super(message);
    this.type = type ?? "error";
  }
}

export const OnlyGuildTextChannel = new CustomError("Only Guild Text Channel");
export const FailedGenerateImage = new CustomError("Failed Generate Image");

export const MusicClientNotFound = new CustomError("Music client not found");
export const MusicModuleDisabled = new CustomError(
  "Administator has disabled music module",
);
export const MusicChannelNotEqual = new CustomError(
  `Allow only in <#${env.MUSIC_TEXT_CHANNEL_ID}>`,
);
export const MusicMissingVoiceChannel = new CustomError(
  "Required to be in a voice channel",
);
export const MusicBotInOtherChannel = new CustomError(
  "Music bot is in other channel",
);
export const MusicSearchNotFound = new CustomError("Not found any result");
export const MusicQueueIsEmpty = new CustomError("Queue is empty", "warning");

export const DefaultButtonError = new CustomError("Failed to execute button");
