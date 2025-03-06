import './App.css'
import Greet from './Quill/ReactFundamentals/Greet';
import * as TimeStamps from './Quill/timestamps';
import { ContentBlock } from "./components/contentblock/ContentBlock";
import { ThemedInteractiveContentLayout } from "./components/layout/ThemedInteractiveContentLayout";


function App() {

  return (
    <ThemedInteractiveContentLayout
      title="The Ultimate 'Course' Collection"
      titleBG="blue"
      subtitle="My curated Courses from Youtube with Awesome Timestamps"
      emphasizedColors="indigo"
    >
      <ContentBlock
        title='From JS Noob to JS DSA Master and TypeScript Ninja - Full Series'
        subtitle='Contains 3 courses that will take you from a complete beginner to a expert TypeScript developer with DSA knowledge.'
        type="Media"
        mediaType='Video'
        timestampsColor='cyan' 
        multiVideo={{
          urls: [
            'https://www.youtube.com/watch?v=H3XIJYEPdus',
            'https://www.youtube.com/watch?v=wBtPGnVnA9g',
            'https://www.youtube.com/watch?v=zeCDuo74uzA',
          ],
          titles: [
            'JavaScript Complete Course',
            'JavaScript DSA Complete Course',
            'TypeScript Complete Course',
          ],
          timestamps: [
            TimeStamps.javascript_timestamps,
            TimeStamps.javascript_dsa_timestamps,
            TimeStamps.typescript_timestamps,
          ]          
        }}
      />

<ContentBlock
        title='From JS Noob to React Monster - Full Series'
        subtitle='Contains 6 courses that will take you from a complete beginner to a expert React developer.'
        type="Media"
        mediaType='Video'
        timestampsColor='cyan' 
        multiVideo={{
          urls: [
            'https://www.youtube.com/watch?v=qnwFpjIqsrA',
            'https://www.youtube.com/watch?v=futeaowy34Y',
            'https://www.youtube.com/watch?v=-Qnf2bME-rE',
            'https://www.youtube.com/watch?v=znZQFzoV3CM',
          ],
          titles: [
            'React Mastery (Part 1/4)',
            'React Mastery (Part 2/4)',
            'React Mastery (Part 3/4)',
            'React Mastery (Part 4/4)',
          ],
          timestamps: [
            TimeStamps.react_part_1_timestamps,
            TimeStamps.react_part_2_timestamps,
            TimeStamps.react_part_3_timestamps,
            TimeStamps.react_part_4_timestamps,
          ]          
        }}
      />

    </ThemedInteractiveContentLayout>
  );
}

export default App;
