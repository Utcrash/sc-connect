import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import ChatHistory from './ChatHistory';

const ChatPanelContainer = styled(Paper)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
});

const ChatHeader = styled(Box)({
  padding: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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
  '& .Mui-disabled': {
    backgroundColor: '#f5f5f5',
    cursor: 'not-allowed',
    '& .MuiInputBase-input': {
      color: '#999',
    },
  },
});

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

interface Conversation {
  id: string;
  timestamp: number;
  messages: ChatMessage[];
}

interface ChatPanelProps {
  onCreateFlow?: (nodes: string[]) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onCreateFlow }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] =
    useState<string>('');
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  // Initialize new conversation if none exists
  useEffect(() => {
    if (!currentConversationId && !isViewingHistory) {
      startNewConversation();
    }
  }, [currentConversationId, isViewingHistory]);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  const startNewConversation = () => {
    const newConversationId = Date.now().toString();
    setCurrentConversationId(newConversationId);
    const initialMessage = {
      id: '1',
      text: 'Hi! I can help you create and connect nodes using natural language.',
      isUser: false,
    };
    setMessages([initialMessage]);
    setConversations((prev) => [
      ...prev,
      {
        id: newConversationId,
        timestamp: Date.now(),
        messages: [initialMessage],
      },
    ]);
    setIsViewingHistory(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    };

    // Store the input before clearing it
    const userInput = input;
    setInput('');

    // Update messages immediately with user's message
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Update conversation in history
    const conversation: Conversation = {
      id: currentConversationId || Date.now().toString(),
      timestamp: Date.now(),
      messages: updatedMessages,
    };

    setConversations((prev) => {
      const existing = prev.findIndex((c) => c.id === conversation.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = conversation;
        return updated;
      }
      return [...prev, conversation];
    });

    // Handle commands
    const command = userInput.toLowerCase().trim();
    if (command === 'clear') {
      if (onCreateFlow) {
        onCreateFlow(['clear']);
      }
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Canvas cleared successfully.',
          isUser: false,
        };
        handleBotResponse(response);
      }, 500);
    } else if (userInput.includes('->')) {
      const nodes = userInput.split('->').map((node) => node.trim());
      if (onCreateFlow) {
        onCreateFlow(nodes);
      }

      // Add success response
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: `Flow created successfully with the following nodes:\n${nodes
            .map((node, index) => `${index + 1}. ${node}`)
            .join('\n')}`,
          isUser: false,
        };
        handleBotResponse(response);
      }, 500);
    } else {
      // Regular chat response
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: 'I understand you want to create a flow. You can:\n1. Create a flow using: "Node1 -> Node2 -> Node3"\n2. Clear the canvas by typing: "clear"',
          isUser: false,
        };
        handleBotResponse(response);
      }, 500);
    }
  };

  const handleBotResponse = (response: ChatMessage) => {
    // Add bot response to existing messages
    setMessages((currentMessages) => [...currentMessages, response]);

    // Update conversation in history with all messages
    setConversations((prev) => {
      const existing = prev.findIndex((c) => c.id === currentConversationId);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = {
          ...updated[existing],
          messages: [...messages, response],
          timestamp: Date.now(),
        };
        return updated;
      }
      return prev;
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
      setIsViewingHistory(true);
    }
    setShowHistory(false);
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    if (currentConversationId === conversationId) {
      startNewConversation();
    }
  };

  if (showHistory) {
    return (
      <ChatHistory
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        selectedConversationId={currentConversationId}
      />
    );
  }

  return (
    <ChatPanelContainer>
      <ChatHeader>
        <Typography variant="h6">Chat Assistant</Typography>
        <Box>
          <IconButton onClick={() => setShowHistory(true)} size="small">
            <HistoryIcon />
          </IconButton>
          {isViewingHistory && (
            <Button size="small" onClick={startNewConversation} sx={{ ml: 1 }}>
              New Chat
            </Button>
          )}
        </Box>
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
          disabled={isViewingHistory}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSend}
                  disabled={!input.trim() || isViewingHistory}
                >
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
