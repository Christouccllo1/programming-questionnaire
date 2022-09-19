const mongoose = require("mongoose")
const Schema = mongoose.Schema
const QuestionSchema = new Schema({
    question: {
        type: String
    },
    Answer: {
        type: String
    },
    username: {
        type: String
    },
    category: {
        type: Number
    }
}, { timestamps: true })


const Question = mongoose.model("Question", QuestionSchema)
module.exports = Question