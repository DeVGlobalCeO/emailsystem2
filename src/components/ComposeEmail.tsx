import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { 
  X, Send, Bold, Italic, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
  Strikethrough, Undo, Redo, Quote
} from 'lucide-react';

interface ComposeEmailProps {
  onClose: () => void;
  onSend: (to: string, subject: string, body: string) => Promise<void>;
}

export default function ComposeEmail({ onClose, onSend }: ComposeEmailProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || !editor) return;

    try {
      setSending(true);
      const htmlContent = editor.getHTML();
      await onSend(to, subject, htmlContent);
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
      // Handle error (show message to user)
    } finally {
      setSending(false);
    }
  };

  const ToolbarButton = ({ 
    icon: Icon, 
    isActive = false, 
    onClick 
  }: { 
    icon: typeof Bold;
    isActive?: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 ${
        isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
      }`}
    >
      <Icon size={18} />
    </button>
  );

  const addLink = () => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 w-[800px] bg-white rounded-t-lg shadow-xl border">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">New Message</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border rounded-md">
            <div className="border-b p-2 flex items-center gap-1 flex-wrap">
              <ToolbarButton
                icon={Bold}
                isActive={editor?.isActive('bold')}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              />
              <ToolbarButton
                icon={Italic}
                isActive={editor?.isActive('italic')}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              />
              <ToolbarButton
                icon={Strikethrough}
                isActive={editor?.isActive('strike')}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
              />
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <ToolbarButton
                icon={List}
                isActive={editor?.isActive('bulletList')}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              />
              <ToolbarButton
                icon={ListOrdered}
                isActive={editor?.isActive('orderedList')}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              />
              <ToolbarButton
                icon={Quote}
                isActive={editor?.isActive('blockquote')}
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              />
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <ToolbarButton
                icon={AlignLeft}
                isActive={editor?.isActive({ textAlign: 'left' })}
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              />
              <ToolbarButton
                icon={AlignCenter}
                isActive={editor?.isActive({ textAlign: 'center' })}
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              />
              <ToolbarButton
                icon={AlignRight}
                isActive={editor?.isActive({ textAlign: 'right' })}
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              />
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <ToolbarButton
                icon={LinkIcon}
                isActive={editor?.isActive('link')}
                onClick={addLink}
              />
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <ToolbarButton
                icon={Undo}
                onClick={() => editor?.chain().focus().undo().run()}
              />
              <ToolbarButton
                icon={Redo}
                onClick={() => editor?.chain().focus().redo().run()}
              />
            </div>
            
            <EditorContent 
              editor={editor} 
              className="min-h-[300px] p-4 prose max-w-none focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={20} />
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}