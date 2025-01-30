'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isExecutive: boolean;
}

interface Conversation {
  id: string;
  executiveName: string;
  role: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: '1',
    executiveName: 'Rahul Verma',
    role: 'DarkStore Owner - Zepto',
    avatar: '/avatars/rahul.jpg',
    lastMessage: 'Hey I have the items you were looking for but they only have a shelf life of 3 days remaining',
    unread: 1,
    messages: [
      {
        id: '1',
        content: 'Hey I have the items you were looking for but they only have a shelf life of 3 days remaining, let me know if you are interested',
        sender: 'Rahul Verma',
        timestamp: '11:45 AM',
        isExecutive: true
      }
    ]
  },
  {
    id: '2',
    executiveName: 'Suresh Kumar',
    role: 'DarkStore Executive - Swiggy',
    avatar: '/avatars/sarah.jpg',
    lastMessage: 'Yes, we are very excited to work in the location.',
    unread: 0,
    messages: [
      {
        id: '1',
        content: 'Hi, I noticed your application for the downtown facility.',
        sender: 'Suresh Kumar',
        timestamp: '9:30 AM',
        isExecutive: true
      },
      {
        id: '2',
        content: 'Yes, we are very excited to work in the location.',
        sender: 'You',
        timestamp: '9:35 AM',
        isExecutive: false
      }
    ]
  },
  {
    id: '3',
    executiveName: 'Manjeet Singh',
    role: 'Head of DarkStore - Blinkit',
    avatar: '/avatars/michael.jpg',
    lastMessage: 'Hello! I saw your interest in discussing integration requirements.',
    unread: 0,
    messages: [
      {
        id: '1',
        content: 'Hello! I saw your interest in discussing integration requirements.',
        sender: 'Manjeet Singh',
        timestamp: '10:15 AM',
        isExecutive: true
      }
    ]
  }
];

const instantReplies: { [key: string]: string[] } = {
  '1': [
    "The items are on their way to you. Let me know if you have any other questions.",
    "Let me get back to you in a few minutes."
  ],
  '2': [
    "Thanks for reaching out about the warehouse expansion.",
    "I'll review the details and get back to you soon.",
    "Interesting proposal. Let's discuss the specifics.",
    "Can you send over the preliminary documentation?",
    "The location looks promising. I'll get back to you."
  ],
  '3': [
    "Great, let's schedule that integration call.",
    "I'm excited to explore our collaboration opportunities.",
    "Can you share more details about the integration requirements?",
    "Our team is looking forward to working together.",
    "What specific challenges are you hoping to address?"
  ]
  
};

const getRandomReply = (conversationId: string, selectedConversation: Conversation | null): Message | null => {
  const replies = instantReplies[conversationId];
  if (!replies || replies.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * replies.length);
  return {
    id: Date.now().toString() + '_reply',
    content: replies[randomIndex],
    sender: selectedConversation?.executiveName || 'Executive',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isExecutive: true
  };
};

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(initialConversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isExecutive: false
    };

    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
      lastMessage: newMessage
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id ? updatedConversation : conv
      )
    );

    setSelectedConversation(updatedConversation);

    setNewMessage('');

    setTimeout(() => {
      const reply = getRandomReply(selectedConversation.id, selectedConversation);
      if (reply) {
        const updatedConversationWithReply = {
          ...selectedConversation,
          messages: [...updatedConversation.messages, reply],
          lastMessage: reply.content
        };

        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id ? updatedConversationWithReply : conv
          )
        );

        setSelectedConversation(updatedConversationWithReply);
      }
    }, 500 + Math.random() * 1500); // Random delay between 500-2000ms to simulate typing
  };

  const filteredConversations = conversations.filter(conv =>
    conv.executiveName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background mt-20">      {/* Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b sticky top-0 bg-background space-y-4">
          <h2 className="text-2xl font-semibold">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10 bg-accent/50"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors duration-200 ${
                selectedConversation?.id === conversation.id ? 'bg-accent' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="text-lg">{conversation.executiveName[0]}</AvatarFallback>
                  </Avatar>
                  {conversation.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold truncate">{conversation.executiveName}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{conversation.role}</p>
                  <p className="text-sm truncate text-muted-foreground">{conversation.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background/95">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.avatar} />
                  <AvatarFallback>{selectedConversation.executiveName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedConversation.executiveName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedConversation.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isExecutive ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                      message.isExecutive
                        ? 'bg-accent'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2 items-center">
                <Input
                  className="flex-1"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-muted-foreground">Welcome to Messages</h3>
              <p className="text-sm text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
