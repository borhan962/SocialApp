import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { getSinglePost } from '../../Services/singlePost.services'
import { useQuery } from '@tanstack/react-query'
import { CustomStyles } from '../../components/loading/loading'
import PostCard from '../../components/SharedComponent/PostCard/PostCard'

export default function PostDetails() {
  const { postId } = useParams()
  const { userToken } = useContext(AuthContext)


  async function getSinglePostData() {

    if (!userToken || !postId) {
      throw new Error("Missing token or postId")
    }

    const response = await getSinglePost(userToken, postId)


    return response.data.post
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["PostDetails", postId],
    queryFn: getSinglePostData,
    enabled: !!userToken && !!postId,
  })



  return (
    <div className='flex justify-center'>
      {isLoading ? (
        <CustomStyles />
      ) : isError ? (
        <p>Failed to load post.</p>
      ) : data ? (
        <PostCard post={data} ShowDetails={true}  />
      ) : (
        <p>No post found.</p>
      )}
    </div>
  )
}