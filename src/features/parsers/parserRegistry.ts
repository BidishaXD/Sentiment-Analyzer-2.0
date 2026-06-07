import type { MessagePlatform } from "../../types/message";
import type { ImportParser } from "./types";
import { parseWhatsAppTxt } from "./whatsappTxtParser";

const whatsappParser: ImportParser = {
  platform: "whatsapp",
  extensions: [".txt"],
  mimeTypes: ["text/plain"],
  parse: ({ file, text, conversationTitle }) =>
    parseWhatsAppTxt(text, conversationTitle ?? stripExtension(file.name)),
};

const parsers: ImportParser[] = [whatsappParser];

export function getParser(
  platform: MessagePlatform,
  fileName: string,
): ImportParser {
  const parser = parsers.find((item) => item.platform === platform);

  if (!parser) {
    throw new Error(`${platform} imports are not available yet.`);
  }

  const extension = getExtension(fileName);

  if (!parser.extensions.includes(extension)) {
    throw new Error(
      `${platform} imports support ${parser.extensions.join(", ")} files.`,
    );
  }

  return parser;
}

export function getSupportedExtensions(platform: MessagePlatform): string[] {
  return parsers.find((item) => item.platform === platform)?.extensions ?? [];
}

function getExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
}

function stripExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(0, dotIndex) : fileName;
}