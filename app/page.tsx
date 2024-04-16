'use client'

import { useAuth } from "@/lib/context/authContext";
import { Button, Text, VStack } from "@chakra-ui/react";

export default function Home() {
  const { currentUser, logInWithGoogle, logOut, errorMessage: authErrorMessage, isInitialized: authIsInitialized, isLoading: authIsLoading } = useAuth()

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
                <Text>{currentUser.email} || {currentUser.displayName}</Text>
                <Button colorScheme='blue' size='xs' onClick={logOut}>Logout</Button>
              </>
          }
        </>
      )}
    </VStack>
  );
}
