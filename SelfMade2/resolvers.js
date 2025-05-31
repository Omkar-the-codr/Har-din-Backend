const Post = require('./post.js');
const resolvers = {
  Query: {
    hello: () => {
      return "Hello World!";
    },
    getAll: async () => {
        return await Post.find();
    },
},
Mutation: {
    createPost:  async (parent, args, context, info) => {
        const {title, description} = args.post;
        const post = await new Post({title, description}).save();
        return post;
    },
    updatePost: async (parent, args) => {
        const {id} = args;
        const {title, description} = args.post;
        const updatedPost = await Post.findByIdAndUpdate(id , {title, description}, {new: true});
        return updatedPost;
    },
    deletePost: async (parent, args)=> {
        const {id} = args;
        const deletePost = await Post.findByIdAndDelete(id);
        return deletePost;
    }
}
    
  };


module.exports = resolvers; 