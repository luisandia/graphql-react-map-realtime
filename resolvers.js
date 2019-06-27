const user = {
    _id: "1",
    name: "Luis",
    email: "luis@gmail.com",
    picture: "https://d2h1pu99sxkfvn.cloudfront.net/b0/10964942/454135003_CPbnMylD9z/P6.jpg"
}
module.exports = {
    Query: {
        me: () => user
    }
}