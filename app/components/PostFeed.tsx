import { PostDoc, SharedDoc } from "@/lib/common/firestore-types"
import { firestoreDB } from "@/lib/firebase/firebase"
import { SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { DocumentData, DocumentSnapshot, collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import PostCoverCard from "./PostCoverCard"

function PostFeed({ uid }: { uid: string }) {
    const [posts, setPosts] = useState<PostDoc[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [lastVisiblePost, setLastVisiblePost] = useState<DocumentSnapshot<DocumentData, DocumentData> | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const isFetchingRef = useRef(false)
    const isMounted = useRef(false)

    const fetchLimit = 21
    const postsPath = `users/${uid}/posts`
    const postsCollection = collection(firestoreDB, postsPath)

    const fetchMorePosts = async () => {
        // console.log(`Fetching more posts: ${isFetchingRef.current} ${hasMore}`)
        if (isFetchingRef.current || !hasMore) return
        
        // console.log(` Check: ${posts.length}, last: ${lastVisiblePost}`)
        let postQuery = query(postsCollection, orderBy(SharedDoc.Key.createdAt, 'desc'), limit(fetchLimit))
        if (!!lastVisiblePost) {
            postQuery = query(postsCollection, orderBy(SharedDoc.Key.createdAt, 'desc'), startAfter(lastVisiblePost), limit(fetchLimit))
        }

        isFetchingRef.current = true
        try {
            const documentSnapshots = await getDocs(postQuery)
            const docs = documentSnapshots.docs
            setHasMore(docs.length === fetchLimit)
            if (docs.length > 0) {
                setLastVisiblePost(docs[docs.length - 1])

                const fetchedPosts = docs.map(doc => PostDoc.fromSnapshot(doc))
                setPosts(prevPosts => [...prevPosts, ...fetchedPosts])
            }

            // console.log(`✅ Got ${docs.length} posts, last: ${docs[docs.length - 1]}, ${docs.length === fetchLimit}`)
        } catch (error: any) {
            const eMessage = error.message || error
            console.error(` Error fetching posts: ${eMessage}`)
            setErrorMessage(eMessage)
        } finally {
            isFetchingRef.current = false
        }
    }

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            fetchMorePosts()
        }
    }, [])

    useEffect(()=>{
        if (isMounted.current && posts.length < 21 && hasMore) {
            fetchMorePosts()
        }
    }, [posts])

    return (
        <VStack>
            {!!errorMessage && (
                <Text color="red.500">{errorMessage}</Text>
            )}
            <InfiniteScroll
                dataLength={posts.length}
                next={fetchMorePosts}
                hasMore={hasMore}
                loader={<Text>Loading...</Text>}
                endMessage={<Text>The end</Text>}
            >
                <SimpleGrid columns={3} spacing='6px'>
                    {
                        posts.map(post =>
                            (<PostCoverCard key={post.id} post={post} />)
                        )
                    }
                </SimpleGrid>
            </InfiniteScroll>
        </VStack>
    )
}

export default PostFeed
