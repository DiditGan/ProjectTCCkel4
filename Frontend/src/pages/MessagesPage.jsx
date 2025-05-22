import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiPaperAirplane, HiPhotograph, HiDotsVertical } from "react-icons/hi";

// Dummy conversations data
const DUMMY_CONVERSATIONS = [
  {
    id: 1,
    participant: {
      name: "Budi Santoso",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=240&q=80"
    },
    product: {
      name: "Vintage Wooden Chair",
      imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
    },
    lastMessage: {
      text: "Barang masih tersedia, silakan datang untuk lihat langsung",
      timestamp: "10:30",
      sender: "other"
    },
    unreadCount: 2
  },
  {
    id: 2,
    participant: {
      name: "Anita Wijaya",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=240&q=80"
    },
    product: {
      name: "LED Desk Lamp",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
    },
    lastMessage: {
      text: "Terima kasih sudah beli, semoga berguna ya",
      timestamp: "09:15",
      sender: "other"
    },
    unreadCount: 0
  }
];

// Dummy messages for active conversation
const DUMMY_MESSAGES = {
  1: [
    {
      id: 1,
      text: "Halo, saya tertarik dengan kursi kayunya. Kondisinya masih bagus?",
      timestamp: "10:15",
      sender: "me"
    },
    {
      id: 2,
      text: "Halo! Iya masih bagus kok, hanya ada bekas goresan kecil di kaki kursi tapi tidak mengganggu",
      timestamp: "10:18",
      sender: "other"
    },
    {
      id: 3,
      text: "Boleh nego harganya? Bagaimana kalau 200rb?",
      timestamp: "10:20",
      sender: "me"
    },
    {
      id: 4,
      text: "Waduh harga segitu masih belum bisa, minimal 230rb deh",
      timestamp: "10:25",
      sender: "other"
    },
    {
      id: 5,
      text: "Oke deal 230rb. Barang masih tersedia kan?",
      timestamp: "10:28",
      sender: "me"
    },
    {
      id: 6,
      text: "Barang masih tersedia, silakan datang untuk lihat langsung",
      timestamp: "10:30",
      sender: "other"
    }
  ],
  2: [
    {
      id: 1,
      text: "Halo, lampu meja LED nya masih ada?",
      timestamp: "08:30",
      sender: "me"
    },
    {
      id: 2,
      text: "Masih ada kok. Kondisi seperti baru, masih ada dus nya juga",
      timestamp: "08:35",
      sender: "other"
    },
    {
      id: 3,
      text: "Oke saya ambil. Bisa COD?",
      timestamp: "08:40",
      sender: "me"
    },
    {
      id: 4,
      text: "Bisa, nanti saya info alamatnya ya",
      timestamp: "08:45",
      sender: "other"
    },
    {
      id: 5,
      text: "Terima kasih sudah beli, semoga berguna ya",
      timestamp: "09:15",
      sender: "other"
    }
  ]
};

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let initialConversations = DUMMY_CONVERSATIONS;
        let initialActiveConversation = initialConversations.length > 0 ? initialConversations[0] : null;
        let initialMessages = initialActiveConversation ? DUMMY_MESSAGES[initialActiveConversation.id] : [];

        const routeState = location.state;
        if (routeState?.recipientName && routeState?.productId) {
          // Check if a conversation with this recipient/product already exists
          const existingConv = initialConversations.find(
            conv => conv.participant.name === routeState.recipientName && conv.product.id === routeState.productId
          );

          if (existingConv) {
            initialActiveConversation = existingConv;
            initialMessages = DUMMY_MESSAGES[existingConv.id] || [];
          } else {
            // Create a new dummy conversation if it doesn't exist (for demo purposes)
            const newConv = {
              id: Date.now(), // Unique ID
              participant: { name: routeState.recipientName, avatar: "https://via.placeholder.com/150" },
              product: { id: routeState.productId, name: routeState.productName, imageUrl: "https://via.placeholder.com/150" },
              lastMessage: { text: `Regarding: ${routeState.productName}`, timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), sender: "system" },
              unreadCount: 0
            };
            initialConversations = [newConv, ...initialConversations];
            DUMMY_MESSAGES[newConv.id] = [{ id: 1, text: `Starting chat about ${routeState.productName}`, timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), sender: "system" }];
            initialActiveConversation = newConv;
            initialMessages = DUMMY_MESSAGES[newConv.id];
          }
        }
        
        setConversations(initialConversations);
        setActiveConversation(initialActiveConversation);
        setMessages(initialMessages);

      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    setMessages(DUMMY_MESSAGES[conversation.id] || []);
    
    // Mark as read (remove unread count)
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sender: "me"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Update last message in conversation list
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id
          ? { 
              ...conv, 
              lastMessage: { 
                ...message, 
                sender: "me" 
              } 
            }
          : conv
      )
    );

    // Simulate seller response after 2 seconds
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        text: "Baik, saya akan bantu jawab pertanyaan Anda",
        timestamp: new Date().toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        sender: "other"
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
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
