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
const { getFirestore, Timestamp } = require("firebase-admin/firestore")
const { getStorage, getDownloadURL } = require('firebase-admin/storage')
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { default: OpenAI } = require("openai");
const dotenv = require('dotenv')

// dotenv
dotenv.config()

// Firebase
initializeApp()
const firestoreDB = getFirestore()
const storageBucket = getStorage().bucket()

// Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" })

// OpenAI
const openaiViaHelicone = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://oai.hconeai.com/v1',
    defaultHeaders: {
        'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`
    }
})

exports.createpost = onDocumentCreated({
    document: 'users/{userId}/posts/{postId}',
    timeoutSeconds: 540
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

    const userId = event.params.userId
    const postId = event.params.postId
    const postRef = firestoreDB.doc(`users/${userId}/posts/${postId}`)
    
    await postRef.update({
        status: 'isProcessing',
        updatedAt: Timestamp.now()
    })

    const prompt = `## Post Content
${content}

## Task
Generate an illustration topic within 32 English characters based on above Post Content. Be creative, minimalist, and focus on describing how it will look, not the drawing style. If the content is unsafe for illustration, generate a safe and general illustration topic.`
    try {
        const result = await geminiModel.generateContent(prompt)
        const response = await result.response
        const topic = response.text()

        await postRef.update({
            topic,
            updatedAt: Timestamp.now()
        })

        console.log('🤓 Post\'s topic updated')

        const imagePrompt = `Artistic Anime, capturing simplicity and essence with a hint of cuteness. Use clean, simple lines and a soft, muted color palette, focusing on strong design elements without intricate details. The background should be sparse, enhancing the serene and emotive atmosphere of the theme:\n${topic}`

        const imageResult = await openaiViaHelicone.images.generate({
            model: 'dall-e-3',
            prompt: imagePrompt,
            response_format: 'b64_json',
        })

        const imageData = imageResult.data[0]
        const imageDataRevisedPrompt = imageData?.revised_prompt
        const imageDataB64 = imageData?.b64_json

        if (!!imageDataB64) {
            const filename = `${Date.now()}.png`
            const filePath = `users/${userId}/posts/${postId}/${filename}`
            const imageDataBuffer = Buffer.from(imageDataB64, 'base64')

            const fileStorageRef = storageBucket.file(filePath)
            await fileStorageRef.save(imageDataBuffer, {
                contentType: 'image/png',
            })


            const downloadURL = await getDownloadURL(fileStorageRef)

            await postRef.update({
                imageURL: downloadURL,
                revisedPrompt: imageDataRevisedPrompt,
                status: 'isFinished',
                updatedAt: Timestamp.now()
            })

            console.log('🥸 Post\'s image updated')
        } else {
            await postRef.update({
                status: 'hasError',
                updatedAt: Timestamp.now()
            })
        }
    } catch (error) {
        console.log('🚨 Gemini error when the post is created: ', error)
        await postRef.update({
            status: 'hasError',
            updatedAt: Timestamp.now()
        })
    }
})
