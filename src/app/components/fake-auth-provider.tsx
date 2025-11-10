"use client"

import { useState, ReactNode, createContext, useMemo, useEffect, startTransition } from "react"
import { CopilotKit } from "@copilotKit/react-core"
import { FakeUser } from "@/lib/users"
import { getInitialUser, login as loginUser, logout as logoutUser, generateToken } from "@/lib/auth"

type AuthContextType = {
    user: FakeUser | null
    login: (userId: string) => void
    logout: () => void
    token: string | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const FakeAuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<FakeUser | null>(null)

    useEffect(() => {
        // Initialize user from localStorage after hydration to avoid SSR mismatch
        const initialUser = getInitialUser()
        if (initialUser) {
            startTransition(() => {
                setUser(initialUser)
            })
        }
    }, [])

    const token = useMemo(() => generateToken(user), [user])

    const handleLogin = (userId: string) => {
        const loggedInUser = loginUser(userId)
        if (loggedInUser) {
            setUser(loggedInUser)
        }
    }

    const handleLogout = () => {
        logoutUser()
        setUser(null)
    }

    const headers: Record<string, string> = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return (
        <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, token }}>
            <CopilotKit
                runtimeUrl="/api/copilotkit"
                agent="agent_with_auth"
                properties={{
                    authorization: token,
                }}
            >
                {children}
            </CopilotKit>
        </AuthContext.Provider>
    )
}

