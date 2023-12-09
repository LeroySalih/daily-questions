"use client";

import {createBrowserClient } from "@supabase/ssr";
import {useState, useEffect} from "react";
import {Database} from "../../database";
import {Spec, SpecItem } from "../../alias";
import Link from "next/link";

import SpecSelector from "../components/spec-selector";

export default function Page () {

    const [currentSpec, setCurrentSpec] = useState<Spec | null | undefined>(null);
    const [specItems, setSpecItems] = useState<SpecItem[] | null | undefined>(null);

    const supabase = createBrowserClient<Database, "public">(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    const handleSpecChange = (s: Spec | null | undefined) : void => {
        setCurrentSpec(s);    
    }

    //const loadNextQuestion = async (specItemId: number) => {
    //    console.log("Loading Question for ", specItemId);
    //}

    const loadSpecItems = async (spec: Spec | null | undefined) => {
        
        if (!spec) {
            setSpecItems(null);
            return;
        }

        try{
            const {data, error} = await supabase.from("SpecItem")
                .select("id, created_at, SpecId, tag, title, revisionMaterials")
                .eq("SpecId", spec.id)

            if (error)  throw new Error(error.message);

            setSpecItems(data);

        }
        catch(error){
            console.error(error);
        }
        finally{

        }

    }

    useEffect(()=>{
        loadSpecItems(currentSpec);
    }, []);

    useEffect(()=> {
        loadSpecItems(currentSpec);
    }, [currentSpec]);


    return <div>
        <h1>Questions</h1>
        <SpecSelector onChange={handleSpecChange}/>
        {
            specItems && specItems?.sort((a: SpecItem, b: SpecItem) => a.tag! > b.tag! ? 1 : -1).map((s:SpecItem, index: number) => <div key={s.id}>
                <Link href={`/questions/${s.id}`}>({s.tag}) {s.title}</Link>
                <Link href={`/questions/submit/${s.id}`}> | Add</Link>
                </div>)
        }
        

    </div>
}