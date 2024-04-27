'use client'

import { useAuth } from "@/lib/context/authContext";
import { Avatar, Box, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PostButton from "./components/PostButton";
import { DocumentData, QueryDocumentSnapshot, Timestamp, collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "@/lib/firebase/firebase";
import PostCoverCard from "./components/PostCoverCard";
import { PostDoc } from "@/lib/common/firestore-types";

const DummyPosts = [
  {
    id: 'this is the id',
    content: '今天在東京遇到一位可愛的女孩',
    imageURL: 'https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/users%2FgoujTvBCXEfvSiKDuo1qiA6wLQn1%2Fposts%2F4aEddVerLX6RcSd8PV8F%2F1713887117776.png?alt=media&token=b40962f1-b9b5-4d81-8818-8b5f778f0982',
    createdAt: Timestamp.now()
  },
  {
    id: 'this is the id',
    content: '今天的天氣真好，早上遇到一位跳舞的女孩',
    imageURL: 'https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/users%2FgoujTvBCXEfvSiKDuo1qiA6wLQn1%2Fposts%2F3vU3V5JvYDc8s4TJQr1r%2F1714086720242.png?alt=media&token=65ad212b-d274-4923-9e22-36160de4e68f',
    createdAt: Timestamp.now()
  },
]

export default function Home() {
  const { currentUser, logInWithGoogle, logOut, errorMessage: authErrorMessage, isInitialized: authIsInitialized, isLoading: authIsLoading, initialize: authInitialize } = useAuth()
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([])

  useEffect(() => {
    if (authErrorMessage) {
      console.log(authErrorMessage)
    }

    if (!authIsInitialized) {
      console.log('🍾 auth is not initialized')
      authInitialize()
    }
  }, [])

  const fetchPosts = async () => {
    if (!currentUser) {
      return
    }

    const postsPath = `users/${currentUser.uid}/posts`
    const postsCollection = collection(firestoreDB, postsPath)
    const querySnapshot = await getDocs(postsCollection)

    console.log(querySnapshot.docs.length)
    setPosts(querySnapshot.docs)
  }

  return (
    <Box bg='tomato' maxWidth='390px' marginX='auto'>
      <Text fontSize='xl'>Pic Log: Capture your words in a pic</Text>
      <Text fontSize='sm'>is initialized: {authIsInitialized ? 'true' : 'false'}</Text>
      {authIsInitialized && (
        <>
          {
            (currentUser === null) ?
              <Button colorScheme='blue' size='xs' onClick={logInWithGoogle}>Login</Button> :
              <>
                <Avatar name={currentUser.displayName ?? undefined} src={currentUser.photoURL ?? undefined} />
                <Text>{currentUser.displayName}</Text>
                <Button colorScheme='blue' size='xs' onClick={logOut}>Logout</Button>
                <Button colorScheme='purple' size='xs' onClick={fetchPosts}>Fetch</Button>
                <PostButton />
              </>
          }
        </>
      )}
      {DummyPosts.map(post => <PostCoverCard post={PostDoc.fromData(post)} />)}
    </Box>
  );
}
