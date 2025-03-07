import "./App.css";
import Counter from "./Quill/ReactFundamentals/useReducerChallenge/Counter";
import * as TimeStamps from "./Quill/timestamps";
import { ContentBlock } from "./components/contentblock/ContentBlock";
import { ThemedInteractiveContentLayout } from "./components/layout/ThemedInteractiveContentLayout";

function App() {
  return (
    <ThemedInteractiveContentLayout
      title="The Ultimate 'Web Dev' Master Course"
      titleBG="blue"
      subtitle="My curated Courses from Youtube with Awesome Timestamps"
      emphasizedColors="indigo"
    >
      <ContentBlock
        title="React Monster - Full Series"
        subtitle="Contains 6 courses that will take you from a complete beginner to a expert React developer."
        type="Media"
        mediaType="Video"
        timestampsColor="cyan"
        multiVideo={{
          urls: [
            "https://www.youtube.com/watch?v=qnwFpjIqsrA",
            "https://www.youtube.com/watch?v=futeaowy34Y",
            "https://www.youtube.com/watch?v=-Qnf2bME-rE",
            "https://www.youtube.com/watch?v=znZQFzoV3CM",
          ],
          titles: [
            "React Mastery (Part 1/4)",
            "React Mastery (Part 2/4)",
            "React Mastery (Part 3/4)",
            "React Mastery (Part 4/4)",
          ],
          timestamps: [
            TimeStamps.react_part_1_timestamps,
            TimeStamps.react_part_2_timestamps,
            TimeStamps.react_part_3_timestamps,
            TimeStamps.react_part_4_timestamps,
          ],
        }}
      >
      <ContentBlock title="useReducer Challenge" type="Generic" subtitle="A counter with increment decrement and reset using useReducer Hook.">
        <Counter />
      </ContentBlock>
      </ContentBlock>

    </ThemedInteractiveContentLayout>
  );
}

export default App;
