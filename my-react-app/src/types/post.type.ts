import type { comment } from './comment.type'

export type postItem = {
  _id: string
  body: string
  image: string
  privacy: string
  user: user
  sharedPost: any
  likes: string[]
  createdAt: string
  commentsCount: number
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
  topComment?: comment | null
}

export type user = {
  _id: string
  name: string
  username: string
  photo: string
}

