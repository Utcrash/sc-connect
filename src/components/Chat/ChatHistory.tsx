import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const HistoryContainer = styled(Paper)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const HistoryHeader = styled(Box)({
  padding: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
});

const HistoryList = styled(List)({
  flex: 1,
  overflowY: 'auto',
  padding: 0,
});

const HistoryItem = styled(ListItem)({
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

interface ChatHistoryProps {
  conversations: Array<{
    id: string;
    timestamp: number;
    messages: Array<{
      id: string;
      text: string;
      isUser: boolean;
    }>;
  }>;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  selectedConversationId?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  selectedConversationId,
}) => {
  return (
    <HistoryContainer>
      <HistoryHeader>
        <Typography variant="h6">Chat History</Typography>
      </HistoryHeader>
      <HistoryList>
        {conversations.map((conversation) => (
          <HistoryItem
            key={conversation.id}
            selected={selectedConversationId === conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={new Date(conversation.timestamp).toLocaleString()}
              secondary={`${conversation.messages.length} messages`}
            />
          </HistoryItem>
        ))}
        {conversations.length === 0 && (
          <Box p={2} textAlign="center">
            <Typography color="textSecondary">No chat history</Typography>
          </Box>
        )}
      </HistoryList>
    </HistoryContainer>
  );
};

export default ChatHistory;
