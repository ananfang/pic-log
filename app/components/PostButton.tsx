import { FirestoreKey } from "@/lib/common/firestore-keys"
import { useAuth } from "@/lib/context/authContext"
import { firestoreDB } from "@/lib/firebase/firebase"
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure } from "@chakra-ui/react"
import { DocumentData, WithFieldValue, addDoc, collection, serverTimestamp } from "firebase/firestore"
import { ChangeEventHandler, useState } from "react"

const MAX_LENGTH = 144

const PostButton = () => {
    const { currentUser } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [isPosting, setIsPosting] = useState(false)
    const [errorMessage, setErrorMessage] = useState(undefined)

    const [value, setValue] = useState('')
    const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
        const inputValue = event.target.value
        if (inputValue.length <= MAX_LENGTH) {
            setValue(inputValue)
        }
    }

    const handleClose = () => {
        setValue('')
        onClose()
    }

    const handlePost = async () => {
        if (currentUser?.uid === undefined || value.length === 0) {
            return
        }

        const postCollection = collection(firestoreDB, `users/${currentUser.uid}/posts`)
        var postData: WithFieldValue<DocumentData> = {}
        postData[FirestoreKey.Shared.createdAt] = serverTimestamp()
        postData[FirestoreKey.Shared.updatedAt] = serverTimestamp()
        postData[FirestoreKey.Post.content] = value

        setErrorMessage(undefined)
        setIsPosting(true)
        try {
            const docRef = await addDoc(postCollection, postData)
            console.log('☕️ Document written with ID: ', docRef.id)

            handleClose()
        } catch (error: any) {
            const eMessage = error.message ?? error
            console.error('Post error: ', eMessage)
            setErrorMessage(eMessage)
        } finally {
            setIsPosting(false)
        }

    }

    return (
        <>
            <Button colorScheme="pink" variant='outline' onClick={onOpen}>Post</Button>

            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader />
                    <ModalCloseButton />
                    <ModalBody>
                        <Textarea
                            value={value}
                            onChange={handleInputChange}
                            placeholder="What's on your mind?"
                            size='sm'
                        />
                        <Text fontSize='sm' color='gray.400'>
                            {value.length}/{MAX_LENGTH}
                        </Text>
                        {errorMessage &&
                            <Text fontSize='sm' color='red.500'>{errorMessage}</Text>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} marginEnd={3} colorScheme="gray">Cancel</Button>
                        <Button
                            colorScheme="pink"
                            variant='outline'
                            onClick={handlePost}
                            isDisabled={value.length === 0 || isPosting}
                            isLoading={isPosting}
                            loadingText='Posting...'
                        >
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PostButton
