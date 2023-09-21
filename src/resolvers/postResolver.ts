import mongoose from "mongoose";
import PostModel, { CommentModel, ReactionModel } from "../models/PostModel";
import authResolver from "../resolversMiddlewares/authResolver";
import uploadFileResolver from "../resolversMiddlewares/uploadFileResolver";
import postService, {
  commentService,
  reactionService,
} from "../services/postService";
import { TObject } from "../types/object";

const extractReactionArgs = (args: TObject) => {
  const { userID, data } = args;
  return {
    postID: data.postID,
    userID,
  };
};

export default {
  Query: {
    getProfilePosts: authResolver(async (_, args) => {
      const posts = await postService.getUserPosts(args.userID, args.userID);
      return posts;
    }),
    getPostReactions: authResolver(async (_, args) => {
      const { id } = args;
      const response = await reactionService.getGroupedPostReactions(id);
      return response;
    }),
    getPostComments: authResolver(async (_, args) => {
      const { id } = args;
      const comments = await commentService.getPostComments(id);
      return comments;
    }),
  },
  Mutation: {
    createPost: authResolver(
      uploadFileResolver(async (parent, args, context, info) => {
        const {
          userID,
          data: { content },
          mediaID,
        } = args;

        try {
          const post = await postService.create({
            media: mediaID,
            content,
            creator: userID,
          });

          return post;
        } catch (error) {
          console.log(error);
        }
      }, "data.media")
    ),
    updatePost: authResolver(async (_, args) => {
      const { id, userID, content } = args;

      const post = await postService.update(id, userID, content);

      return post;
    }),
    deletePost: authResolver(async (parent, args) => {
      const { userID, id } = args;
      // console.log({ userID, id });
      await postService.deleteUserPost(id, userID);
      return true;
    }),

    // Reactions
    likePost: authResolver(async (parent, args, context, info) => {
      const { userID, postID } = extractReactionArgs(args);
      // console.log({ args });
      const reaction = await reactionService.reactOnPost(
        userID,
        postID,
        "like"
      );
      return reaction;
    }),
    dislikePost: authResolver(async (parent, args, context, info) => {
      const { userID, postID } = extractReactionArgs(args);
      const reaction = await reactionService.reactOnPost(
        userID,
        postID,
        "dislike"
      );
      return reaction;
    }),
    removeLike: authResolver(async (parent, args, context, info) => {
      const { userID, postID } = extractReactionArgs(args);
      const reaction = await reactionService.deleteLike(userID, postID);
      return {
        post: postID,
        type: null,
        user: (reaction as any)?.user || null,
      };
    }),

    // Comments
    createComment: authResolver(async (_, args) => {
      const {
        userID,
        data: { postID, content },
      } = args;
      const comment = await commentService.commentOnPost(
        userID,
        postID,
        content
      );
      return comment;
    }),

    deleteComment: authResolver(async (_, args) => {
      const { id, userID } = args;
      await commentService.delete({ creator: userID, _id: id });
      return true;
    }),
  },
};
