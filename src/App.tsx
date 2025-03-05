import './App.css'
import Greet from './Quill/ReactFundamentals/Greet';
import { javascript_dsa_timestamps, jvascript_timestamps as javascript_timestamps, react_part_1_timestamps, react_part_2_timestamps, react_part_3_timestamps, react_part_4_timestamps, typescript_timestamps } from './Quill/timestamps';
import { ContentBlock } from "./components/contentblock/ContentBlock";
import { ThemedInteractiveContentLayout } from "./components/layout/ThemedInteractiveContentLayout";


function App() {

  return (
    <ThemedInteractiveContentLayout
      title="The Ultimate Interactive 'React' Notes"
      titleBG="blue"
      subtitle="A Modern way of making notes with QuillSpace"
      emphasizedColors="cyan"
    >
      <ContentBlock
        title='From JS Noob to React Monster - Full Series'
        subtitle='Contains 6 courses that will take you from a complete beginner to a React expert.'
        type="Media"
        mediaType='Video' 
        multiVideo={{
          urls: [
            'https://www.youtube.com/watch?v=H3XIJYEPdus',
            'https://www.youtube.com/watch?v=wBtPGnVnA9g',
            'https://www.youtube.com/watch?v=zeCDuo74uzA',
            'https://www.youtube.com/watch?v=qnwFpjIqsrA',
            'https://www.youtube.com/watch?v=futeaowy34Y',
            'https://www.youtube.com/watch?v=-Qnf2bME-rE',
            'https://www.youtube.com/watch?v=znZQFzoV3CM',
          ],
          titles: [
            'JavaScript Complete Course',
            'JavaScript DSA Complete Course',
            'TypeScript Complete Course',
            'React Mastery (Part 1/4)',
            'React Mastery (Part 2/4)',
            'React Mastery (Part 3/4)',
            'React Mastery (Part 4/4)',
          ],
          timestamps: [
            javascript_timestamps,
            javascript_dsa_timestamps,
            typescript_timestamps,
            react_part_1_timestamps,
            react_part_2_timestamps,
            react_part_3_timestamps,
            react_part_4_timestamps,
          ]          
        }}
      /> {/* YouTube video */}

      <ContentBlock
        title='1: React Fundamentals'
        type="Classic"
      >
        <ContentBlock
          title='Greet Component'
          type='Generic'
        >
          <Greet />      
        </ContentBlock>
      </ContentBlock>


    </ThemedInteractiveContentLayout>
  );
}

export default App;
