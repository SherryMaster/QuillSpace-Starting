import './App.css'
import { ContentBlock } from "./components/contentblock/ContentBlock";
import { ThemedInteractiveContentLayout } from "./components/layout/ThemedInteractiveContentLayout";

function App() {
  return (
    <ThemedInteractiveContentLayout
      title="The Ultimate 'QuillSpace' Starting Point"
      titleBG="indigo"
      subtitle="A Modern way of making notes with QuillSpace"
      emphasizedColors="blue"
    >
      <h1 className="text-4xl font-extrabold my-6 pb-2 border-b border-border">
        Your Awesome content Here!
      </h1>
    </ThemedInteractiveContentLayout>
  );
}

export default App;
