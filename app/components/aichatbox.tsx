import { useChat } from "ai/react";
import { BsXCircle } from "react-icons/bs";
import { Message } from "ai";
import Image from "next/image";

interface AIChatBoxProps {
    open: boolean;
    onClose: () => void;
    userImage: { pfp_url: string | null };
}

export default function AIChatBox({ open, onClose, userImage }: AIChatBoxProps) {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setMessages,
        isLoading,
        data,
        error
    } = useChat();

    if (!open) return null;

    return (
        <div className="absolute bottom-16 right-4 bg-white z-50 w-full max-w-[500px] p-1 xl:right-36">
            <div className="flex h-[600px] flex-col rounded bg-white border p-4 z-50">
                <button onClick={onClose} className="mb-1 ms-auto block">
                    <BsXCircle size={30} />
                </button>
                <div className="h-full overflow-y-auto">
                    {messages.map((message: Message) => (
                        <ChatMessage message={message} key={message.id} userImage={userImage.pfp_url} />
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="m-3 flex gap-1 text-center justify-center">
                    <input
                        type="text"
                        placeholder="Say something..."
                        value={input}
                        onChange={handleInputChange}
                        className="input input-bordered w-full max-w-xs"
                    />
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
            </div>
        </div>
    );
}

function ChatMessage({ message, userImage }: { message: Message, userImage: string | null }) {
    const { role, content } = message;
    const isAiMessage = role === 'assistant';

    return (
        <div className={`mb-3 flex items-start ${isAiMessage ? 'justify-start' : 'justify-end'}`}>
            {isAiMessage ? (
                   <>
                   <div className="mr-2">
                       <span className="block text-sm font-semibold">AI</span>
                   </div>
                   <div className="p-2 rounded bg-gray-200">
                       {content}
                   </div>
               </>
            ) : (
                <>
                    <div className="p-2 rounded bg-blue-500 text-white">
                        {content}
                    </div>
                    {userImage && (
                        <Image src={userImage} alt="User Profile" className="w-8 h-8 rounded-full ml-2" width={32} height={32} />
                    )}
                </>
            )}
        </div>
    );
}
