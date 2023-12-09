
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import { cookies} from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page () {

    const supabase = createServerComponentClient({cookies});
    const {data: {session}} = await supabase.auth.getSession();

    // if (session){
    //     redirect('/')
    // }

    return <h1>Not authenticated, sign in to proceed</h1>
}