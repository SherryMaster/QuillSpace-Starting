import './App.css'
import { ContentBlock } from "./components/contentblock/ContentBlock";
import { ThemedInteractiveContentLayout } from "./components/layout/ThemedInteractiveContentLayout";
import { removeCommonIndentation } from "./utils/common";

function App() {
  return (
    <ThemedInteractiveContentLayout
      title="The Ultimate 'QuillSpace' Guide"
      titleBG="dark"
      subtitle="A comprehensive guide to creating interactive documentation with the Notes framework."
      emphasizedColors="blue"
    >
      <ContentBlock type="Classic" title="Introduction">
        <p className="text-lg text-muted-foreground">Welcome to our comprehensive guide!</p>
        <ContentBlock 
          title='YT video'
          type="Media"
          mediaType="Video"
          url='https://www.youtube.com/embed/M9O5AjEFzKw?si=sMyacVp0YCUrUoTM'
        >
          00:00 - Intro<br></br>
          4:31 - React Fundamentals<br></br>
          2:45:30 - React Hooks<br></br>
          4:00:22 - React Projects For Beginners<br></br>
          6:43:39 - TypeScript Complete Course<br></br>
          10:12:04 - React With TypeScript<br></br>
          11:38:02 - Popular Component Libraries<br></br>
          11:51:08 - React Hook Form<br></br>
          12:13:17 - React 19 Features<br></br>
          16:17:25 - Framer Motion<br></br>
          21:37:27 - Zustand<br></br>
          26:08:14 - Redux Toolkit<br></br>
          27:25:58 - React Design Patterns<br></br>
          32:02:11 - TanStack Query<br></br>
          33:13:19 - Unit Testing<br></br>
          35:15:21 - React Testing<br></br>
          37:10:25 - React Design System<br></br>
          37:41:12 - React Storybook<br></br>
          38:51:49 - Useful Packages For Design System<br></br>
          39:21:59 - Building Component Library<br></br>
          42:11:32 - React Monorepos<br></br>
          42:25:30 - Building Complete Design System For Company<br></br>
          43:22:40 - FullStack Project<br></br>
          50:31:53 - Outro<br></br>
        </ContentBlock>
        <ContentBlock 
          type="Generic" 
          title="Generic Block"
        >
          <p>This is a generic block.</p>
        </ContentBlock>

        <ContentBlock type="Note" title="Important Note" noteType="critical" content="This is a critical note.">
        </ContentBlock>

        <ContentBlock type="FileStructureView" title="Project Structure" filestructure={{
          "src": {
            "index.js": "Main entry point",
            "components": {
              "Button.js": "Button component",
              "Input.js": "Input component"
            }
          },
          "public": {
            "index.html": "HTML template"
          }
        }}/>

        <ContentBlock type="Challenge" title="Coding Challenge" challengeType="Exercise" difficulty="Intermediate">
          <p>Complete this coding exercise.</p>
        </ContentBlock>

        <ContentBlock type="Challenge" title="Project: Todo App" challengeType="Project" difficulty="Beginner" tech={["React", "TypeScript"]} estimatedTime="2 hours">
          <p>Build a simple Todo application.</p>
        </ContentBlock>

        <ContentBlock type="Code" title="Example Code" code="console.log('Hello, World!');" extension="js" >

        <ContentBlock type="Markdown" title="Markdown Content" content={removeCommonIndentation(`
          # Heading 1
          ## Heading 2
          ### Heading 3
          #### Heading 4
          ##### Heading 5
          ###### Heading 6
          This is a paragraph.
          - Bullet point 1
          - Bullet point 2
          \`\`\`javascript
          console.log('Hello, World!');
          \`\`\`
        `)}
        />
      </ContentBlock>
      </ContentBlock>
      
    </ThemedInteractiveContentLayout>
  );
}

export default App;
