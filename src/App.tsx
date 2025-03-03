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
        <ContentBlock type="Generic" title="Generic Block">
        <p>This is a generic block.</p>
        </ContentBlock>

        <ContentBlock type="Note" title="Important Note" noteType="primary" content="This is a primary note.">
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
        }} />

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
