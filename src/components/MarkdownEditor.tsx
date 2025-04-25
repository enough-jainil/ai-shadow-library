
import React, { useEffect, useRef } from 'react';
import { Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { commonmark } from '@milkdown/preset-commonmark';
import { useEditor } from '@milkdown/react';
import { useTheme } from '@/providers/ThemeProvider';

interface MarkdownEditorProps {
  content: string;
  onChange: (markdown: string) => void;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<Editor>();

  const { get, state } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .config(nord)
      .use(commonmark)
      .create()
  );

  useEffect(() => {
    if (get && content) {
      const editor = get();
      if (editor) {
        editor.action((ctx) => {
          const currentContent = ctx.get().state.doc.textContent;
          if (currentContent !== content) {
            onChange(content);
          }
        });
      }
    }
  }, [get, content, onChange]);

  useEffect(() => {
    if (get) {
      const editor = get();
      if (editor) {
        editor.action((ctx) => {
          ctx.get().state.doc.content.forEach(() => {
            const currentContent = ctx.get().state.doc.textContent;
            onChange(currentContent);
          });
        });
      }
    }
  }, [get, onChange]);

  return (
    <div className={`rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4`}>
      <div className="milkdown-editor" />
    </div>
  );
}
