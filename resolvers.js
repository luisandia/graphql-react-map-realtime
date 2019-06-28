const { AuthenticationError } = require('apollo-server');

const user = {
    _id: "1",
    name: "Luis",
    email: "luis@gmail.com",
    picture: "https://d2h1pu99sxkfvn.cloudfront.net/b0/10964942/454135003_CPbnMylD9z/P6.jpg"
}

const authenticated = next => (root, args, ctx, info) => {
    if (!ctx.currentUser) {
        throw new AuthenticationError("You must be logged in");
    }
    return next(root, args, ctx, info);
}

module.exports = {
    Query: {
        me: authenticated((root, args, ctx, info) => ctx.currentUser)
    }
}