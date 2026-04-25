import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { 
        type: String, 
        minlength: 5, 
        maxlength: 30, 
        required: true 
    },
    content: { 
        type: String, 
        minlength: 10, 
        required: true 
    },
    hashtags: [String], 
    imageUrl: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model("Post", postSchema);