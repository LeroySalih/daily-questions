"use client"

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import TreeViewPlugIn from "./plugins/TreeViewPlugin";
import MyCustomAutoFocusPlugin from "./plugins/MyCustomAutoFocusPlugin";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import editorConfig from "./editorConfig";
import onChange from "./onChange";
import styles from "./RichEditor.module.css";

export default function Editor() {
  return (
    //@ts-ignore
    <LexicalComposer initialConfig={editorConfig}>
      <div className={styles.editorcontainer}>
        <TreeViewPlugIn />
        <PlainTextPlugin
          contentEditable={<ContentEditable className={styles.editorinput} />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        
        <MyCustomAutoFocusPlugin/>
        
      </div>
    </LexicalComposer>
  );
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>;
}
