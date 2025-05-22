// biome-ignore lint/correctness/noUnusedImports: JSX is used
import { Builder, JSX } from "canvacord";
import type { GuildMember } from "discord.js";

interface Props {
  member: GuildMember;
  type: "welcome" | "goodbye";
  message: string;
}

export class GreetingsCard extends Builder<Props> {
  constructor() {
    super(930, 280);
  }

  setMember(value: GuildMember) {
    this.options.set("member", value);
    return this;
  }

  setType(value: Props["type"]) {
    this.options.set("type", value);
    return this;
  }

  setMessage(value: string) {
    this.options.set("message", value);
    return this;
  }

  render() {
    const { member, type, message } = this.options.getOptions();

    const src =
      member.avatarURL({ extension: "png", size: 512 }) ??
      "https://cdn.discordapp.com/embed/avatars/5.png";

    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#191919]">
        <div className="flex h-[84%] w-[96%] items-center rounded-lg bg-[#252525] px-6">
          <img
            src={src}
            alt="Avatar"
            className="flex h-[40] w-[40] rounded-full"
          />
          <div className="ml-6 flex flex-col">
            <h1 className="m-0 font-bold text-5xl text-white">
              {type === "welcome" ? "Welcome" : "Goodbye"},{" "}
              <span className="text-[#6666ff]">{member.displayName}!</span>
            </h1>
            <p className="m-0 text-3xl text-gray-300">{message}</p>
          </div>
        </div>
      </div>
    );
  }
}
