import mongoose from "mongoose"

const Schema = mongoose.Schema

interface IMeaning {
  meaning: string,
  tags: [string],
  id: string,

}

export interface IWord extends mongoose.Document{
  userId: string,
  word: string,
  meanings: [IMeaning],
  favorite: [string],
  language: string,
  date: Date,
}

const meaningsSchema = new Schema({
  meaning: {type: String, required: true},
  tags: [String],

})

const wordSchema = new Schema({
  userId: {type: String, required: true},
  word: {type: String, required: true},
  meanings: [meaningsSchema],
  favorite: [String],
  language: {type: String, default: "eng"},
  date: {type: Date, requited: true},
})

export default mongoose.model<IWord>("word", wordSchema)
