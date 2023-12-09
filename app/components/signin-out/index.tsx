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

    const getURL = () => {

        return "https://daily-questions-eight.vercel.app/";
        
        let url =
          process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
          process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
          'http://localhost:3000/'
        // Make sure to include `https://` when not localhost.
        url = url.includes('http') ? url : `https://${url}`
        // Make sure to include a trailing `/`.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
        return url
      }

      
    async function signInWithAzure (){
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
              scopes: 'email',
              redirectTo: `${getURL()}/auth/callback`,
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