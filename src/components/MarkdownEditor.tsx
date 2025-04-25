
import React, { useEffect, useState } from 'react';
import { Editor } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { commonmark } from '@milkdown/preset-commonmark';
import { useEditor } from '@milkdown/react';
import { useTheme } from '@/providers/ThemeProvider';
import { rootCtx } from '@milkdown/core';

interface MarkdownEditorProps {
  content: string;
  onChange: (markdown: string) => void;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const { theme } = useTheme();
  const [editorReady, setEditorReady] = useState(false);
  const [initialContent] = useState(content || '');

  // Initialize the editor
  const { get, state, loading } = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(nord)
      .use(commonmark);
  });

  // Set initial content when editor is ready
  useEffect(() => {
    if (!loading && get && initialContent) {
      // Wait for editor to be fully initialized
      setTimeout(() => {
        const editor = get();
        if (editor) {
          // Mark the editor as ready
          setEditorReady(true);
        }
      }, 100);
    }
  }, [loading, get, initialContent]);

  // Listen for content changes
  useEffect(() => {
    if (!loading && get && editorReady) {
      const editor = get();
      if (editor) {
        const listener = () => {
          editor.action((ctx) => {
            const doc = ctx.get().state.doc;
            const newContent = doc.textContent;
            
            if (newContent !== content) {
              onChange(newContent);
            }
          });
        };
        
        editor.on('update', listener);
        
        return () => {
          editor.off('update', listener);
        };
      }
    }
  }, [loading, get, editorReady, content, onChange]);

  return (
    <div 
      className={`rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4`}
    >
      <div className="milkdown" />
    </div>
  );
}
