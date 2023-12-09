"use client"

import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from "../../../../database";

import Link  from "next/link";
import {User, AuthChangeEvent, Session} from "@supabase/supabase-js";
import {useState, useEffect} from "react";
import styles from "./page.module.css";

import Button from "@mui/material/Button";
import Snackbar from '@mui/joy/Snackbar';

import {useForm , SubmitHandler, Controller } from "react-hook-form";
import { z } from 'zod';
import TipTap from "@/components/RichEditorTipTap";

const Page = () => {
    const {specItemIdParam} = useParams();
    const [specItemId, setSpecItemId] = useState<string>(specItemIdParam as string);
    const [user, setUser] = useState<User | null> (null);
    const [saving, setSaving] = useState<boolean>(false);

    const [alert, setAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabase = createClientComponentClient<Database>({supabaseUrl, supabaseKey});
    
    type Inputs = {
        questionText: string,
        a0Text: string,
        a1Text: string,
        a2Text: string,
        a3Text: string,
        correctAnswer: string
    }

    
    const {
        register,
        control,
        reset,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<Inputs>({
        mode: "onBlur",
        defaultValues: {
        questionText : "",
        a0Text: "",
        a1Text: "",
        a2Text: "",
        a3Text: "",
        correctAnswer: ""
        }
    });

    const saveQuestion = async (data: Inputs) => {

        if (!user) return;

        setSaving(true);
        console.log(data)

        const insertQuestion = Object.assign({},  
            {
                createdBy: user?.email,
                specItemId: parseInt(specItemId),
                questionType: 1,
                questionData: { questionText: data.questionText, answers: [data.a0Text, data.a1Text, data.a2Text, data.a3Text]},
                correctAnswer: parseInt(data.correctAnswer)
        });

        try{
            setSaving(true);
            const {data, error} = await supabase.from("dqQuestions").insert(insertQuestion).select("id");
            
            console.log("Data Saved:", data);
            if (error) throw new Error(error?.message);

            setAlertMessage(`Question saved (id: ${data[0].id})`);

        } catch(error) {
            console.error(error);
        }
        finally {
            setSaving(false);
            reset();
        }
        
        
    }

    const onSubmit: SubmitHandler<Inputs> = saveQuestion;


    const loadUser = async (user: User | null) => {
        setUser(user);
    };

    const handleAlertClose = () => {
        setAlert(false);
    }

    useEffect(()=> {
        setAlert(true);
    }, [alertMessage])


    useEffect(()=> {
        // subscribe to state changes for user 
        supabase.auth.onAuthStateChange(async (event:AuthChangeEvent, session: Session | null ) => {

            if (!session){
                return;
            }
    
            console.log("AuthStateChange detected", event, session)
            const {user} = session;
    
            loadUser(user);
            
        });
    }, [])
    
    
    return <div>
        <Link href={`/questions`}>Back to questions</Link>
        <h1>Creating a New Question for {specItemIdParam} by {user && user.email}</h1>
        <div className={styles.container}>
        <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="Question Text"
                {...register("questionText")}
            />

            <div>
            <input type="radio" {...register("correctAnswer")} value={0}/>
            <input placeholder="Question Text"
                {...register("a0Text")}
            />
            </div>
            <div>
            <input type="radio"  {...register("correctAnswer")} value={1}/>
            <input placeholder="Question Text"
                {...register("a1Text")}
            />
            </div>
            <div>
            <input type="radio"  {...register("correctAnswer")} value={2}/>
            <input placeholder="Question Text"
                {...register("a2Text")}
            />
            </div>
            <div>
            <input type="radio"  {...register("correctAnswer")} value={3}/>
            <input placeholder="Question Text"
                {...register("a3Text")}
            />
            </div>
            <div>
            <Button variant="outlined" disabled={saving}>Cancel</Button>
            <Button variant="contained" disabled={saving} type="submit">{!saving ? "Save" : "Saving"}</Button>
            </div>
            
        </form>
        </div>
        <Snackbar 
            autoHideDuration={3000}
            open={alert} onClose={handleAlertClose} 
            key={"bottomleft"}>
            {alertMessage}
        </Snackbar>
    </div>
}


export default Page;