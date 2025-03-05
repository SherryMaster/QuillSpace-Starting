import './App.css'
import Greet from './Quill/ReactFundamentals/Greet';
import { jvascript_dsa_timestamps, react_part_1_timestamps, react_part_2_timestamps, react_part_3_timestamps, react_part_4_timestamps, typescript_timestamps } from './Quill/timestamps';
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
        title='YT video'
        type="Media"
        mediaType='Video' 
        multiVideo={{
          urls: [
            'https://www.youtube.com/watch?v=wBtPGnVnA9g',
            'https://www.youtube.com/watch?v=zeCDuo74uzA',
            'https://www.youtube.com/watch?v=qnwFpjIqsrA',
            'https://www.youtube.com/watch?v=futeaowy34Y',
            'https://www.youtube.com/watch?v=-Qnf2bME-rE',
            'https://www.youtube.com/watch?v=znZQFzoV3CM',
          ],
          titles: [
            'JavaScript DSA Complete Course',
            'TypeScript Complete Course',
            'React Mastery (Part 1/4)',
            'React Mastery (Part 2/4)',
            'React Mastery (Part 3/4)',
            'React Mastery (Part 4/4)',
          ],
          timestamps: [
            jvascript_dsa_timestamps,
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
