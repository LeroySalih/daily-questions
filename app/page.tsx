import DeployButton from '../components/DeployButton'
import AuthButton from '../components/AuthButton'
import { createClient } from '@/utils/supabase/server'
import ConnectSupabaseSteps from '@/components/ConnectSupabaseSteps'
import SignUpUserSteps from '@/components/SignUpUserSteps'
import Header from '@/components/Header'
import { cookies } from 'next/headers'
import { redirect} from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SignInOut from './components/signin-out'
import Link from 'next/link';

import Urls from './components/app-urls';

// clientid
// bd70f649-2c81-4937-9956-af3874c6b5c8


export default async function Index() {
  const cookieStore = cookies()

  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }

  // isSupabaseConnected = canInitSupabaseClient()

  const supabaseClient = createServerComponentClient({cookies});

  const {data: {session}} = await supabaseClient.auth.getSession();

  if (!session){
    redirect(Urls.unauthenticated)
  }

  const {data:{user}} = await supabaseClient.auth.getUser();

  const {data, error} = await supabaseClient.from("Spec").select()

  return (
    <>
    <h1>Daily Question {user?.email}</h1>
    <h2><Link href="/question">Daily Question</Link></h2>
    <h2><Link href={Urls['submit-a-question']}>Submit a question</Link></h2>
    <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
} 
