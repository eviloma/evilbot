import dayjs from "dayjs";

const letters = "abcdefghijklmnopqrstuvwxyz".split("");
const symbols = "@#$%^&*()_+=-".split("");

type Holiday =
  | "halloween"
  | "christmas"
  | "valentine"
  | "woman"
  | "programmer"
  | "april-fools"
  | "ukraine"
  | null;

export function getHolidayStatus(): Holiday {
  const now = dayjs().set("year", 2000);

  if (now.isAfter("2000-10-24", "day") && now.isBefore("2000-11-5", "day"))
    return "halloween";
  if (now.isSame("2000-02-14", "day")) return "valentine";
  if (now.isSame("2000-03-08", "day")) return "woman";
  if (now.isSame("2000-01-07", "day")) return "programmer";
  if (now.isSame("2000-04-01", "day")) return "april-fools";
  if (now.isSame("2000-08-24")) return "ukraine";
  if (now.isAfter("2000-12-19") || now.isBefore("2000-01-15"))
    return "christmas";

  return null;
}

function getAprilFoolsName(displayName: string): string {
  return displayName
    .split("")
    .map(char => {
      // Keep spaces
      if (char === " ") return char;
      let newChar = "";

      // Replace on symbols with 7.5% chance
      if (Math.random() < 0.075)
        newChar = symbols[Math.floor(Math.random() * symbols.length)];
      else {
        // Generate random letters
        const charID = letters.indexOf(char.toLowerCase());
        if (charID === -1)
          newChar = char[Math.floor(Math.random() * char.length)];
        else
          newChar =
            letters[
              Math.min(
                Math.max(0, charID + Math.floor(Math.random() * 5) - 2),
                letters.length - 1,
              )
            ];

        // Random uppercase
        if (Math.random() > 0.5) newChar = newChar.toUpperCase();
      }

      return newChar;
    })
    .join("");
}

export function getTempVoiceName(displayName: string): string {
  switch (getHolidayStatus()) {
    case "halloween":
      return `🦇・${displayName}`;
    case "christmas":
      return `⛄・${displayName}`;
    case "valentine":
      return `❤️・${displayName}`;
    case "woman":
      return `♀️・${displayName}`;
    case "programmer":
      return `👨‍💻・${displayName}`;
    case "april-fools":
      return `🤡・${getAprilFoolsName(displayName)}`;
    case "ukraine":
      return `🇺🇦・${displayName}`;
    default:
      return `🔊・${displayName}`;
  }
}
