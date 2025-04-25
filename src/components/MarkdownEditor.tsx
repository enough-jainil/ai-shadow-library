
import React, { useEffect, useRef } from 'react';
import { Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { commonmark } from '@milkdown/preset-commonmark';
import { ReactEditor, useEditor } from '@milkdown/react';
import { useTheme } from '@/providers/ThemeProvider';

interface MarkdownEditorProps {
  content: string;
  onChange: (markdown: string) => void;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<Editor>();

  const { editor } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .config(nord)
      .use(commonmark)
      .onCreate((ctx) => {
        editorRef.current = ctx.get();
        ctx.get().action((ctx) => {
          const content = ctx.get().state.doc.textContent;
          onChange(content);
        });
      })
  );

  useEffect(() => {
    if (editor && content) {
      editor.action((ctx) => {
        const view = ctx.get().view;
        if (view.state.doc.textContent !== content) {
          onChange(content);
        }
      });
    }
  }, [editor, content, onChange]);

  return (
    <div className={`rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4`}>
      <ReactEditor />
    </div>
  );
}
