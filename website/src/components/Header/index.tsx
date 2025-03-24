"use client"

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogIn, LogOut, Moon, Pencil, QrCode, Settings, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import React, { useEffect, useState } from "react";
import { Cookie } from "@/lib/Cookie";

export function Header() : React.JSX.Element {
    const { setTheme, theme } = useTheme()
    const [ isLoggedIn, setLoggedIn ] = useState<boolean>(false)
    const cookie = new Cookie(process.env.SECRET || "test")

    useEffect(() => {
        const b = async () => {
            if(!cookie.verifySignedCookie(document.cookie, "auth")) return
            setLoggedIn(true)
        }
        b()
    }, [])

    const handleLogout = () => {
        cookie.deleteCookie("auth")
        setLoggedIn(false)
    }

    return <>
        <header className="sticky top-0 border-b flex items-center justify-center mx-3">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex">
                    <Link href="/" className="flex items-center space-x-2">
                        <QrCode className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">QR Generator</span>
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                                <Avatar className="h-11 w-11">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>SC</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        { isLoggedIn ? (
                            <>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">shadcn</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                m@example.com
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                                            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
                                            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                            <span>Theme</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="!text-red-600 hover:!bg-red-300" onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4 !text-red-600" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </>
                        ) : (
                            <>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <LogIn className="mr-2 h-4 w-4" />
                                            <span>Sign in</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            <span>Sign up</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                                            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
                                            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                            <span>Theme</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </>
                        )}
                    </DropdownMenu>
                </div>
            </div>
        </header>
    </>
}