import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiPaperAirplane, HiPhotograph, HiDotsVertical } from "react-icons/hi";
import { useAuth } from "../contexts/AuthContext";

// API URL
const API_BASE_URL = "http://localhost:5000";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        
        // Fetch conversations from API
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        const response = await fetch(`${API_BASE_URL}/api/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        
        let conversationsData = await response.json();
        
        // If we have route state with recipient/product info, check for existing conversation or create new one
        if (location.state?.recipientName && location.state?.productId) {
          // Check if we have an existing conversation about this product
          const existingConv = conversationsData.find(
            conv => conv.product?.item_id === location.state.productId
          );

          if (existingConv) {
            setActiveConversation(existingConv);
            await fetchMessages(existingConv.conversation_id);
          } else {
            // Create a new conversation
            const createResponse = await fetch(`${API_BASE_URL}/api/conversations/new`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                recipient_id: location.state.recipientId,
                product_id: location.state.productId,
                content: `Hello, I'm interested in ${location.state.productName}`
              })
            });
            
            if (!createResponse.ok) {
              throw new Error("Failed to create new conversation");
            }
            
            // Fetch updated conversations list
            const updatedResponse = await fetch(`${API_BASE_URL}/api/conversations`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            conversationsData = await updatedResponse.json();
            
            // Set first conversation as active
            if (conversationsData.length > 0) {
              setActiveConversation(conversationsData[0]);
              await fetchMessages(conversationsData[0].conversation_id);
            }
          }
        } else if (conversationsData.length > 0) {
          // Set first conversation as active by default
          setActiveConversation(conversationsData[0]);
          await fetchMessages(conversationsData[0].conversation_id);
        }
        
        setConversations(conversationsData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [location.state]);

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      
      const messagesData = await response.json();
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    fetchMessages(conversation.conversation_id);
    
    // Mark as read (API call would be ideal here)
    setConversations(prev => 
      prev.map(conv => 
        conv.conversation_id === conversation.conversation_id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`${API_BASE_URL}/api/conversations/${activeConversation.conversation_id}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      // Get the new message from the response
      const messageData = await response.json();
      
      // Add sender info to the message
      const messageWithSender = {
        ...messageData,
        sender: {
          user_id: currentUser.user_id,
          name: currentUser.name
        }
      };
      
      // Update messages state
      setMessages(prev => [...prev, messageWithSender]);
      
      // Clear input
      setNewMessage("");
      
      // Update last message in conversation list
      setConversations(prev =>
        prev.map(conv =>
          conv.conversation_id === activeConversation.conversation_id
            ? { 
                ...conv, 
                lastMessage: { 
                  content: newMessage,
                  timestamp: new Date(),
                  sender_id: currentUser.user_id
                } 
              }
            : conv
        )
      );
      
      // Fetch updated messages to get any server-side changes
      fetchMessages(activeConversation.conversation_id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pesan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="h-16"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Pesan</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                      activeConversation?.id === conversation.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <img
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-800 truncate">
                            {conversation.participant.name}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">
                          {conversation.product.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                      <div className="ml-2 text-xs text-gray-400">
                        {conversation.lastMessage.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={activeConversation.participant.avatar}
                          alt={activeConversation.participant.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {activeConversation.participant.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {activeConversation.product.name}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <HiDotsVertical className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center">
                      <img
                        src={activeConversation.product.imageUrl}
                        alt={activeConversation.product.name}
                        className="w-16 h-16 object-cover rounded-md mr-3"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {activeConversation.product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Diskusi mengenai produk ini
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'me'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'me' ? 'text-green-100' : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 transition"
                      >
                        <HiPhotograph className="text-xl" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-2 rounded-full transition ${
                          newMessage.trim()
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <HiPaperAirplane className="text-xl" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl text-gray-300 mb-4">💬</div>
                    <p className="text-gray-600">Pilih percakapan untuk mulai chat</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
