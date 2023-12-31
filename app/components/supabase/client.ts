import {createBrowserClient } from "@supabase/ssr"

import {Database} from "../../../database";
import {SupabaseClient,  } from "@supabase/supabase-js";

export function createSupabaseClient (): SupabaseClient<Database, string & keyof Database, any> {

    return createBrowserClient<Database, "public">(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

}