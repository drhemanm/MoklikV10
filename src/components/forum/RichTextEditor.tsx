import React from 'react';
import { Bold, Italic, List } from 'lucide-react';
import DOMPurify from 'dompurify';
import { AttachmentUpload } from './AttachmentUpload.js';
import { containsProfanity, moderateContent } from '../../services/moderation/profanityFilter.js';

// Configure DOMPurify to only allow safe HTML tags
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li', 'p', 'br', 'a', 'img'],
  ALLOWED_ATTR: ['href', 'src', 'class', 'className', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'object', 'embed'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
};

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
      // Sanitize content to prevent XSS attacks
      const rawContent = editorRef.current.innerHTML;
      const sanitizedContent = DOMPurify.sanitize(rawContent, DOMPURIFY_CONFIG);

      if (containsProfanity(sanitizedContent)) {
        const moderatedContent = moderateContent(sanitizedContent);
        const finalContent = DOMPurify.sanitize(moderatedContent, DOMPURIFY_CONFIG);
        editorRef.current.innerHTML = finalContent;
        onChange(finalContent);
      } else {
        // Only update if sanitization changed the content
        if (rawContent !== sanitizedContent) {
          editorRef.current.innerHTML = sanitizedContent;
        }
        onChange(sanitizedContent);
      }
    }
  };

  const handleAttachmentUpload = (url: string) => {
    if (editorRef.current) {
      // Sanitize URL to prevent javascript: protocol attacks
      const sanitizedUrl = DOMPurify.sanitize(url);

      if (sanitizedUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const img = document.createElement('img');
        img.src = sanitizedUrl;
        img.className = 'max-w-full h-auto';
        editorRef.current.appendChild(img);
      } else {
        const link = document.createElement('a');
        link.href = sanitizedUrl;
        link.textContent = 'View Attachment';
        link.className = 'text-blue-600 hover:underline';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        editorRef.current.appendChild(link);
      }
      const sanitizedContent = DOMPurify.sanitize(editorRef.current.innerHTML, DOMPURIFY_CONFIG);
      onChange(sanitizedContent);
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
        onInput={(e) => {
          // Sanitize content on input to prevent XSS
          const rawContent = e.currentTarget.innerHTML;
          const sanitizedContent = DOMPurify.sanitize(rawContent, DOMPURIFY_CONFIG);
          onChange(sanitizedContent);
        }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value, DOMPURIFY_CONFIG) }}
      />
    </div>
  );
}