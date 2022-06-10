import {MongoClient} from "mongodb";
import {bloggerType, CommentType, postsType, UserType} from "./types";
import {settings} from "../settings";

// const t = ||

const client = new MongoClient(settings.mongoUri)
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
        console.log("Not connected to db", e)
        console.log(settings.mongoUri)
        await client.close()
    }
}