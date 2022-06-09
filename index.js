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
const userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: graphql.GraphQLInt },
        name: { type: graphql.GraphQLString },
    }
});

const allUsersType = new graphql.GraphQLObjectType({
    name: 'AllUsersType',
    fields: {
        count: { type: graphql.GraphQLInt },
        label: { type: graphql.GraphQLString },
        allUsersList: { type: new graphql.GraphQLList(userType) },
    }
});

// Define the Query type
const RootQuery = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        // return userType
        getUser: {
            description: "get singhle user",
            type: userType,
            // `args` describes the arguments that the `user` query accepts
            args: {
                id: { type: graphql.GraphQLInt }
            },
            resolve: (_, { id }) => {
                return fakeDatabase[id];
            }
        },
        // return a list of userType (an array)
        getAllUsers: {
            description: "get all users",
            type: new graphql.GraphQLList(userType),
            resolve: () => {
                return fakeDatabase;
            }
        },
        // return object on allUserType
        getAllUsersList: {
            description: "get all users",
            type: allUsersType,
            args: {
                label: { type: graphql.GraphQLString },
            },
            resolve: (_, { label } ) => {
                return {
                    count: fakeDatabase.length,
                    label: label,
                    allUsersList: fakeDatabase,
                }
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({ query: RootQuery });

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');