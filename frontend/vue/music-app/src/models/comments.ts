export interface Comment {
  content: string
  datePosted: string
  sid: string
  name: string
  uid: string
}

export interface CommentWithID extends Comment {
  doc_id: string
}
