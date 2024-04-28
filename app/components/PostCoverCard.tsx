import { PostDoc } from "@/lib/common/firestore-types"
import { ViewIcon } from "@chakra-ui/icons"
import { Box, Card, Image, Text, VStack } from "@chakra-ui/react"
import PostDetailButton from "./PostDetailButton"

function PostCoverCard({ post }: { post: PostDoc }) {
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
                                <Text margin={1} noOfLines={2} userSelect='none'>
                                    {post.content}
                                </Text>
                                <ViewIcon />
                            </VStack>
                            <PostDetailButton post={post}/>
                        </Box>
                    </>
                ) :
                (
                    <>{/* No Image */}
                        <Text>Generating</Text>
                    </>
                )
            }

        </Card>
    )
}

export default PostCoverCard