export default `#graphql

    type PostCreator {
        _id: String
        username: String
        name: String
    }

    type Post {
        _id: String
        creator: PostCreator
        content: String
        media: File
        likes: Int
        dislikes: Int
        comments: Int
        userReaction: String
    }

    input PostInput {
        media: Upload
        content: String
    }


    # Comments
    input CreateCommentInput {
        postID: ID
        content: String
    }

    type Comment {
        _id: ID
        post: ID
        content: String
        creator: PostCreator
    }

    # Reactions
    # type PostReactionMutation {
    #     postID: String
    #     type: String
    # }

    input LikePostInput {
        postID: String
    }

    type PostReaction {
        _id: ID
        user: PostCreator
        type: String
        post: ID
    }

    type GroupedPostReactions {
        likes: [PostReaction!]!
        dislikes: [PostReaction!]!
    }

    # Query

    type Query {
        getProfilePosts: [Post!]!
        getPostReactions(id: ID): GroupedPostReactions!
        getPostComments(id: ID): [Comment!]!
    }

    type Mutation {
        # post
        createPost(data: PostInput): Post
        updatePost(id: ID, content: String): Post
        deletePost(id: ID): Boolean
        # reactions
        likePost(data: LikePostInput): PostReaction
        dislikePost(data: LikePostInput): PostReaction
        removeLike(data: LikePostInput): PostReaction
        # comments
        createComment(data: CreateCommentInput): Comment
        deleteComment(id: ID): Boolean
        # deleteComment(id: ID): Boolean
    }
`;
