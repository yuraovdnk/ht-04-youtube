import {MongoClient} from "mongodb";
import {bloggerType, CommentType, postsType, UserType} from "./types";

// const t = || "mongodb://localhost:27017"
let mongoUri = process.env.MongoURI  || 'mongodb+srv://yuraovdnk:Cxo44f0Ifmg3l77X@cluster0.sbzbx.mongodb.net/?retryWrites=true&w=majority'
// if(!mongoUri){
//     mongoUri = 'mongodb+srv://yuraovdnk:sZ6ZJHPQBQIBzdU3@cluster0.sbzbx.mongodb.net/?retryWrites=true&w=majority'
// }

const client = new MongoClient(mongoUri)
const db = client.db('youtube')
export const bloggerCollection = db.collection<bloggerType>("bloggers")
export const postsCollection = db.collection<postsType>("posts")
export const usersCollection = db.collection<UserType>("users")
export const commentsCollection = db.collection<CommentType>("comments")

export async function runDb() {
    try {
        await client.connect()
        console.log("Succesfully connected to db")

    } catch (e) {
        console.log("Not connected to db")
        await client.close()
    }
}