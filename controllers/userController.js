const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
    const googleUser = await VerifyAuthToken(token);
    const { email } = googleUser.payload;
    console.log("emamil", email);
    const user = await checkIfUserExists(email);
    return user ? user : createNewUser(googleUser);
}

const VerifyAuthToken = async token => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID
        });
        return ticket;
    } catch (e) {
        console.error("Error verifying auth token ", e);
    }
}

const checkIfUserExists = async email => await User.findOne({ email }).exec();

const createNewUser = googleUser => {
    console.log("Creatingg user");
    const { name, email, picture } = googleUser.payload;
    const user = { name, email, picture };
    return new User(user).save();

}


