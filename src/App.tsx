import './App.css'
import Greet from './Quill/ReactFundamentals/Greet';
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
        url="https://www.youtube.com/watch?v=qnwFpjIqsrA"
        timestamps={`
          00:00 - Trailer
          1:21 - Intro
          3:44 - My Personal Request
          4:36 - Course Requirements
          5:52 - What is React.js?
          7:32 - Course Setup
          9:01 - Files & Folder Structure
          12:15 - Removing Unnecessary stuff
          13:38 - What is Component?
          15:03 - Component Syntax
          15:30 - Creating First Component
          18:52 - Components Challenges
          23:31 - Multiple Components
          25:56 - Multiple Components Challenge
          30:01 - What Is JSX
          30:43 - Writing JSX
          33:45 - JSX Challenges
          35:03 - JSX Rules
          39:41 - JSX Rules Challenge
          41:35 - Expressions In JSX
          42:37 - Embedding Dynamic Content
          47:54 - Embedding Dynamic Content Challenge
          50:56 - Lists In React.js
          51:42 - Rendering Lists Of Data
          59:11 - Rendering List Of Data Challenges
          1:04:14 - What are Props in React.js
          1:05:39 - Props In Action
          1:11:32 - Props Challenges
          1:15:20 - Children Props
          1:17:13 - What is Conditional Rendering In React
          1:18:57 - Conditional Rendering In Action
          1:24:23 - Conditional Rendering Challenges
          1:31:18 - Let's Talk About Styling
          1:38:40 - Styling Challenges
          1:44:29 - What are Events In React.js
          1:48:55 - State & Hooks Introduction
          1:50:45 - State In Action
          2:11:14 - Passing Function To useState
          2:18:33 - useState Challanges
          2:35:53 - What is React Portal
          2:36:30 - React Portal In Action
          2:43:32 - Advance Keys
          2:46:52 - What is useEffect
          2:48:47 - useEffect In Action
          3:01:18 - useEffect Challenges
          3:07:05 - What is Prop Drilling
          3:08:33 - Prop Drilling In Action
          3:10:45 - What is Context API
          3:11:18 - Context API In Action
          3:17:16 - What is useContext Hook
          3:19:21 - useContext Challenge
          3:27:02 - What is useReducer
          3:28:44 - useReducer In Action
          3:35:58 - useReducer Hook Challenges
          3:43:40 - What is useRef 
          3:44:07 - useRef In Action
          3:47:20 - useRef Challenges
          3:51:59 - Custom Hooks Introduction
          3:53:26 - Custom Hooks In Action
          3:58:08 - What is useId
          3:58:21 - useId In Action
          4:01:42 - 10 Project For Beginners Setup
          4:02:53 - Beginners Project 1
          4:05:49 - Beginners Project 2
          4:12:18 - Beginners Project 3
          4:17:33 - Beginners Project 4
          4:24:39 - Beginners Project 5
          4:30:00 - Beginners Project 6
          4:33:32 - Beginners Project 7
          4:38:36 - Beginners Project 8
          4:43:26 - Beginners Project 9
          4:55:41 - Beginners Project 10
          6:45:00 - React With TypeScript Setup
          6:46:55 - Types For Props
          6:55:16 - Types For Props Challenges
          6:58:08  - Reusable Types For Components
          7:05:14 - Reusable Types For Components Challenge
          7:11:26 - useState Types
          7:13:35 - useState Types Challenge
          7:24:39 - useRef, Forms, Events Types
          7:32:41 - useRef, Forms, Events Types Challenges
          7:42:45 - Types For Context API
          7:48:16 - Types For useReducer
          7:51:58 -  Types For useReducer Challenges
          7:56:29 - Types For useEffect
          8:01:12 - React with TailwindCSS
          8:04:42 - Types For useEffect Challenge
          8:10:15 - React With DaisyUI
          8:14:26 - React with Radix UI
          8:17:15 - React With ShadcnUI
          8:23:20 - React Hooks Form Setup
          8:24:22 - React Hooks Form Basics
          8:35:24 - React Hooks Form Advance Project
          8:45:30 - Welcome To React 19
          8:48:15 - React 19 Setup
          8:50:14 - What is USE In React 19
          8:50:55 - USE For Fetching Data
          8:55:06 - USE With Context
          8:58:24 - React 19 Actions
          8:58:43 - Let's write some actions
          9:04:38 - useFormStatus Hook In React 19
          9:05:02 - useFormStatus In Action
          9:10:52 - useActionState Hook In React 19
          9:11:47 - useActionState Hook In Action
          9:17:23 - useTransition Hook In React 19
          9:25:24 - React with TypeScript Project 1
          9:55:22 - React with TypeScript Project 2
          10:37:50 - React with TypeScript Project 3
          11:21:20 - React with TypeScript Project 4
          12:41:45 - Outro
          `}>
          
      </ContentBlock>   {/* You tube video */}

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
