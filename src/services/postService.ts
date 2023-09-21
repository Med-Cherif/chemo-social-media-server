import { toObjectPost } from "../helpers/toObjectPost";
import postRepository, {
  commentRepository,
  reactionRepository,
} from "../repositories/postRepository";
import { TObject } from "../types/object";

const postService = {
  getUserPosts(creator: string, userID: string) {
    return postRepository.getPosts(userID, { creator });
  },
  create(data: TObject) {
    return postRepository.create(data);
  },
  update(_id: string, creator: string, content: string) {
    return postRepository.update(creator, { _id, creator }, { content });
  },
  deleteUserPost(_id: string, creator: string) {
    return postRepository.deleteOne({ _id, creator });
  },
};

const reactionService = {
  async getGroupedPostReactions(id: string) {
    const groupedReactions = await reactionRepository.getGroupedReactionsByPost(
      id
    );

    const data = {
      likes: [],
      dislikes: [],
    };

    groupedReactions.forEach((reaction) => {
      const key = reaction._id === "like" ? "likes" : "dislikes";
      data[key] = reaction.reactions;
    });

    return data;
  },
  async reactOnPost(userID: string, postID: string, type: string) {
    const filterQuery = {
      user: userID,
      post: postID,
    };
    let reaction = await reactionRepository.update(filterQuery, {
      $set: { type },
    });
    if (!reaction) {
      reaction = await reactionRepository.create({
        ...filterQuery,
        type,
      });
    }

    return reaction;
  },
  async deleteLike(userID: string, postID: string) {
    return reactionRepository.deleteOne({ user: userID, post: postID });
  },
};

const commentService = {
  getPostComments(post: string) {
    return commentRepository.find({ post });
  },
  commentOnPost(creator: string, post: string, content: string) {
    return commentRepository.create({
      creator,
      post,
      content,
    });
  },
  delete(filter: TObject) {
    return commentRepository.deleteOne(filter);
  },
};

export default postService;

export { reactionService, commentService };
