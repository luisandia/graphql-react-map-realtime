const { AuthenticationError, PubSub } = require('apollo-server');
const Pin = require('./models/Pin')
const User = require('./models/User')

const pubSub = new PubSub();
const PIN_ADDED = "PIN_ADDED"
const PIN_DELETED = "PIN_DELETED"
const PIN_UPDATED = "PIN_UPDATED"

const authenticated = next => (root, args, ctx, info) => {
    if (!ctx.currentUser) {
        throw new AuthenticationError("You must be logged in");
    }
    return next(root, args, ctx, info);
}

module.exports = {
    Query: {
        me: authenticated((root, args, ctx, info) => ctx.currentUser),
        getPins: async (root, args, ctx) => {
            const pins = await Pin.find({}).populate('author').populate('comments.author');
            return pins;
        },
        users: async (root, args, ctx) => {
            const users = await User.find({})
            return users;

        }
    },
    Mutation: {
        createPin: async (root, args, ctx) => {
            const newPin = await new Pin({
                ...args.input,
                author: ctx.currentUser._id
            }).save();
            const pinAdded = await Pin.populate(newPin, 'author')
            pubSub.publish(PIN_ADDED, { pinAdded });
            return pinAdded;
        },
        deletePin: authenticated(async (root, args, ctx) => {
            console.log(args)
            const { pinId } = args
            const pinDeleted = await Pin.findOneAndDelete({ _id: pinId }).exec()
            console.log(pinDeleted)
            pubSub.publish(PIN_DELETED, { pinDeleted });
            return pinDeleted;
        }),
        createComment: authenticated(async (root, args, ctx) => {
            const newComment = { text: args.text, author: ctx.currentUser._id }
            const pinUpdated = await Pin.findOneAndUpdate({ _id: args.pinId },
                {
                    $push: { comments: newComment }
                },
                { new: true }
            ).populate('author').populate('comments.author');
            pubSub.publish(PIN_UPDATED, { pinUpdated });
            return pinUpdated;
        })
    },
    Subscription: {
        pinAdded: {
            subscribe: () => pubSub.asyncIterator(PIN_ADDED)
        },
        pinDeleted: {
            subscribe: () => pubSub.asyncIterator(PIN_DELETED)
        },
        pinUpdated: {
            subscribe: () => pubSub.asyncIterator(PIN_UPDATED)
        }

    }
}