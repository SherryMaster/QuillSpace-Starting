import './App.css'
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
        url="https://www.youtube.com/watch?v=M9O5AjEFzKw"
        timestamps={`
          00:00 - Intro
          4:31 - React Fundamentals
          2:45:30 - React Hooks
          4:00:22 - React Projects For Beginners
          6:43:39 - TypeScript Complete Course
          10:12:04 - React With TypeScript
          11:38:02 - Popular Component Libraries
          11:51:08 - React Hook Form
          12:13:17 - React 19 Features
          16:17:25 - Framer Motion
          21:37:27 - Zustand
          26:08:14 - Redux Toolkit
          27:25:58 - React Design Patterns
          32:02:11 - TanStack Query
          33:13:19 - Unit Testing
          35:15:21 - React Testing
          37:10:25 - React Design System
          37:41:12 - React Storybook
          38:51:49 - Useful Packages For Design System
          39:21:59 - Building Component Library
          42:11:32 - React Monorepos
          42:25:30 - Building Complete Design System For Company
          43:22:40 - FullStack Project
          50:31:53 - Outro
          `}>
          
      </ContentBlock>   {/* You tube video */}

      <ContentBlock
        title='1: React Fundamentals'
        type="Classic"
      >
        <ContentBlock
          title='What is React?'
          type="Note"
          noteType="primary"
          content="React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications."
        />
      </ContentBlock>
      <p className="text-2xl bg-blue-800/40 p-4 rounded-2xl">React is a free and <span className="font-extrabold">open source</span> JavaScript <span className="font-extrabold">library</span> for building <span className="font-extrabold">user interfaces (UIs)</span>.</p>


    </ThemedInteractiveContentLayout>
  );
}

export default App;
