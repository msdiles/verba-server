import mongoose from "mongoose"

const Schema = mongoose.Schema

export interface IQuote extends mongoose.Document {
    userId: string,
    quote: string,
    author: string,
    words: [string],
    tags: [string],
    url: string,
    date: Date,
    inspiration: boolean,
    favorite: [string],
    language:string
}

const quoteSchema = new Schema({
    userId: {type: String, required: true},
    quote: {type: String, required: true},
    author: {type: String, required: true},
    words: [String],
    tags: [String],
    url: {type: String, required: true},
    date: {type: Date, requited: true},
    inspiration: {type: Boolean, required: true},
    favorite: [String],
    language:{type:String,default:"eng"}
})

export default mongoose.model<IQuote>("quote", quoteSchema)
