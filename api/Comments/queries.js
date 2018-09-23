import Comments from './Comments';

export default {
  comments: (parent, args) => {
    console.log('Comments api queries', parent, args);
    return Comments.find({ documentId: args.documentId }).fetch();
  },
};
