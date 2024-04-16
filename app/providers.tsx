'use client'

import { AuthProvider } from "@/lib/context/authContext"
import { ChakraProvider } from "@chakra-ui/react"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ChakraProvider>
                {children}
            </ChakraProvider>
        </AuthProvider>
    )
}
