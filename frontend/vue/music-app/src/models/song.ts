export interface Song {
  uid: string
  url: string
  display_name: string
  original_name: string
  modified_name: string
  genre: string
  comment_count: number
}

export interface SongWithID extends Song {
  doc_id: string
}
