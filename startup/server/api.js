import gql from 'graphql-tag';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';

import DocumentTypes from '../../api/Documents/types';
import DocumentQueries from '../../api/Documents/queries';
import DocumentMutations from '../../api/Documents/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';

import '../../api/Documents/server/indexes';
import '../../api/OAuth/server/methods';

import Comments from '../../api/Comments/Comments';

/*
  TODO:

  Why are nested queries not working? The parent query works great, but once that's
  resolved the subfields are _not_ resolved. What's up?

  Found the answer. We need to have resolvers for Documents specifically,
  not just on the root Query.

  Also, Apollo has suggestions on modularizing the schema, though I'm not sure how
  to apply it here. https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing

  TODO New problem now that it's working: seems to call comments infinitely.
*/
console.log('DocumentTypes', DocumentTypes);

const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${DocumentTypes}
    ${CommentTypes}

    type Query {
      documents: [Document]
      document(_id: String): Document
      comments: [Comment]
      user: User
    }

    type Mutation {
      addDocument(title: String, body: String): Document
      updateDocument(_id: String!, title: String, body: String, isPublic: Boolean): Document
      removeDocument(_id: String!): Document
      addComment(documentId: String!, comment: String!): Comment
      removeComment(commentId: String!): Comment
    }
  `,
  resolvers: {
    Query: {
      ...DocumentQueries,
      ...CommentQueries,
      ...UserQueries,
    },
    Mutation: {
      ...DocumentMutations,
      ...CommentMutations,
    },
    Document: {
      comments: (parent, args) => {
        console.log('Document Comments api queries', parent, args);
        return Comments.find({ documentId: args.documentId }).fetch();
      },
    },
    // Subscription: {
    //   ...DocumentSubscriptions,
    // },
  },
};

export default schema;
