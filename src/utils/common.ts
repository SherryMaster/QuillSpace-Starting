import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toggleTheme() {
  document.documentElement.classList.toggle("dark");
}

export function setTheme(theme: "light" | "dark") {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function removeCommonIndentation(code: string): string {
  // Split into lines and remove first empty line if exists
  const lines = code.split("\n");
  const firstNonEmptyLine = lines.find((line) => line.trim().length > 0);
  if (!firstNonEmptyLine) return code;

  // Find the common indentation level
  const commonIndent = firstNonEmptyLine.match(/^\s*/)?.[0].length ?? 0;

  // Remove the common indentation from all lines
  return lines
    .map((line) => line.slice(commonIndent))
    .join("\n")
    .trim();
}

export async function loadMarkdownFile(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${path}`);
    }
    return removeCommonIndentation(await response.text());
  } catch (error) {
    console.error("Error loading markdown:", error);
    return "";
  }
}
