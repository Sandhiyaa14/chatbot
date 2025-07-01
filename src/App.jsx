import { useEffect, useRef, useState } from 'react';
import './App.css';
import { FaCode } from "react-icons/fa";
import { GiRingedPlanet } from "react-icons/gi";
import { FaPython } from "react-icons/fa";
import { IoChatboxSharp, IoSend } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import botImage from './assets/bot.png';
import { GoogleGenAI } from "@google/genai";
import { FaImage } from "react-icons/fa6";

function App() {
  const [suggestions, setSuggestions] = useState([
    { id: 1, text: "What is coding ? How we can learn it.", icon: FaCode },
    { id: 2, text: "Which is the red planet of solar system", icon: GiRingedPlanet },
    { id: 3, text: "In which year python was invented ?", icon: FaPython },
    { id: 4, text: "How we can use the AI for adopt ?", icon: IoChatboxSharp },
  ]);

  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responsePage, setResponsePage] = useState(false);
  const ai = new GoogleGenAI({ apiKey: "AIzaSyDQ3zLH_ijUYzzmZidiHm7v9Ja_NJ76H2w" });

  const handleClick = (id) => {
    const selected = suggestions.find((s) => s.id == id);
    if (selected) {
      setInput(selected.text);
    }
  };

  const handleSend = async () => {
    setInput("");
    setLoading(true);
    setResponsePage(true);
    setMessage(prev => [...prev, { sender: "user", text: input }]);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: input,
    });

    setMessage(prev => [...prev, { sender: "bot", text: response.text }]);
    setLoading(false);
  };

  const bottomRef = useRef();
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return (
    <div className='bg-black h-screen w-full flex flex-col text-white overflow-hidden'>
      {responsePage ? (
        <div className="flex-1 px-2 sm:px-4 py-4 overflow-y-auto max-h-[calc(100vh-150px)]">
          <div className="max-w-[800px] mx-auto">
            {message.map((msg, index) => (
              <div key={index} className='mt-6'>
                {msg.sender === "user" ? (
                  <div className='w-full flex justify-end items-start gap-2'>
                    <h1 className='text-left bg-blue-900 rounded-3xl p-2 px-4 break-words max-w-[75%] sm:max-w-[70%]'>{msg.text}</h1>
                    <div className="w-10 h-10 bg-gray-900 p-2 rounded-full flex items-center justify-center shrink-0">
                      <FaUser className="text-lg text-white" />
                    </div>
                  </div>
                ) : (
                  <div className='w-full flex justify-start items-start gap-2'>
                    <img src={botImage} className='w-11 h-11 object-contain' alt="bot" />
                    <h1 className='text-left bg-[#1c1c1c] rounded-3xl p-2 px-4 break-words max-w-[75%] sm:max-w-[70%]'>{msg.text}</h1>
                  </div>
                )}
                  <div ref={bottomRef}></div>
              </div>
            ))}
          
            {loading && (
              <div className='flex items-center gap-2 mt-4'>
                <img src={botImage} className='w-11 h-11 object-contain' alt="bot" />
                <h1 className='animate-pulse'>Typing...</h1>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='mt-20 md:mt-50 px-4 w-full'>
          <h1 className='text-2xl text-center'>Assist Me</h1>
          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 max-w-[800px] mx-auto'>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className='bg-[#1c1c1c] p-3 rounded h-30 cursor-pointer hover:bg-[#333333] relative'
                onClick={() => handleClick(suggestion.id)}
              >
                <h1>{suggestion.text}</h1>
                <suggestion.icon className='absolute bottom-2 right-2 text-lg' />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className='fixed bottom-0 w-full px-4 py-4 bg-black'>
        <div className='rounded-3xl p-3 w-full max-w-[800px] mx-auto bg-[#1c1c1c] flex items-center'>
          <input
            type="text"
            onKeyDown={(e) => { if (e.key === "Enter") { handleSend() } }}
            placeholder='Write your message here...'
            className='bg-transparent outline-none text-white w-full'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {input.length > 0 && (
            <IoSend onClick={handleSend} className='ml-4 text-xl cursor-pointer text-blue-500' />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
