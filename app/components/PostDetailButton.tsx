import { PostDoc } from "@/lib/common/firestore-types"
import { TimeIcon } from "@chakra-ui/icons"
import { Button, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { format } from "date-fns"

function PostDetailButton({ post }: { post: PostDoc }) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button
                position='absolute'
                width='100%'
                height='100%'
                bg='transparent'
                _hover={{ bg: 'transparent' }}
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxWidth='375px'>
                    <ModalCloseButton />
                    <ModalHeader paddingBottom={0} paddingTop={3.5}>
                        {!!post.createdAt && (
                            <HStack spacing={1}>
                                <TimeIcon width='12px' aspectRatio={1} />
                                <Text fontSize='sm' color='blackAlpha.700'>{format(post.createdAt, 'Pp')}</Text>
                            </HStack>
                        )}
                    </ModalHeader>
                    <ModalBody paddingX={0}>
                        <Image
                            objectFit='cover'
                            src={post.imageURL}
                        />
                        {!!post.content &&
                            <Text paddingX={6} paddingTop={5} paddingBottom={3}>{post.content}</Text>
                        }
                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}

export default PostDetailButton