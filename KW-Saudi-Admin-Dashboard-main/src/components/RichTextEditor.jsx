import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import {
  Box,
  Paper,
  ButtonGroup,
  Button,
  Divider,
  Typography
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Title
} from '@mui/icons-material';

const RichTextEditor = ({ value, onChange, label, placeholder, error, helperText }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading.configure({
        levels: [1, 2, 3]
      }),
      BulletList,
      OrderedList
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        style: 'min-height: 120px; padding: 12px; outline: none; font-family: "Roboto", "Helvetica", "Arial", sans-serif; font-size: 16px; line-height: 1.5;'
      }
    }
  });

  const handleButtonClick = (action, options = {}) => {
    if (!editor) return;
    
    editor.chain().focus()[action](options).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <Box>
      {label && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            display: 'block',
            mb: 1,
            fontSize: '0.75rem'
          }}
        >
          {label}
        </Typography>
      )}
      
      <Paper 
        variant="outlined" 
        sx={{ 
          border: error ? '2px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: 1,
          '&:hover': {
            borderColor: error ? '#d32f2f' : 'rgba(0, 0, 0, 0.87)'
          },
          '&:focus-within': {
            borderColor: error ? '#d32f2f' : 'primary.main',
            borderWidth: '2px'
          }
        }}
      >
        {/* Toolbar */}
        <Box sx={{ p: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <ButtonGroup size="small" variant="outlined">
            {/* Text formatting */}
            <Button
              onClick={() => handleButtonClick('toggleBold')}
              color={editor.isActive('bold') ? 'primary' : 'inherit'}
              title="Bold"
            >
              <FormatBold fontSize="small" />
            </Button>
            <Button
              onClick={() => handleButtonClick('toggleItalic')}
              color={editor.isActive('italic') ? 'primary' : 'inherit'}
              title="Italic"
            >
              <FormatItalic fontSize="small" />
            </Button>
            <Button
              onClick={() => handleButtonClick('toggleUnderline')}
              color={editor.isActive('underline') ? 'primary' : 'inherit'}
              title="Underline"
            >
              <FormatUnderlined fontSize="small" />
            </Button>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            {/* Headings */}
            <Button
              onClick={() => handleButtonClick('toggleHeading', { level: 1 })}
              color={editor.isActive('heading', { level: 1 }) ? 'primary' : 'inherit'}
              title="Heading 1"
              sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}
            >
              H1
            </Button>
            <Button
              onClick={() => handleButtonClick('toggleHeading', { level: 2 })}
              color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'inherit'}
              title="Heading 2"
              sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}
            >
              H2
            </Button>
            <Button
              onClick={() => handleButtonClick('toggleHeading', { level: 3 })}
              color={editor.isActive('heading', { level: 3 }) ? 'primary' : 'inherit'}
              title="Heading 3"
              sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}
            >
              H3
            </Button>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            {/* Lists */}
            <Button
              onClick={() => handleButtonClick('toggleBulletList')}
              color={editor.isActive('bulletList') ? 'primary' : 'inherit'}
              title="Bullet List"
            >
              <FormatListBulleted fontSize="small" />
            </Button>
            <Button
              onClick={() => handleButtonClick('toggleOrderedList')}
              color={editor.isActive('orderedList') ? 'primary' : 'inherit'}
              title="Numbered List"
            >
              <FormatListNumbered fontSize="small" />
            </Button>
          </ButtonGroup>
        </Box>

        {/* Editor Content */}
        <Box 
          sx={{ 
            '& .ProseMirror': {
              minHeight: '120px',
              maxHeight: '300px',
              overflowY: 'auto',
              '& p': {
                margin: '0.5em 0',
                '&:first-of-type': {
                  marginTop: 0
                },
                '&:last-of-type': {
                  marginBottom: 0
                }
              },
              '& h1': {
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0.5em 0'
              },
              '& h2': {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                margin: '0.5em 0'
              },
              '& h3': {
                fontSize: '1.1rem',
                fontWeight: 'bold',
                margin: '0.5em 0'
              },
              '& ul, & ol': {
                paddingLeft: '1.5rem',
                margin: '0.5em 0'
              },
              '& li': {
                marginBottom: '0.25em'
              },
              '& strong': {
                fontWeight: 'bold'
              },
              '& em': {
                fontStyle: 'italic'
              },
              '& u': {
                textDecoration: 'underline'
              },
              '&:focus': {
                outline: 'none'
              },
              '&.ProseMirror-focused': {
                outline: 'none'
              }
            }
          }}
        >
          <EditorContent 
            editor={editor} 
            placeholder={placeholder}
          />
        </Box>
      </Paper>
      
      {(error || helperText) && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: error ? 'error.main' : 'text.secondary',
            display: 'block',
            mt: 0.5,
            fontSize: '0.75rem',
            lineHeight: 1.66
          }}
        >
          {error ? helperText : helperText}
        </Typography>
      )}
    </Box>
  );
};

export default RichTextEditor;