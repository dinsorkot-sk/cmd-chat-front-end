// "use client";

// import { useState, useRef, useEffect } from "react";
// import socket from "../../socket";
// export default function Home() {
//   const [username, setName] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [inputText, setInputText] = useState("");
//   const [caretPosition, setCaretPosition] = useState(0);
//   const [messages, setMessages] = useState([]); // เพิ่ม state สำหรับเก็บข้อความ
//   const inputRef = useRef(null);
//   const textRef = useRef(null);
//   const [message, setMessage] = useState("");

//   const handleInputChange = (event) => {
//     setName(event.target.value);
//   };

//   const handleSecondInputChange = (event) => {
//     setInputText(event.target.value);
//     setMessage(event.target.value);
//     updateCaretPosition();
//   };

//   const updateCaretPosition = () => {
//     if (inputRef.current) {
//       const position = inputRef.current.selectionStart;
//       setCaretPosition(Math.min(position, inputText.length));
//     }
//   };

//   const handleSubmit = () => {
//     if (username.trim() !== "") {
//       setIsSubmitted(true);
//     }
//   };

//   // จัดการการกด Enter ในช่องพิมพ์
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && inputText.trim() !== "") {
//       // เพิ่มข้อความใหม่เข้าไปใน array messages
//       // setMessages([...messages, inputText]);
//       // เคลียร์ช่องพิมพ์
//       setInputText("");
//       e.preventDefault(); // ป้องกันการ submit form
//       sendMessage();
//     }
//   };

//   // Focus input whenever clicked anywhere on the page
//   const handleGlobalClick = (e) => {
//     if (isSubmitted && inputRef.current) {
//       inputRef.current.focus();
//       // Small delay to ensure selection is updated
//       setTimeout(updateCaretPosition, 10);
//     }
//   };

//   useEffect(() => {
//     socket.on("receiveMessage", (data) => {
//       // setMessages(prev => [...prev, data]);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { username: data.username, message: data.message },
//       ]);
//       console.log(" L : ", data);
//       console.log(" Messages : ", messages);
//     });
//     // Focus the input on component mount if already submitted
//     if (isSubmitted && inputRef.current) {
//       inputRef.current.focus();
//     }

//     // Add click event listener to the document
//     if (isSubmitted) {
//       document.addEventListener("click", handleGlobalClick);
//     }

//     // Cleanup event listener
//     return () => {
//       socket.off("receiveMessage");
//       document.removeEventListener("click", handleGlobalClick);
//     };
//   }, [isSubmitted]);

//   const sendMessage = () => {
//     console.log("test : ", username, " + ", message);
//     socket.emit("sendMessage", { username, message });
//     setMessage("");
//   };
//   // Calculate the position of the caret based on text width
//   const getCaretLeftPosition = () => {
//     if (textRef.current && inputRef.current) {
//       // ตรวจสอบให้แน่ใจว่า caretPosition ไม่เกินความยาวของข้อความ
//       const safeCaretPosition = Math.min(caretPosition, inputText.length);

//       if (safeCaretPosition > 0) {
//         const textBeforeCaret = inputText.substring(0, safeCaretPosition);
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         // Get the computed style of the input
//         const computedStyle = window.getComputedStyle(inputRef.current);
//         context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;

//         // Measure the width of text before the caret
//         const textWidth = context.measureText(textBeforeCaret).width;

//         // คำนวณความกว้างสูงสุดที่อนุญาตให้เคอร์เซอร์อยู่
//         const inputWidth = inputRef.current.clientWidth;
//         return Math.min(textWidth, inputWidth - 3); // หัก 12px สำหรับความกว้างของเคอร์เซอร์
//       }
//     }
//     return 0;
//   };

//   return (
//     <div
//       className="bg-black text-white h-screen flex justify-center items-center"
//       onClick={handleGlobalClick}
//     >
//       {isSubmitted ? (
//         <div className="flex justify-end flex-col h-full w-full max-w-md">
//           <div className="flex flex-col p-4 overflow-y-auto mb-4 overflow-y-hidden">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex flex-col   ${
//                   message.username === username ? "items-end" : "items-start"
//                 } mb-4`}
//               >
//                 <div
//                   className={`text-sm mb-1 ${
//                     message.username === username ? "text-right" : "text-left"
//                   } text-white`}
//                 >
//                   {message.username}
//                 </div>
//                 <div
//                   className={`max-w-[70%] rounded-lg px-3 py-2 ${
//                     message.username === username
//                       ? "bg-blue-100 text-blue-800"
//                       : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {message.message}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="flex px-4 py-4 justify-evenly rounded-2xl bg-gray-900 mx-4 mb-8">
//             <div className="text-center flex justify-center flex-col">
//               {username}
//             </div>
//             <hr className="w-px h-auto bg-white border-none mx-6" />
//             <div className="text-center flex justify-center flex-col relative w-full">
//               <div className="input-container relative">
//                 <span ref={textRef} className="invisible absolute">
//                   {inputText.substring(0, caretPosition)}
//                 </span>
//                 <input
//                   ref={inputRef}
//                   className="w-full text-left bg-transparent border-none focus:outline-none caret-transparent"
//                   value={inputText}
//                   onChange={handleSecondInputChange}
//                   onKeyDown={handleKeyDown}
//                   autoFocus
//                 />
//                 <div
//                   className="horizontal-caret"
//                   style={{ left: `${getCaretLeftPosition()}px` }}
//                 ></div>
//               </div>
//               <style jsx>{`
//                 .input-container {
//                   position: relative;
//                   display: inline-block;
//                 }

//                 .horizontal-caret {
//                   position: absolute;
//                   bottom: 0;
//                   height: 3px;
//                   width: 12px;
//                   background-color: white;
//                   animation: blink 1s step-end infinite;
//                   transition: left 0.05s ease-out;
//                 }
//                 input.caret-transparent {
//                   caret-color: transparent;
//                 }
//                 @keyframes blink {
//                   50% {
//                     opacity: 0;
//                   }
//                 }
//               `}</style>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <input
//           className="border-white border-2 rounded-2xl lg:w-2/6 md:w-3/6 sm:w-4/6 w-4/6 py-2 px-2 text-center"
//           placeholder="Enter your name"
//           value={username}
//           onChange={handleInputChange}
//           onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import socket from "../../socket";
export default function Home() {
  const [username, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [caretPosition, setCaretPosition] = useState(0);
  const [messages, setMessages] = useState([]); // เพิ่ม state สำหรับเก็บข้อความ
  const inputRef = useRef(null);
  const textRef = useRef(null);
  const [message, setMessage] = useState("");
  // Add a ref for the messages container to scroll to bottom
  const messagesContainerRef = useRef(null);

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleSecondInputChange = (event) => {
    setInputText(event.target.value);
    setMessage(event.target.value);
    updateCaretPosition();
  };

  const updateCaretPosition = () => {
    if (inputRef.current) {
      const position = inputRef.current.selectionStart;
      setCaretPosition(Math.min(position, inputText.length));
    }
  };

  const handleSubmit = () => {
    if (username.trim() !== "") {
      setIsSubmitted(true);
    }
  };

  // จัดการการกด Enter ในช่องพิมพ์
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputText.trim() !== "") {
      // เพิ่มข้อความใหม่เข้าไปใน array messages
      // setMessages([...messages, inputText]);
      // เคลียร์ช่องพิมพ์
      setInputText("");
      e.preventDefault(); // ป้องกันการ submit form
      sendMessage();
    }
  };

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  // Focus input whenever clicked anywhere on the page
  const handleGlobalClick = (e) => {
    if (isSubmitted && inputRef.current) {
      inputRef.current.focus();
      // Small delay to ensure selection is updated
      setTimeout(updateCaretPosition, 10);
    }
  };

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      // setMessages(prev => [...prev, data]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: data.username, message: data.message },
      ]);
      console.log(" L : ", data);
      console.log(" Messages : ", messages);
    });
    // Focus the input on component mount if already submitted
    if (isSubmitted && inputRef.current) {
      inputRef.current.focus();
    }

    // Add click event listener to the document
    if (isSubmitted) {
      document.addEventListener("click", handleGlobalClick);
    }

    // Cleanup event listener
    return () => {
      socket.off("receiveMessage");
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [isSubmitted]);

  // Add effect to scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    console.log("test : ", username, " + ", message);
    socket.emit("sendMessage", { username, message });
    setMessage("");
  };
  // Calculate the position of the caret based on text width
  const getCaretLeftPosition = () => {
    if (textRef.current && inputRef.current) {
      // ตรวจสอบให้แน่ใจว่า caretPosition ไม่เกินความยาวของข้อความ
      const safeCaretPosition = Math.min(caretPosition, inputText.length);

      if (safeCaretPosition > 0) {
        const textBeforeCaret = inputText.substring(0, safeCaretPosition);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Get the computed style of the input
        const computedStyle = window.getComputedStyle(inputRef.current);
        context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;

        // Measure the width of text before the caret
        const textWidth = context.measureText(textBeforeCaret).width;

        // คำนวณความกว้างสูงสุดที่อนุญาตให้เคอร์เซอร์อยู่
        const inputWidth = inputRef.current.clientWidth;
        return Math.min(textWidth, inputWidth - 3); // หัก 12px สำหรับความกว้างของเคอร์เซอร์
      }
    }
    return 0;
  };

  return (
    <div
      className="bg-black text-white h-screen flex justify-center items-center"
      onClick={handleGlobalClick}
    >
      {isSubmitted ? (
        <div className="flex justify-end flex-col h-full w-full max-w-md">
          <div
            ref={messagesContainerRef}
            className="flex flex-col  justify-end  p-4 overflow-y-auto mb-4 h-full "
          >
            <div>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    message.username === username ? "items-end" : "items-start"
                  } mb-4`}
                >
                  <div
                    className={`text-sm mb-1 ${
                      message.username === username ? "text-right" : "text-left"
                    } text-white`}
                  >
                    {message.username}
                  </div>
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 break-words ${
                      message.username === username
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex px-4 py-4 justify-evenly rounded-2xl bg-gray-900 mx-4 mb-8">
            <div className="text-center flex justify-center flex-col">
              {username}
            </div>
            <hr className="w-px h-auto bg-white border-none mx-6" />
            <div className="text-center flex justify-center flex-col relative w-full">
              <div className="input-container relative">
                <span ref={textRef} className="invisible absolute">
                  {inputText.substring(0, caretPosition)}
                </span>
                <input
                  ref={inputRef}
                  className="w-full text-left bg-transparent border-none focus:outline-none caret-transparent"
                  value={inputText}
                  onChange={handleSecondInputChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <div
                  className="horizontal-caret"
                  style={{ left: `${getCaretLeftPosition()}px` }}
                ></div>
              </div>
              <style jsx>{`
                .input-container {
                  position: relative;
                  display: inline-block;
                }

                .horizontal-caret {
                  position: absolute;
                  bottom: 0;
                  height: 3px;
                  width: 12px;
                  background-color: white;
                  animation: blink 1s step-end infinite;
                  transition: left 0.05s ease-out;
                }
                input.caret-transparent {
                  caret-color: transparent;
                }
                @keyframes blink {
                  50% {
                    opacity: 0;
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      ) : (
        <input
          className="border-white border-2 rounded-2xl lg:w-2/6 md:w-3/6 sm:w-4/6 w-4/6 py-2 px-2 text-center"
          placeholder="Enter your name"
          value={username}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      )}
    </div>
  );
}
