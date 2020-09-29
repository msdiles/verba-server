import mongoose from "mongoose"

export default async () => {
    try {
        await mongoose.connect(<string>process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to mongodb")
    } catch (e) {
        console.log(e)
    }
}