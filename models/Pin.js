const { mongoose } = require('mongoose');


const PinSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    latitude: Number,
    longiture: Number,
    author: { type: mongoose.Schema.OjectId, ref: "User" },
    comment: [{
        text: String,
        createAt: { type: Date, default: Date.now },
        author: { type: mongoose.Schema.OjectId, ref: "User" },
    }]
}, { timestamps: true });



module.exports = mongoose.model('Pin', PinSchema);