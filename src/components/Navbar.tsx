"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'

const Navbar = () => {

    const {data: session} = useSession()
    
    const user: User =  session?.user
    

  return (
    <div>
      
    </div>
  )
}

export default Navbar
