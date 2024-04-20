/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

initializeApp()
const firestoreDB = getFirestore()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" })

exports.createpost = onDocumentCreated({
    document: 'users/{userId}/posts/{postId}',
    timeoutSeconds: 15 * 60
}, async (event) => {
    const snapshot = event.data
    if (!snapshot) {
        console.log('🫨 No data associated with the event')
        return
    }

    const data = snapshot.data()
    console.log('Post created: ', snapshot.id, ', data: ', data)

    const content = data.content
    if (!content) {
        console.log('🫨 No content of this Post')
        return
    }

    const prompt = `## Post Content
${content}

## Task
Generate an illustration topic within 32 English characters based on above Post Content. Be creative, minimalist, and focus on describing how it will look, not the drawing style. If the content is unsafe for illustration, generate a safe and general illustration topic.`
    try {
        const result = await geminiModel.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        const userId = event.params.userId
        const postId = event.params.postId

        const postRef = firestoreDB.doc(`users/${userId}/posts/${postId}`)
        await postRef.update({
            topic: text
        })

        console.log('🤓 Post updated')
    } catch (error) {
        console.log('🚨 Gemini error when the post is created: ', error)
    }
})
