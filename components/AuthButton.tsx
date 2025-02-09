'use client'

import { UserCircleIcon } from "lucide-react"
import {UserButton,SignInButton,SignedIn,SignedOut} from "@clerk/nextjs"
import { Button } from "./ui/button"


export const AuthButton = () =>{
    return(
        <>
            <SignedIn>
                <UserButton/>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button
                        variant="outline"
                        className="px-4 py-2 text-sm font-medium text-slate-800 hover:text-slate-700 rounded-full shadow-none
                        "
                    >
                        <UserCircleIcon/>
                        Sign-IN
                    </Button>
                </SignInButton>
            </SignedOut>
        </>
    )
}