'use client'

import { useAuth } from "@/lib/context/authContext";
import { Avatar, Box, Button, Divider, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import PostButton from "./components/PostButton";
import PostFeed from "./components/PostFeed";

export default function Home() {
  const { currentUser, logInWithGoogle, logOut, errorMessage: authErrorMessage, isInitialized: authIsInitialized, isLoading: authIsLoading, initialize: authInitialize } = useAuth()

  useEffect(() => {
    if (authErrorMessage) {
      console.log(authErrorMessage)
    }

    if (!authIsInitialized) {
      console.log('🍾 auth is not initialized')
      authInitialize()
    }
  }, [])

  return (
    <Box maxWidth='390px' marginX='auto'>
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
                <PostButton />
                <Divider marginY={4} />
                <PostFeed uid={currentUser.uid} />
              </>
          }
        </>
      )}
    </Box>
  );
}
