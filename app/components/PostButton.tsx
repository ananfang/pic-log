import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure } from "@chakra-ui/react"
import { ChangeEventHandler, useState } from "react"

const MAX_LENGTH = 144

const PostButton = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

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
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} marginEnd={3} colorScheme="gray">Cancel</Button>
                        <Button colorScheme="pink" variant='outline' onClick={onClose}>Post</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PostButton
