import mongoose, {
  FilterQuery,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import PostModel, { CommentModel, ReactionModel } from "../models/PostModel";
import { TObject } from "../types/object";
import { toObjectPost } from "../helpers/toObjectPost";

type TCommonFilterQuery = FilterQuery<TObject>;

const postRepository = {
  getPosts(
    userID?: string | null,
    filter: FilterQuery<TObject> = {},
    projection: ProjectionType<TObject> = {},
    options: QueryOptions<TObject> = { sort: { createdAt: 1 } }
  ) {
    return PostModel.find(filter, projection, options).transform((docs) =>
      docs.map((doc) => toObjectPost(doc, userID))
    );
  },
  create(data: TObject) {
    return PostModel.create(data).then((doc) => toObjectPost(doc, null));
  },
  update(
    userID: string | undefined,
    filter: TCommonFilterQuery,
    data: TObject
  ) {
    return PostModel.findOneAndUpdate(filter, { $set: data }, { new: true })
      .orFail()
      .then((doc) => (doc as any).toObject({ userID }));
  },
  deleteOne(filter: FilterQuery<TObject>) {
    return PostModel.findOneAndDelete(filter).orFail();
  },
};

const reactionRepository = {
  getGroupedReactionsByPost(id: string) {
    return ReactionModel.aggregate(
      [
        {
          $match: {
            post: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "user",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            "user.name": 1,
            "user.username": 1,
            "user._id": 1,
            post: 1,
            type: 1,
            createdAt: 1,
          },
        },
        {
          $group: {
            _id: "$type",
            reactions: {
              $push: "$$ROOT",
            },
          },
        },
      ],
      {
        allowDiskUse: true,
      }
    );
  },
  getOne(filter: TCommonFilterQuery = {}) {
    return ReactionModel.findOne(filter);
  },
  update(filterQuery: TCommonFilterQuery, updateQuery: UpdateQuery<TObject>) {
    return ReactionModel.findOneAndUpdate(filterQuery, updateQuery, {
      new: true,
    });
  },
  create(data: TObject) {
    return ReactionModel.create(data);
  },
  deleteOne(filter: TCommonFilterQuery) {
    return ReactionModel.findOneAndDelete(filter);
  },
};

const commentRepository = {
  find(filter: TCommonFilterQuery) {
    return CommentModel.find(filter);
  },
  create(data: TObject) {
    return CommentModel.create(data);
  },
  deleteOne(filter: TCommonFilterQuery) {
    return CommentModel.findOneAndDelete(filter).orFail();
  },
};

export default postRepository;

export { reactionRepository, commentRepository };
