'use client';
import React, { useEffect, useState } from 'react';
import AIChatBox from './aichatbox';
import { FaRobot } from "react-icons/fa6";
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import { getUserPfp } from '@/src/lib/db';

export default function AIChatButton() {
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [userImage, setUserImage] = useState<{ pfp_url: string | null }>({ pfp_url: null });
    const [user] = useLocalStorage('user', {
        fid: '',
        username: '',
    });

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userId = "user-id-from-context-or-session"; // Replace with actual user ID fetching logic
                const response = await fetch('/api/getpfp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userFid: user.fid})
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile picture');
                }

                const data = await response.json();
                console.log("pfp",data);
                setUserImage({ pfp_url: data.response.pfpUrl || null });
            } catch (error) {
                console.error(error);
            }
        }

        fetchUserData();
    }, []);


    const toggleChatBox = () => {
        setChatBoxOpen(prevState => !prevState);
    };

    return (
        <>
            <button onClick={toggleChatBox} className="absolute bottom-0 right-4 z-20 btn btn-primary flex items-center gap-2">
                <FaRobot size={24} />
                SunnyGPT
            </button>
            {chatBoxOpen && <AIChatBox open={chatBoxOpen} onClose={toggleChatBox} userImage={userImage} />}
        </>
    );
}
