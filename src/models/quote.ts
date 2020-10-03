import mongoose from "mongoose"

const Schema = mongoose.Schema

export interface IQuote extends mongoose.Document{
    userId :string,
    quote:string,
    author:string,
    words:[string],
    tags:[string],
    url:string,
    date:Date
}

const quoteSchema = new Schema({
    userId: {type: String, required: true},
    quote: {type: String, required: true},
    author: {type: String, required: true},
    words: [String],
    tags: [String],
    url: {type: String, required: true},
    date: {type: Date, requited: true}
})

export default mongoose.model<IQuote>("quote", quoteSchema)
