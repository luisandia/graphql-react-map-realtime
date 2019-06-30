const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const { findOrCreateUser } = require('./controllers/userController');
const http = require('http');


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
    context: async (request) => {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = request.req ? request.req.headers.authorization : request.connection?request.connection.context.authorization:null
            if (authToken) {
                console.log(authToken)
                currentUser = await findOrCreateUser(authToken);
            }
        } catch (e) {
            console.error(e)
            throw Error(`unable to authenticate user with token ${authToken} ${e}`);
        }
        return { currentUser };
    }
});

const app = express();
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

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
// app.listen({ port: 4000 }, () =>
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
// );
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})