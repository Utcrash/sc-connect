import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, TextField, IconButton, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatContainer = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
});

const ChatHeader = styled(Typography)({
  marginBottom: '16px',
  fontWeight: 'bold',
});

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  marginBottom: '16px',
});

const MessageBubble = styled(Paper)<{ isUser?: boolean }>(
  ({ isUser, theme }) => ({
    padding: '8px 12px',
    marginBottom: '8px',
    maxWidth: '80%',
    width: 'fit-content',
    backgroundColor: isUser
      ? theme.palette.primary.main
      : theme.palette.grey[200],
    color: isUser
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    alignSelf: isUser ? 'flex-end' : 'flex-start',
  })
);

const InputContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
});

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatBotProps {
  onPromptSubmit: (prompt: string) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onPromptSubmit }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: input,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Handle flow creation if input matches the pattern
    if (input.includes('->')) {
      onPromptSubmit(input);
    }

    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        text: 'Flow has been created based on your input.',
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader variant="h6">Flow Assistant</ChatHeader>
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble key={index} isUser={message.isUser}>
            <Typography>{message.text}</Typography>
          </MessageBubble>
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
          placeholder="Type your message... (e.g., 'Node1 -> Node2 -> Node3')"
          variant="outlined"
          size="small"
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatBot;
