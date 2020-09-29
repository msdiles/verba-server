import mongoose from "mongoose"

const Schema = mongoose.Schema

interface IMeaning {
    meaning: string,
    tags: [string],
    id: string
}

export interface IWord{
    word:string,
    meanings:[IMeaning]
}

const meaningsSchema = new Schema({
    meaning: {type: String, required: true},
    tags: [String]
})

const wordSchema = new Schema({
    word: {type: String, required: true},
    meanings: [meaningsSchema]
})

export default mongoose.model("word", wordSchema)
