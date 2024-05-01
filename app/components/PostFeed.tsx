import { PostDoc, SharedDoc } from "@/lib/common/firestore-types"
import { firestoreDB } from "@/lib/firebase/firebase"
import { SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { DocumentData, DocumentSnapshot, Timestamp, Unsubscribe, collection, getDocs, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import PostCoverCard from "./PostCoverCard"
import { useAuth } from "@/lib/context/authContext"

function PostFeed({ uid }: { uid: string }) {
    const [posts, setPosts] = useState<PostDoc[]>([])
    const [newPosts, setNewPosts] = useState<PostDoc[]>([])
    const [updatingPosts, setUpdatingPosts] = useState<PostDoc[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [lastVisiblePost, setLastVisiblePost] = useState<DocumentSnapshot<DocumentData, DocumentData> | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const isFetchingRef = useRef(false)
    const isMounted = useRef(false)
    const unsubscribeRef = useRef<Unsubscribe | undefined>(undefined)

    const { currentUser } = useAuth()

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
                setPosts(prevPosts => {
                    const newPostsMap = new Map(prevPosts.map(post => [post.id, post]));
                    fetchedPosts.forEach(post => {
                        if (!newPostsMap.has(post.id)) {
                            newPostsMap.set(post.id, post);
                        }
                    });
                    return Array.from(newPostsMap.values());
                });
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
        if (currentUser?.uid === uid) {
            const now = Timestamp.now()
            const postsPath = `users/${currentUser.uid}/posts`
            const postsCollection = collection(firestoreDB, postsPath)
            const newPostsQuery = query(postsCollection, where(SharedDoc.Key.updatedAt, '>', now))

            if (!!unsubscribeRef.current) {
                unsubscribeRef.current()
                unsubscribeRef.current = undefined
                console.log('🙉 unsubscribe previous post update')
            }
            console.log('🙉 subscribe post update')

            unsubscribeRef.current = onSnapshot(newPostsQuery, (querySnapshot) => {
                setUpdatingPosts(querySnapshot.docs.map(doc => PostDoc.fromSnapshot(doc)))
            })
        }

        if (!isMounted.current) {
            isMounted.current = true
            fetchMorePosts()
        }

        return () => {
            unsubscribeRef.current && unsubscribeRef.current()
        }
    }, [])

    useEffect(() => {
        if (isMounted.current && posts.length < 21 && hasMore) {
            fetchMorePosts()
        }
    }, [posts])

    useEffect(() => {
        for (let updatingPost of updatingPosts) {
            const firstPostIndex = posts.findIndex(p => p.id === updatingPost.id)
            // console.log(`✏️ firstPostIndex: ${firstPostIndex}`)

            if (firstPostIndex === -1) {
                const firstNewPostIndex = newPosts.findIndex(p => p.id === updatingPost.id)
                // console.log(`✏️ firstNewPostIndex: ${firstNewPostIndex}`)
                if (firstNewPostIndex === -1) {
                    setNewPosts(prevNewPosts => [updatingPost, ...prevNewPosts])
                } else {
                    setNewPosts(prevNewPosts => [...prevNewPosts.slice(0, firstNewPostIndex), updatingPost, ...prevNewPosts.slice(firstNewPostIndex + 1)])
                }
            } else {
                setPosts(prevPosts => [...prevPosts.slice(0, firstPostIndex), updatingPost, ...prevPosts.slice(firstPostIndex + 1)])
            }
        }
    }, [updatingPosts])

    return (
        <VStack>
            {!!errorMessage && (
                <Text color="red.500">{errorMessage}</Text>
            )}
            <InfiniteScroll
                dataLength={[...newPosts, ...posts].length}
                next={fetchMorePosts}
                hasMore={hasMore}
                loader={<Text>Loading...</Text>}
                endMessage={<Text>The end</Text>}
            >
                <SimpleGrid columns={3} spacing='6px'>
                    {
                        [...newPosts, ...posts].map(post =>
                            (<PostCoverCard key={`${post.id}_${post.updatedAt?.getUTCMilliseconds() ?? -1}`} post={post} />)
                        )
                    }
                </SimpleGrid>
            </InfiniteScroll>
        </VStack>
    )
}

export default PostFeed
