import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatPanelContainer = styled(Paper)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
});

const ChatHeader = styled(Box)({
  padding: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
});

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const Message = styled(Box)<{ isUser?: boolean }>(({ isUser }) => ({
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? '#0F5EAA' : '#f5f5f5',
  color: isUser ? '#ffffff' : '#000000',
  padding: '8px 12px',
  borderRadius: '12px',
  borderBottomRightRadius: isUser ? '4px' : '12px',
  borderBottomLeftRadius: isUser ? '12px' : '4px',
}));

const InputContainer = styled(Box)({
  padding: '16px',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
});

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

interface ChatPanelProps {
  onCreateFlow?: (nodes: string[]) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onCreateFlow }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I can help you create and connect nodes using natural language.',
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Parse flow creation command
    if (input.includes('->')) {
      const nodes = input.split('->').map((node) => node.trim());
      if (onCreateFlow) {
        onCreateFlow(nodes);
      }

      // Add success response
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: `Created flow with nodes: ${nodes.join(' -> ')}`,
          isUser: false,
        };
        setMessages((prev) => [...prev, response]);
      }, 1000);
    } else {
      // Regular chat response
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: 'I understand you want to create a flow. You can describe it like: "Node1 -> Node2 -> Node3"',
          isUser: false,
        };
        setMessages((prev) => [...prev, response]);
      }, 1000);
    }

    setInput('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatPanelContainer>
      <ChatHeader>
        <Typography variant="h6">Chat Assistant</Typography>
      </ChatHeader>
      <MessagesContainer>
        {messages.map((message) => (
          <Message key={message.id} isUser={message.isUser}>
            <Typography variant="body2">{message.text}</Typography>
          </Message>
        ))}
      </MessagesContainer>
      <InputContainer>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSend} disabled={!input.trim()}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </InputContainer>
    </ChatPanelContainer>
  );
};

export default ChatPanel;
