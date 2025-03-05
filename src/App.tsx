import './App.css'
import { ContentBlock } from "./components/contentblock/ContentBlock";
import { ThemedInteractiveContentLayout } from "./components/layout/ThemedInteractiveContentLayout";
import { GlossaryEntry } from "@/types/glossary";

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
      <ContentBlock
        type="Glossary"
        title="Programming Terms"
        color="indigo"
        dictionary={{
          "API": {
            definition: "Application Programming Interface - a set of rules that allow programs to talk to each other",
            category: "Web Development",
            tags: ["backend", "integration"]
          },
          "DOM": {
            definition: "Document Object Model - the data representation of objects that comprise the structure and content of a document on the web",
            category: "Web Development",
            tags: ["frontend", "browser"]
          },
          "JWT": {
            definition: "JSON Web Token - a compact URL-safe means of representing claims to be transferred between two parties",
            category: "Security",
            tags: ["authentication", "backend"]
          },
          "HTML": {
            definition: "HyperText Markup Language - the standard markup language for creating web pages",
            category: "Frontend",
            tags: ["markup", "frontend"]
          },
          "CSS": {
            definition: "Cascading Style Sheets - a style sheet language used for describing the presentation of a document written in HTML",
            category: "Frontend",
            tags: ["styling", "frontend"]
          },
          "JavaScript": {
            definition: "A programming language that enables interactive web pages and is an essential part of web applications",
            category: "Programming Languages",
            tags: ["frontend", "backend", "language"]
          },
          "React": {
            definition: "A JavaScript library for building user interfaces, particularly single page applications",
            category: "Frontend Frameworks",
            tags: ["frontend", "javascript", "framework"]
          },
          "TypeScript": {
            definition: "A strict syntactical superset of JavaScript that adds optional static typing to the language",
            category: "Programming Languages",
            tags: ["javascript", "language", "typing"]
          },
          "Node.js": {
            definition: "A cross-platform, open-source server environment that executes JavaScript code outside a web browser",
            category: "Backend",
            tags: ["javascript", "backend", "server"]
          },
          "SQL": {
            definition: "Structured Query Language - a domain-specific language used in programming and designed for managing data held in a relational database management system",
            category: "Database",
            tags: ["database", "backend", "query"]
          },
          "Git": {
            definition: "A distributed version-control system for tracking changes in source code during software development",
            category: "Version Control",
            tags: ["versioning", "development", "source control"]
          },
          "REST": {
            definition: "Representational State Transfer - an architectural style for distributed hypermedia systems",
            category: "Web Development",
            tags: ["architecture", "backend", "api"]
          },
          "GraphQL": {
            definition: "A query language for APIs and a runtime for fulfilling those queries with existing data",
            category: "Web Development",
            tags: ["api", "query language", "backend"]
          }
        }}
        searchPlaceholder="Search programming terms..."
        initialSort="asc"
      />
    </ThemedInteractiveContentLayout>
  );
}

export default App;
