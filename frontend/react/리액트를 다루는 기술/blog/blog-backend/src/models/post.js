import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});

const Post = mongoose.model('Post', PostSchema); // 스키마 이름과 스키마 객체를 파라미터로 넣어준다. => 스키마 이름을 정해주면 데이터베이스가 그 이름의 복수 형태로 db에 컬렉션을 만든다.
export default Post;

// const AuthorSchema = new Schema({
//   name: String,
//   email: String,
// });
// const BookSchema = new Schema({
//   title: String,
//   description: String,
//   authors: [AuthorSchema], // 스키마 내부에 다른 스키마를 내장시킬 수도 있다.
//   meta: {
//     likes: Number,
//   },
//   extra: Schema.Types.Mixed,
// });

/**
 * Schema 에서 지원하는 타입
 * 타입     |   설명
 * String       문자열
 * Number       숫자
 * Date         날짜
 * Buffer       파일을 담을 수 있는 버퍼
 * Boolean      true 또는 false
 * Mixed        어떤 데이터도 넣을 수 있는 형식
 * ObjectId     객체 아이디, 주로 다른 객체를 참조할 때 넣음
 * Array        배열 형태의 값. []로 감싸서 사용
 */
