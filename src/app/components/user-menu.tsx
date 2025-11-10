"use client"

import { type MouseEvent, useContext, useEffect, useRef, useState } from "react"

import { AuthContext } from "./fake-auth-provider"

import { users } from "@/lib/users"

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
)

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
)

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
)

export const UserMenu = () => {
    const authContext = useContext(AuthContext)
    const [isExpanded, setIsExpanded] = useState(false)

    if (!authContext) {
        throw new Error("AuthContext is not available")
    }

    const { user, login, logout } = authContext

    const handleLogin = (userId: string) => {
        login(userId)
        setIsExpanded(false)
    }

    const handleLogout = () => {
        logout()
        setIsExpanded(false)
    }

    const handleToggle = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="fixed top-4 left-4 z-50">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200">
                {user ? (
                    <>
                        <button
                            onClick={handleToggle}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left"
                            aria-label="Toggle user menu"
                            aria-expanded={isExpanded}
                        >
                            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                <UserIcon />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">{user.name}</div>
                                <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            </div>
                            <div className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDownIcon />
                            </div>
                        </button>
                        {isExpanded && (
                            <div className="border-t border-gray-200 px-4 py-3 space-y-3 bg-gray-50/50">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-500">Role:</span>
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium capitalize">
                                        {user.role}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-700 block">Switch User</label>
                                    <select
                                        onChange={(e) => handleLogin(e.target.value)}
                                        value={user.id}
                                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors cursor-pointer text-indigo-700 font-medium"
                                    >
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                                >
                                    <LogoutIcon />
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="px-4 py-3 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon />
                            </div>
                            <div className="text-sm font-semibold text-gray-700">Not logged in</div>
                        </div>
                        <select
                            onChange={(e) => handleLogin(e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors cursor-pointer text-gray-700"
                            defaultValue=""
                        >
                            <option value="" disabled>Select user...</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    )
}
