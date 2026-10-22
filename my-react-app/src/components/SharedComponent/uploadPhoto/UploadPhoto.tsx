import React, { useRef, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { userDataContext } from '../../../context/userDataContext'
import { uploadUserPhoto } from '../../../Services/uploadPhoto.services'
import { getUserData } from '../../../Services/userprofile.services'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Camera } from 'lucide-react'

export default function UploadPhoto() {
    const { userToken } = useContext(AuthContext)
    const { userData, setUserData } = useContext(userDataContext)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const userPhoto = userData?.data?.user?.photo;
    const userName = userData?.data?.user?.name || "User";

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData: FormData) => {
            if (!userToken) throw new Error("No token");
            return await uploadUserPhoto(userToken, formData);
        },
        onSuccess: async (response: any) => {
            toast.success(response?.message || "Profile photo updated successfully!");
            // Refresh user data to get the new photo
            if (userToken) {
                const updatedData = await getUserData(userToken);
                setUserData(updatedData);
            }
        },
        onError: (error: any) => {
            console.error("Upload photo error:", error);
            toast.error(error?.response?.data?.message || "Failed to upload photo. Please try again.");
        }
    });

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }

            const fd = new FormData();
            fd.append("photo", file);
            mutate(fd);
        }
    }

    return (
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img 
                src={userPhoto} 
                alt={userName}
                className={`w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg ${isPending ? 'opacity-50' : ''}`}
            />
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                    <Camera className="w-6 h-6 text-white" />
                    <span className="text-white text-[10px] font-medium mt-0.5">
                        {isPending ? 'Uploading...' : 'Change Photo'}
                    </span>
                </div>
            </div>

            {/* Loading spinner overlay */}
            {isPending && (
                <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                hidden 
                accept="image/*" 
            />
        </div>
    )
}
