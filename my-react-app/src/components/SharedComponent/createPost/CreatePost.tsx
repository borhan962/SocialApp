import { useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { FaImages } from "react-icons/fa"
import { FiSend } from "react-icons/fi"
import { createPost } from "../../../Services/createPost.services"
import { AuthContext } from "../../../context/AuthContext"
import { userDataContext } from "../../../context/userDataContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { SmilePlus, ChevronDown, Globe, X } from "lucide-react"
import {EmojiPicker} from "../../emojiPicker/emojiPicker"

export default function CreatePost() {
    const [text , setText] = useState("")
    const {userToken} = useContext(AuthContext)
    const {userData} = useContext(userDataContext)
    const inputRef = useRef<HTMLInputElement>(null)
    const [imgFile, setImgFile] = useState<File | null>(null)
    const [imgUrl , setImgUrl] = useState<string>("")
    

    function TextArea(e:React.ChangeEvent<HTMLTextAreaElement>) {
        setText(e.target.value)
        
    }

    const {register, handleSubmit, reset} = useForm({
        defaultValues: {
            body: ""
        },
        mode: "onSubmit"
    })


        function getFile(e: React.ChangeEvent<HTMLInputElement>) {
            if (e.target.files && e.target.files[0]) {
                setImgFile(e.target.files[0])
                setImgUrl(URL.createObjectURL(e.target.files[0]))
            }
        }

        

    function sendData(data: { body: string }) {
        const bodyContent = text.trim() || data.body?.trim();

        if (!imgFile && !bodyContent) {
            toast.error("Please add text or an image to create a post");
            return;
        }

        const fd = new FormData();
        if (imgFile) {
            fd.append("image", imgFile);
        }

        if (bodyContent) {
            fd.append("body", bodyContent);
        }

        mutate(fd);
    }

    async function createPostData(fd: FormData) {
        if(userToken) {
          return  await createPost(userToken , fd);
        }
    }   

    const queryClient = useQueryClient();

    const { mutate , isPending } = useMutation({
        mutationFn: createPostData,
        onSuccess: (response: any) => {
            toast.success(response?.message || "Post created successfully");
            setImgFile(null);
            setImgUrl("");
            setText("");
            reset();
            if (inputRef.current) {
                inputRef.current.value = "";
            }
            queryClient.invalidateQueries({ queryKey: ["allPosts"] });
            queryClient.invalidateQueries({ queryKey: ["userPosts"] });
        },
        onError: () => {
            toast.error("Can't create your post try later!");
        }
    });

    const userName = userData?.data?.user?.name || "User";
    const userPhoto = userData?.data?.user?.photo;

    function removeImage() {
        setImgFile(null);
        setImgUrl("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    const [showEmoji , setShowEmoji] = useState(false)
    const emojiContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiContainerRef.current && !emojiContainerRef.current.contains(event.target as Node)) {
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
        setShowEmoji(!showEmoji)
    }
    function handleEmojiClick(emoji: any) {
      setText((prev) => prev + (emoji?.emoji || ""));
    }
    

  return (
    <>
 <form onSubmit={handleSubmit(sendData)}>
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-xl w-full mx-auto mt-4 transition-colors">
      {/* Top section - Avatar + Privacy */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={userPhoto} 
            alt={userName} 
            className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700 flex-shrink-0"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-[15px] leading-tight">{userName}</p>
            <button type="button" className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-xs text-gray-600 dark:text-gray-300">
              <Globe className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <span className="font-medium">Public</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea 
          {...register("body")} 
          onChange={(e) => { register("body").onChange(e); TextArea(e); }} 
          value={text}  
          className="w-full resize-y min-h-[100px] max-h-[250px] p-3 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-[15px] leading-relaxed bg-transparent outline-none border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-400 transition-colors" 
          spellCheck="false" 
          placeholder={`What's on your mind, ${userName.split(' ')[0]}?`}
        />

        {/* Image Preview */}
        {imgUrl && (
          <div className="relative mt-2 mb-1 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <img src={imgUrl} alt="preview" className="w-full max-h-[200px] object-cover" />
            <button 
              type="button" 
              onClick={removeImage} 
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-gray-100 dark:border-gray-700" />

      {/* Bottom actions bar */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => inputRef.current?.click()} 
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer group"
          >
            <FaImages className={`text-lg ${imgFile ? 'text-green-500' : 'text-blue-500 group-hover:text-blue-600'}`} />
            <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 hidden sm:inline">Photo/video</span>
          </button>
          <input type="file" ref={inputRef} onChange={getFile} hidden accept="image/*,video/*" />

          <div ref={emojiContainerRef} className="relative">
            <button 
              type="button" 
              onClick={toggleEmoji} 
              className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-amber-500 transition cursor-pointer group"
            >
              <SmilePlus className="w-[18px] h-[18px] text-amber-400 group-hover:text-amber-500" />
              <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300 group-hover:text-amber-500 hidden sm:inline">Feeling/activity</span>
            </button>
            {showEmoji && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}  
          className="flex items-center gap-1.5 px-5 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <span>Post</span>
          <FiSend className="w-4 h-4" />
        </button>
      </div>
    </div>
 </form>
    </>
  )
}
