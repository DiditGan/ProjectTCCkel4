import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { HiArrowLeft, HiPaperAirplane, HiOutlinePhotograph, HiX } from 'react-icons/hi';

const API_BASE_URL = "http://localhost:5000";

const ChatPage = () => {
  const { sellerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [sellerName, setSellerName] = useState('Seller');
  const [itemName, setItemName] = useState('');
  const [itemId, setItemId] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageToSend, setImageToSend] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { 
        state: { 
          from: location.pathname, 
          message: "Please login to chat." 
        } 
      });
      return;
    }

    if (location.state) {
      setSellerName(location.state.sellerName || 'Seller');
      setItemName(location.state.itemName || '');
      setItemId(location.state.itemId || null);
    }
    
    // Initialize with empty messages for now
    // In production, you would fetch actual chat history here
    setMessages([]);
    setIsLoading(false);

  }, [sellerId, currentUser, location.state, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageToSend) return;

    // For now, we'll simulate sending a message
    // In production, you would make an API call here
    const optimisticMessage = {
      id: Date.now(),
      sender_id: currentUser.user_id,
      receiver_id: sellerId,
      text: newMessage.trim(),
      image_url: imagePreview,
      timestamp: new Date().toISOString(),
      type: imageToSend ? 'image' : 'text',
      item_id: itemId,
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setImageToSend(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";

    // Simulate server response with a delay
    setTimeout(() => {
      const simulatedResponse = {
        id: optimisticMessage.id + 1,
        sender_id: sellerId,
        receiver_id: currentUser.user_id,
        text: `Thanks for your message! I'll get back to you soon about ${itemName || 'the item'}.`,
        timestamp: new Date().toISOString(),
        type: 'text',
        item_id: itemId,
      };
      setMessages(prev => [...prev, simulatedResponse]);
    }, 1000);
  };

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should not exceed 5MB.");
        return;
      }
      setImageToSend(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImagePreview = () => {
    setImageToSend(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto max-w-2xl py-4 px-2 sm:px-4 flex flex-col mt-16">
        {/* Chat Header */}
        <div className="bg-white shadow-sm rounded-t-lg p-4 flex items-center border-b">
          <button onClick={() => navigate(-1)} className="mr-3 text-gray-600 hover:text-gray-800">
            <HiArrowLeft size={24} />
          </button>
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
            {sellerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-800">{sellerName}</h2>
            {itemName && (
              <p className="text-xs text-gray-500">
                Regarding: <Link to={`/details/${itemId}`} className="hover:underline text-blue-600">{itemName}</Link>
              </p>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-grow bg-white overflow-y-auto p-4 space-y-4" style={{ minHeight: '400px' }}>
          {isLoading && <p className="text-center text-gray-500">Loading messages...</p>}
          {error && <p className="text-center text-red-500">Error: {error}</p>}
          {!isLoading && !error && messages.length === 0 && (
            <div className="text-center text-gray-500">
              <p className="mb-2">No messages yet. Start the conversation!</p>
              {itemName && (
                <p className="text-sm">You're interested in: <span className="font-medium">{itemName}</span></p>
              )}
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUser?.user_id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                  msg.sender_id === currentUser?.user_id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.type === 'image' && msg.image_url && (
                  <img 
                    src={msg.image_url} 
                    alt="Sent attachment" 
                    className="rounded-md max-w-full h-auto mb-1 max-h-60" 
                  />
                )}
                {msg.text && <p>{msg.text}</p>}
                <p className={`text-xs mt-1 ${msg.sender_id === currentUser?.user_id ? 'text-green-100' : 'text-gray-500'} text-right`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="bg-white rounded-b-lg p-3 sm:p-4 border-t">
          {imagePreview && (
            <div className="mb-2 p-2 border rounded-md relative inline-block">
              <img src={imagePreview} alt="Preview" className="max-h-24 rounded" />
              <button 
                onClick={removeImagePreview}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <HiX size={14} />
              </button>
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageInputChange}
              ref={fileInputRef}
              className="hidden"
              id="chatImageUpload"
            />
            <label htmlFor="chatImageUpload" className="p-2 text-gray-500 hover:text-green-600 cursor-pointer">
              <HiOutlinePhotograph size={24} />
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-150 disabled:opacity-50"
              disabled={isLoading || (!newMessage.trim() && !imageToSend)}
            >
              <HiPaperAirplane size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
