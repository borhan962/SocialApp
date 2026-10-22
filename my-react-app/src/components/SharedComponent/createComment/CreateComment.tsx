import React, { useRef, useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaImages } from "react-icons/fa";
import { createComment } from '../../../Services/createComent.services';
import { AuthContext } from '../../../context/AuthContext';
import { userDataContext } from '../../../context/userDataContext';
import { useQueryClient } from '@tanstack/react-query';
import { SmilePlus, Send } from 'lucide-react';
import { CommentEmoji } from '../../emojiPicker/emojuPickerCommnet';

export default function CreateComment({ postId }: { postId: string }) {
    const { register, handleSubmit, reset, setValue, getValues } = useForm<{ comment: string }>()
    const { userToken } = useContext(AuthContext)
    const { userData } = useContext(userDataContext)
    const queryClient = useQueryClient()

    const inputRef = useRef<HTMLInputElement>(null)
    const [imgFile, setImgFile] = useState<File | null>(null)
    const [showEmoji, setShowEmoji] = useState(false)
    const emojiRef = useRef<HTMLDivElement>(null)
    const emojiButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (
                emojiRef.current && 
                !emojiRef.current.contains(target) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(target)
            ) {
                setShowEmoji(false);
            }
        }
        if (showEmoji) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmoji]);

    function toggleEmoji() {
        setShowEmoji((prev) => !prev);
    }

    function handleEmojiClick(emoji: any) {
        const current = getValues("comment") || "";
        setValue("comment", current + (emoji?.emoji || ""));
    }

    const userName = userData?.data?.user?.name || "User";
    const userPhoto = userData?.data?.user?.photo;

    function getFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setImgFile(e.target.files[0])
        }
    }

    async function onSubmit(data: any) {
    if (!userToken) return;

    const fd = new FormData();

    if (data.comment) {
        fd.append("content", data.comment);
    }

    if (imgFile) {
        fd.append("image", imgFile);
    }

    try {
        await createComment(userToken, postId, fd);

        reset();
        setImgFile(null);
        setShowEmoji(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        queryClient.invalidateQueries({ queryKey: ["allPosts"] })
        queryClient.invalidateQueries({ queryKey: ["allComments", postId] })
        queryClient.invalidateQueries({ queryKey: ["userPosts"] })
        
    } catch (error) {
        console.error("Failed to create comment:", error);
    }
}

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-3">
            <div className="flex items-start gap-2.5">
                {/* User Avatar */}
                <img 
                    src={userPhoto} 
                    alt={userName} 
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-100 dark:border-gray-700 mt-0.5"
                />

                {/* Comment Input Container */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-700/60 rounded-2xl border border-gray-200 dark:border-gray-600 focus-within:border-blue-400 transition-colors">
                    <input 
                        type="text" 
                        {...register("comment")} 
                        placeholder={`Comment as ${userName}...`} 
                        className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400 bg-transparent outline-none"
                    />
                    
                    {/* Bottom actions inside the input box */}
                    <div className="flex items-center justify-between px-3 pb-2">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => inputRef.current?.click()} 
                                type='button' 
                                className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer'
                                title="Add image"
                            >
                                <FaImages className={`text-sm ${imgFile ? 'text-green-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white'}`} />
                            </button>
                            <input type="file" ref={inputRef} onChange={getFile} hidden accept="image/*" />
                            
                            <button 
                                ref={emojiButtonRef}
                                type='button' 
                                onClick={toggleEmoji} 
                                className={`p-1 rounded transition cursor-pointer ${showEmoji ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white'}`}
                                title="Emoji"
                            >
                                <SmilePlus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Send Button */}
                <button 
                    type='submit' 
                    className='mt-1 p-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-500 dark:text-blue-400 transition cursor-pointer flex-shrink-0'
                    title="Send comment"
                >
                    <Send className="w-4.5 h-4.5" />
                </button>
            </div>

            {/* Emoji Picker under comment section with full width */}
            {showEmoji && (
                <div ref={emojiRef} className="mt-2.5 w-full">
                    <CommentEmoji onEmojiClick={handleEmojiClick} width="100%" />
                </div>
            )}
        </form>
    )
}
