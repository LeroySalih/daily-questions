import {createBrowserServer } from "@supabase/ssr"

import {cookies} from "next/headers";

export function createSupabaseServer (serverComponent = false) {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABSE_ANNON_KEY,
        {
            cookies: {

                get(name) {
                    return cookies().get(name)?.value;
                },

                set(name, value, options) {
                    if (serverComponent) return;
                    cookies().set(name, value, options);
                },

                remove (name, options) {
                    if (serverComponent) return;
                    cookies().set(name, "", options);
                }

            }
        }
    );

}