import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  EMPTY_STORY,
  hasProgress,
  openBook,
  resetStory,
  shutBook,
  storyLine,
  storyStatus,
  turnLampOff,
  turnLampOn,
  type StoryState,
} from "./src/story";
import { loadStory, saveStory } from "./src/store";

export default function App() {
  const [state, setState] = useState<StoryState>(EMPTY_STORY);
  const [note, setNote] = useState("Look at the book.");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadStory()
      .then((loaded) => {
        if (!alive) return;
        setState(loaded);
        setNote(hasProgress(loaded) ? "Saved book loaded." : "Look at the book.");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the book.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveStory(state).catch(() => setNote("Could not save the book."));
  }, [ready, state]);

  if (!ready && note === "Look at the book.") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the book</Text>
        </View>
      </SafeAreaView>
    );
  }

  function apply(result: { state: StoryState; note: string }) {
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Bedtime Book</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{storyStatus(state)}</Text>
        <Text style={styles.line}>{storyLine(state)}</Text>
        <View style={styles.row}>
          <BigButton label="Turn lamp on" inRow onPress={() => apply(turnLampOn(state))} />
          <BigButton label="Turn lamp off" inRow onPress={() => apply(turnLampOff(state))} />
        </View>
        <View style={styles.row}>
          <BigButton label="Open the book" inRow onPress={() => apply(openBook(state))} />
          <BigButton label="Shut the book" inRow onPress={() => apply(shutBook(state))} />
        </View>
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New book" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetStory();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New book canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3EBD8" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#2A241C" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  title: { fontSize: 34, fontWeight: "800", color: "#2A241C" },
  note: { fontSize: 18, color: "#5C5144", minHeight: 24 },
  count: { fontSize: 22, fontWeight: "700", color: "#2A241C" },
  line: { fontSize: 36, fontWeight: "800", color: "#C47A1A", lineHeight: 42 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2A241C",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#2A241C" },
  buttonText: { fontSize: 18, fontWeight: "800", color: "#2A241C", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
