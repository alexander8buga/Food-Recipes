export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img){
    const like = {
      id, title, author, img
    }
    this.likes.push(like);
    return like;
  }

  deleteLike(id){
    const index = this.likes.findIndex(el => el.id === id);
    // [2,5,7] splice(1,2) --> returns [5,7], original array is [2]
    // [2,5,7] slice(1,2) --> returns 7, original array is [2,5,7]
    // [2,5,7] slice(1,1)--> returns nothing!, original array is [2,5,7]
    this.likes.splice(index, 1);
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;

  }

  getNumLikes() {
    return this.likes.length;
  }
}
