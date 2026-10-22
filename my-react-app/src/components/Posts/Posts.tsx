
import { useContext, useState} from 'react'
import PostCard from '../SharedComponent/PostCard/PostCard';
import { AuthContext } from '../../context/AuthContext';
import { getAllPosts } from '../../Services/allPosts.services';
import type { postItem} from '../../types/post.type';
import {CustomStyles} from '../../components/loading/loading.tsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';



export default function Posts() {
  const {userToken} = useContext(AuthContext)

 async function allPosts(){
    try {
      if (userToken) {
        const response = await  getAllPosts(userToken)
        return response?.data
      }
    } catch (error) {
      if(axios.isAxiosError(error) && error.response?.data.message){
        toast.error(error.response.data.message)
            throw new Error("error happened here")
      }
    }


 
 }
 
 const {data , isLoading , isError } = useQuery({
  queryKey: ["allPosts", userToken],
  queryFn: allPosts,
  enabled: !!userToken,
  select(data) {
    return data.posts
  },
  retry: 2,
  retryDelay: 3500,
  refetchOnWindowFocus: true,
  gcTime:5000
})
 

  return (
    <>
    {isLoading ? (
      <CustomStyles />
    ):(
      isError ? (
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">Failed to load saved posts.</p>
        </div>
      ):(
        data?.map((post:postItem) => (
      <PostCard key={post.id}  post={post} ShowDetails={false} />
    ))
      )
    )}
    </>
  )
}
