export type Lamp = "off" | "on";
export type Book = "shut" | "open";

export type StoryState = {
  lamp: Lamp;
  book: Book;
};

export const EMPTY_STORY: StoryState = { lamp: "off", book: "shut" };

export function storyLine(state: StoryState): string {
  if (state.book === "open") return "Time to read.";
  if (state.lamp === "on") return "The light is on.";
  return "The room is dark.";
}

export function storyStatus(state: StoryState): string {
  if (state.book === "open") return "The book is open.";
  if (state.lamp === "on") return "Ready to read.";
  return "Nothing is on.";
}

export function hasProgress(state: StoryState): boolean {
  return state.lamp === "on" || state.book === "open";
}

function isLamp(value: unknown): value is Lamp {
  return value === "off" || value === "on";
}

function isBook(value: unknown): value is Book {
  return value === "shut" || value === "open";
}

export function parseStory(raw: string | null): StoryState {
  if (!raw) return EMPTY_STORY;
  try {
    const value = JSON.parse(raw) as { lamp?: unknown; book?: unknown };
    if (!isLamp(value.lamp) || !isBook(value.book)) return EMPTY_STORY;
    if (value.lamp === "off" && value.book === "open") return EMPTY_STORY;
    return { lamp: value.lamp, book: value.book };
  } catch {
    return EMPTY_STORY;
  }
}

export function turnLampOn(state: StoryState): { state: StoryState; note: string } {
  if (state.lamp === "on") return { state, note: "Already on." };
  return { state: { ...state, lamp: "on" }, note: "Lamp is on." };
}

export function turnLampOff(state: StoryState): { state: StoryState; note: string } {
  if (state.book === "open") return { state, note: "Shut the book." };
  if (state.lamp === "off") return { state, note: "Already off." };
  return { state: { lamp: "off", book: "shut" }, note: "Lamp is off." };
}

export function openBook(state: StoryState): { state: StoryState; note: string } {
  if (state.book === "open") return { state, note: "Already open." };
  if (state.lamp !== "on") return { state, note: "Light first." };
  return { state: { lamp: "on", book: "open" }, note: "Book is open." };
}

export function shutBook(state: StoryState): { state: StoryState; note: string } {
  if (state.book === "shut") return { state, note: "Already shut." };
  return { state: { lamp: "on", book: "shut" }, note: "Book is shut." };
}

export function resetStory(): { state: StoryState; note: string } {
  return { state: EMPTY_STORY, note: "Look at the book." };
}
