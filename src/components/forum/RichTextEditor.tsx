import React from 'react';
import { Bold, Italic, List, Image, Paperclip } from 'lucide-react';
import { AttachmentUpload } from './AttachmentUpload';
import { containsProfanity, moderateContent } from '../../services/moderation/profanityFilter';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  userId?: string;
}

export function RichTextEditor({ value, onChange, placeholder, userId }: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);

  const handleCommand = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      if (containsProfanity(content)) {
        const moderatedContent = moderateContent(content);
        editorRef.current.innerHTML = moderatedContent;
        onChange(moderatedContent);
      } else {
        onChange(content);
      }
    }
  };

  const handleAttachmentUpload = (url: string) => {
    if (editorRef.current) {
      if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'max-w-full h-auto';
        editorRef.current.appendChild(img);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = 'View Attachment';
        link.className = 'text-blue-600 hover:underline';
        editorRef.current.appendChild(link);
      }
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex items-center space-x-2 p-2 border-b bg-gray-50">
        <button
          onClick={() => handleCommand('bold')}
          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleCommand('italic')}
          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleCommand('insertUnorderedList')}
          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <AttachmentUpload
          onUpload={handleAttachmentUpload}
          userId={userId || 'demo-user'}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[200px] focus:outline-none"
        placeholder={placeholder}
        onInput={(e) => {
          const content = e.currentTarget.innerText;
          onChange(content);
        }}
      >
        {value}
      </div>
    </div>
  );
}