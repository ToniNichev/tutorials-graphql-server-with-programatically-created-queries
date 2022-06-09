var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var graphql = require('graphql');

// Maps id to User object
var fakeDatabase = [
  {
    id: 1,
    name: 'alice',
  },
  {
    id: 2,
    name: 'bob',
  },
  {
    id: 3,
    name: 'john',
  },
];

// Define the User type
var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
  }
});

// Define the Query type
var RootQuery = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    getUser: {
      type: userType,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: graphql.GraphQLInt }
      },
      resolve: (_, {id}) => {
        return fakeDatabase[id];
      }
    },
    getAllUsers: {
        type: new graphql.GraphQLList(userType),
        resolve: () => {
            return fakeDatabase;
        }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: RootQuery});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');