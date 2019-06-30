const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const { findOrCreateUser } = require('./controllers/userController');


require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log("DB UP!");
}).catch((e) => {
    console.error(e);
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = req.headers.authorization ;
            if (authToken) {
                currentUser = await findOrCreateUser(authToken);
            }
        } catch (e) {
            console.error(`unable to authenticate user with token ${authToken}`)
            throw Error(`unable to authenticate user with token ${authToken}`);
        }
        return { currentUser };
    }
});

const app = express();
server.applyMiddleware({ app });

if (process.env.NODE_ENV === 'production') {
    /*express will serve rup production assets e.g main.js, main.css */

    app.use(express.static('client/build'));

    // express will serve up index.html if doesnt reconize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './client', 'build', 'index.html'));
    });
}

// app.listen(process.env.PORT || 4000).then(({ url }) => {
//     console.log(`Apollo server listen: ${url}`);
// });
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);