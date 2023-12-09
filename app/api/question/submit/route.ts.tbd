export const dynamic = 'force-dynamic' // defaults to force-static

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers';

export async function GET(request: Request) {
    return Response.json({status: 200, msg: 'ok'});
}


export async function POST(request: Request) {
    const formData = await request.json();

    const supabaseServer = createServerComponentClient({cookies});

    console.log("Sending", formData, "to DB.")
    const {data, error} = await supabaseServer.from("dqQuestions").insert({createdBy: 'test', questionType: 1, ...formData});

    console.log("Data", data)
    console.log("Error", error)
    error && console.error(error)

    return error ? 
        Response.json({status: 500, msg: 'ERROR', error: error.message}) :
        Response.json({status: 200, msg: 'ok', data});
}