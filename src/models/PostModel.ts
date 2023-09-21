import { postSchemaType, userSchemaType } from "./../data/schemaTypes";
import { Schema, ToObjectOptions, model } from "mongoose";
import { fileSchemaType } from "../data/schemaTypes";
import mongooseAutoPopulate from "mongoose-autopopulate";
import FileModel from "./FileModel";

/**
 *
 *
 * Reply To Comment { user: "", parent: "", content: "" }
 * Delete Reply { user: "", replyID: "" }
 *
 * Get Comments Replies
 *
 * (Paginate Post
 * Paginate Reactions
 * Paginate Comments
 * Paginate Replies)(Cursor based pagination)
 *
 */

const creatorField = {
  ...userSchemaType,
  autopopulate: { select: "_id name username" },
};

const PostSchema = new Schema(
  {
    creator: creatorField,
    content: String,
    media: {
      ...fileSchemaType,
      autopopulate: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReactionSchema = new Schema(
  {
    user: creatorField,
    type: {
      type: String,
      enum: ["like", "dislike"],
    },
    post: postSchemaType,
  },
  {
    timestamps: true,
  }
);

const CommentSchema = new Schema(
  {
    post: postSchemaType,
    creator: creatorField,
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReplyCommentSchema = new Schema(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    creator: creatorField,
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.virtual("reactions", {
  ref: "Reaction",
  localField: "_id",
  foreignField: "post",
  autopopulate: true,
});

PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
  autopopulate: true,
  count: true,
});

PostSchema.plugin(mongooseAutoPopulate);
CommentSchema.plugin(mongooseAutoPopulate);
ReactionSchema.plugin(mongooseAutoPopulate);
ReplyCommentSchema.plugin(mongooseAutoPopulate);

const toObjectOptions: ToObjectOptions = {
  virtuals: true,
  getters: true,

  transform(doc, ret, options: any) {
    let likes = 0;
    let dislikes = 0;
    let userReaction = null;
    ret.reactions.forEach((reaction: any) => {
      if (reaction.user?._id?.toString() === options.userID) {
        userReaction = reaction.type;
      }
      if (reaction.type === "like") {
        likes++;
      } else if (reaction.type === "dislike") {
        dislikes++;
      }
    });
    ret.likes = likes;
    ret.dislikes = dislikes;
    ret.userReaction = userReaction;
    return ret;
  },
};

PostSchema.set("toJSON", toObjectOptions);
PostSchema.set("toObject", toObjectOptions);
PostSchema.set("timestamps", true);

const PostModel = model("Post", PostSchema, "posts");

// Post Belongings
const ReactionModel = model("Reaction", ReactionSchema, "reactions");
const CommentModel = model("Comment", CommentSchema, "comments");
const ReplyCommentModel = model(
  "CommentReply",
  ReplyCommentSchema,
  "commentsreplies"
);

export default PostModel;

export { ReactionModel, CommentModel, ReplyCommentModel };
