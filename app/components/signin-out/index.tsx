"use client"


import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import {useState, useEffect} from 'react';
import {User} from "@supabase/auth-helpers-nextjs";
import Urls from '../app-urls';

import { useRouter } from "next/navigation";

export default function SignInOut () {
    
    const router = useRouter();

    const [user, setUser] = useState<User | null>();
    
    useEffect(()=>{

        async function loadUser() {

            const {data: {user}, error} = await supabase.auth.getUser();
            
            setUser(user);

        }

        loadUser();

    }, [])
    const supabase = createPagesBrowserClient()

    
    async function signInWithAzure (){
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
              scopes: 'email',
              redirectTo: `${location.origin}/auth/callback`,
              //@ts-ignore
              emailRedirectTo: `${location.origin}/auth/callback`,
            },
          });

        console.log(data)
        error && console.error(error)
    }

    async function signOutWithAzure (){
        const { error } = await supabase.auth.signOut()
        error && console.error(error);
        setUser(null);
        console.log('Sending user to', Urls.home);
        router.refresh()
    }

    return <>
                {!user && <button onClick={signInWithAzure}>Sign In</button>}
                {user && <button onClick={signOutWithAzure}>Sign Out</button>}
                
            </>
}