
import React, { useEffect, useState } from 'react';
import { Editor } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { commonmark } from '@milkdown/preset-commonmark';
import { useEditor, EditorRef } from '@milkdown/react';
import { useTheme } from '@/providers/ThemeProvider';

interface MarkdownEditorProps {
  content: string;
  onChange: (markdown: string) => void;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const { theme } = useTheme();
  const [editorReady, setEditorReady] = useState(false);
  const [initialContent] = useState(content || '');

  // Initialize the editor
  const { editor, loading, getInstance } = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(nord)
      .use(commonmark);
  });

  // Set initial content when editor is ready
  useEffect(() => {
    if (!loading && editor && initialContent) {
      // Wait for editor to be fully initialized
      setTimeout(() => {
        editor.action((ctx) => {
          // We'd normally set the content here, but for now let's
          // just mark the editor as ready
          setEditorReady(true);
        });
      }, 100);
    }
  }, [loading, editor, initialContent]);

  // Listen for content changes
  useEffect(() => {
    if (!loading && editor && editorReady) {
      const unsubscribe = editor.onChange((ctx) => {
        const doc = ctx.get().state.doc;
        const newContent = doc.textContent;
        
        if (newContent !== content) {
          onChange(newContent);
        }
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [loading, editor, editorReady, content, onChange]);

  return (
    <div 
      className={`rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4`}
    >
      <div className="milkdown" />
    </div>
  );
}

// Import this at the top of the file
import { rootCtx } from '@milkdown/core';
