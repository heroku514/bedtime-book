import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseStory, type StoryState } from "./story";

const KEY = "bedtime-book-v1";

export async function loadStory(): Promise<StoryState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseStory(raw);
}

export async function saveStory(state: StoryState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
