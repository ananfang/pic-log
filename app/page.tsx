'use client'

import { useAuth } from "@/lib/context/authContext";
import { Avatar, Button, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import PostButton from "./components/PostButton";

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
    <VStack>
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
              </>
          }
        </>
      )}
    </VStack>
  );
}
