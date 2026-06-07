import type { MessagePlatform } from "../../types/message";
import { getSupportedExtensions } from "../parsers/parserRegistry";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImportFile(
  file: File | null,
  platform: MessagePlatform,
): FileValidationResult {
  if (!file) {
    return { valid: false, error: "Please choose a file to import." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "File must be smaller than 25 MB." };
  }

  const supportedExtensions = getSupportedExtensions(platform);

  if (supportedExtensions.length === 0) {
    return { valid: false, error: `${platform} imports are not available yet.` };
  }

  const fileName = file.name.toLowerCase();
  const hasSupportedExtension = supportedExtensions.some((extension) =>
    fileName.endsWith(extension),
  );

  if (!hasSupportedExtension) {
    return {
      valid: false,
      error: `Please upload a ${supportedExtensions.join(", ")} file.`,
    };
  }

  return { valid: true };
}