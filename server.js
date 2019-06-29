const { ApolloServer } = require('apollo-server');

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

server.listen(process.env.PORT || 4000).then(({ url }) => {
    console.log(`Apollo server listen: ${url}`);
});
