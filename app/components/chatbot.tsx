// components/Chatbot.tsx

'use client';

import React, { useState } from 'react';
import { IoChatbubblesOutline } from "react-icons/io5";
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from '../../src/chatbot/config';
import MessageParser from '../../src/chatbot/Messageparser.js';
import ActionProvider from '../../src/chatbot/ActionProvider.js';

const Chatbot1 = () => {
    return (
      <div>
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>
    );
  };


// const Chatbot1 = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       <div
//         className="fixed bottom-4 justify-center items-center right-4 bg-blue-500 text-white p-4 rounded-full cursor-pointer"
//         onClick={toggleChat}
//       >
//         <IoChatbubblesOutline className='ml-2'/>

//         Chat
//       </div>
//       {isOpen && (
//         <div className="fixed bottom-16 right-4 bg-white shadow-lg rounded-lg w-80 p-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg font-bold">Chatbot</h2>
//             <button onClick={toggleChat} className="text-red-500">X</button>
//           </div>
//           <div className="mt-4">
//             <p>Hello! How can I help you today?</p>
//             {/* Chat content goes here */}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

export default Chatbot1;
