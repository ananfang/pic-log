import { PostDoc } from "@/lib/common/firestore-types"
import { ViewIcon } from "@chakra-ui/icons"
import { Box, Card, CircularProgress, Image, Text, VStack } from "@chakra-ui/react"
import PostDetailButton from "./PostDetailButton"

const COVER_PLACEHOLDER_URLS = [
    "https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/server%2Fasset%2Fimage%2Fplaceholder%2FPlaceholder_1.webp?alt=media&token=01746e46-b3a3-449b-9a50-2384a3ad77be",
    "https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/server%2Fasset%2Fimage%2Fplaceholder%2FPlaceholder_2.webp?alt=media&token=58567614-e342-4de5-b4a5-21cf347987d0",
    "https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/server%2Fasset%2Fimage%2Fplaceholder%2FPlaceholder_3.webp?alt=media&token=a017a310-2b96-4d39-80f2-4f2c21ba38fd",
    "https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/server%2Fasset%2Fimage%2Fplaceholder%2FPlaceholder_4.webp?alt=media&token=b7bd4beb-9d77-4e8e-889e-741e117786a8",
    "https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/server%2Fasset%2Fimage%2Fplaceholder%2FPlaceholder_5.webp?alt=media&token=4ef77381-7e3e-4183-8bb2-e8ba34c62a95"
]

function PostCoverCard({ post }: { post: PostDoc }) {
    const randomIndex = Math.floor(Math.random() * COVER_PLACEHOLDER_URLS.length)
    const placeholderURL = COVER_PLACEHOLDER_URLS[randomIndex]

    return (
        <Card width='126px' aspectRatio={1} overflow='hidden'>
            {!!post.imageURL ?
                (
                    <>{/* Has Image */}
                        <Image
                            objectFit='cover'
                            src={post.imageURL}
                        />

                        {/* Overlay Content */}
                        <Box
                            position='absolute'
                            top='0'
                            left='0'
                            right='0'
                            bottom='0'
                            opacity='0'
                            bg='blackAlpha.600'
                            color='white'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            _hover={{ opacity: 1 }}
                        >
                            <VStack>
                                <Text margin={1} noOfLines={2} userSelect='none' align='center'>
                                    {post.content}
                                </Text>
                                <ViewIcon />
                            </VStack>
                            <PostDetailButton post={post} />
                        </Box>
                    </>
                ) :
                (
                    post.status === 'hasError' ?
                        (
                            <>
                                <Box
                                    position='absolute'
                                    top='0'
                                    left='0'
                                    right='0'
                                    bottom='0'
                                    bg='blackAlpha.500'
                                    color='white'
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                >
                                    <VStack>
                                        <Text margin={1} noOfLines={2} userSelect='none' align='center'>
                                            {post.content}
                                        </Text>
                                        <ViewIcon />
                                    </VStack>
                                    <PostDetailButton post={post} />
                                </Box>
                            </>
                        ) :
                        (
                            <>{/* No Image */}
                                <Image
                                    objectFit='cover'
                                    src={placeholderURL}
                                />

                                {/* Overlay Content */}
                                <Box
                                    position='absolute'
                                    top='0'
                                    left='0'
                                    right='0'
                                    bottom='0'
                                    bg='blackAlpha.700'
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                >
                                    <VStack>
                                        <CircularProgress isIndeterminate color='red.300' />
                                    </VStack>
                                </Box>
                            </>
                        )
                )
            }

        </Card>
    )
}

export default PostCoverCard