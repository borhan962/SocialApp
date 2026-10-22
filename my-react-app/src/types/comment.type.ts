export type comment = {
  _id: string
  content: string
  commentCreator: commentCreator
  post: string
  parentComment: any
  likes: any[]
  createdAt: string
}

export type commentCreator = {
  _id: string
  name: string
  username: string
  photo: string
}