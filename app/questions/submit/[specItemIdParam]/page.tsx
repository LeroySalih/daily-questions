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
import { zodResolver } from "@hookform/resolvers/zod";
import TipTap from "@/components/RichEditorTipTap";

/*
export const questionObject = z.object({
    questionText: z.string().trim().min(2, {message: "Must be longer that 2 chars"}),
    correctAnswer: z.number().gte(0, {message: "correct Answer must be greater than or equal to 0"}),
    a0Text: z.string().trim().min(2,{message: "a0 must be longer than 2 chars"}),
    a1Text: z.string().trim().min(2,{message: "a1 must be longer than 2 chars"}),
    a2Text: z.string().trim().min(2,{message: "a2 must be longer than 2 chars"}),
    a3Text: z.string().trim().min(2,{message: "a3 must be longer than 2 chars"}),
});
*/

const questionObject = z.object({
    questionText: z.string().min(1,"Must have more than 1 char"),
    correctAnswer: z.string().transform((value) => parseInt(value, 10)),
    a0Text: z.string().min(1,"Must have more than 1 char"),
    a1Text: z.string().min(1,"Must have more than 1 char"),
    a2Text: z.string().min(1,"Must have more than 1 char"),
    a3Text: z.string().min(1,"Must have more than 1 char"),
});


export type QuestionTypeSchema = z.infer<typeof questionObject>


const Page = () => {
    const debug = false;

    const {specItemIdParam} = useParams();
    const [specItemId, setSpecItemId] = useState<string>(specItemIdParam as string);
    const [user, setUser] = useState<User | null> (null);
    const [saving, setSaving] = useState<boolean>(false);

    const [alert, setAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabase = createClientComponentClient<Database>({supabaseUrl, supabaseKey});
    const router = useRouter();

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
        trigger,
        formState
    } = useForm<QuestionTypeSchema>({
        mode: "onChange",
        resolver: zodResolver(questionObject)
    });

    const formData = watch();

    const {errors, isSubmitting, isValid} = formState;

    const saveQuestion = async (data: QuestionTypeSchema) => {

        if (!user) return;

        setSaving(true);
        console.log("Form Data", data)

        const insertQuestion = Object.assign({},  
            {
                createdBy: user?.email,
                specItemId: parseInt(specItemId),
                questionType: 1,
                questionData: { questionText: data.questionText, answers: [data.a0Text, data.a1Text, data.a2Text, data.a3Text]},
                correctAnswer: data.correctAnswer
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

    const onSubmit: SubmitHandler<QuestionTypeSchema> = saveQuestion;


    const loadUser = async (user: User | null) => {
        setUser(user);
    };

    const handleAlertClose = () => {
        setAlert(false);
    };

    const handleCancel = () => {
        router.push("/questions")
    }

    useEffect(()=> {
        setAlert(true);
    }, [alertMessage]);


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
    }, []);
    
    
    return <div>
        
        <Link href={`/questions`}>Back to questions</Link>
        <h1>Creating a New Question for {specItemIdParam} by {user && user.email}</h1>
        <div className={styles.container}>
        <form className={styles.card}     
            onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
                name="questionText"
                control={control}
                defaultValue=""
                render={({field}) => (
                    <TipTap description={field.value} onChange={field.onChange}/>
                )}
            />
            

            

            <div className={styles.answerField}>
            <input type="radio" {...register("correctAnswer")} value={0}/>

            <Controller
                name="a0Text"
                control={control}
                defaultValue=""
                render={({field}) => (
                    <TipTap description={field.value} onChange={field.onChange}/>
                )}
            />
            </div>

            <div className={styles.answerField}>
            <input type="radio"  {...register("correctAnswer")} value={1}/>
            <Controller
                name="a1Text"
                control={control}
                defaultValue=""
                render={({field}) => (
                    <TipTap description={field.value} onChange={field.onChange}/>
                )}
            />
            </div>
            <div className={styles.answerField}>
            <input type="radio"  {...register("correctAnswer")} value={2}/>
            <Controller
                name="a2Text"
                control={control}
                defaultValue=""
                render={({field}) => (
                    <TipTap description={field.value} onChange={field.onChange}/>
                )}
            />
            </div>
            <div className={styles.answerField}>
            <input type="radio"  {...register("correctAnswer")} value={3}/>
            <Controller
                name="a3Text"
                control={control}
                defaultValue=""
                render={({field}) => (
                    <TipTap description={field.value} onChange={field.onChange}/>
                )}
            />
            </div>
            <div>
            <Button variant="outlined" disabled={saving} onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" disabled={saving 
                
                || !isValid
                
                } type="submit">
                    {!saving && isValid && "Save"}
                    {saving && "Saving"}
                    {!isValid && "Not valid"}
                </Button>
            </div>
            
        </form>
        {debug &&
        <div style={{"display": "flex", "flexDirection": "column"}}>
            <div><pre>{JSON.stringify(formData, null, 2)}</pre></div>
            <div><pre>{JSON.stringify(isValid, null, 2)}</pre></div>
            <div><pre>{JSON.stringify(errors.questionText?.message , null, 2)}</pre></div>
            <div><pre>{JSON.stringify(errors.a0Text?.message , null, 2)}</pre></div>
            <div><pre>{JSON.stringify(errors.a1Text?.message , null, 2)}</pre></div>
            <div><pre>{JSON.stringify(errors.a2Text?.message , null, 2)}</pre></div>
            <div><pre>{JSON.stringify(errors.a3Text?.message , null, 2)}</pre></div>
        </div>  
        }
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