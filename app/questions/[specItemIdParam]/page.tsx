"use client"

import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {RealtimePostgresChangesPayload, User, Session, AuthChangeEvent} from "@supabase/supabase-js";

import { useEffect, useState} from 'react';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

import {Database} from "../../../database";
import {Question, Answer, LoadQuestionBySpecItemIdReturn} from "../../../alias";
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from "date-fns";

// import QuestionDisplay from "../../components/question";

import styles from "./page.module.css";


import DisplayQuestion from "../../components/display-question/index";

export default function Page () {

    const router = useRouter();
    const {specItemIdParam} = useParams();

    const [user,setUser] = useState<User | null>(null);
    const [specItemId, setSpecItemId] = useState<number>(parseInt(specItemIdParam as string));
    const [question, setQuestion] = useState<LoadQuestionBySpecItemIdReturn | null | undefined>(undefined);
    const [answer, setAnswer] = useState<Answer | null | undefined>(undefined);
    const [answerHasChanged, setAnswerHasChanged] = useState<boolean>(false);
    const [showIsCorrect, setShowIsCorrect] = useState<boolean>(false);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    const [loading, isLoading] = useState<boolean>(false);
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabase = createClientComponentClient<Database>({supabaseUrl, supabaseKey});
    
    const loadUser = async (user: User | null) => {
        setUser(user);
    }

    const loadQuestionBySpecItemId = async (_specitemid: number, user:User) => {
        console.log("Loading question for specItemId", specItemId);

        const {data, error} = await supabase
                            .rpc('dq_loadquestionbyspecitemid', {
                                    _specitemid
                                    })
                            .limit(1);


        error && console.error(error);
        console.log("Question For Spec Item", data);
        setQuestion(data)
    }

    const loadQuestionById = async (_questionid: number) => {

        const {data: question, error} = await supabase
                            .rpc('dq_loadquestionbyid', {
                                _questionid
                                })
                            .limit(1);


        error && console.error(error);
        console.log("Question by id", question);
        setQuestion(question)
    }

    const newAnswer = () : null | Answer => {

        if (!question || !question.id || !user || !user.email){
            return null;
        }

        return {
            id: uuidv4(),
            answer: {},
            questionId: question?.id,
            owner: (user ? user.email : ''),
            created_at: formatISO(new Date()),
            isCorrect: null,
            attempts: 0,
            correct: 0,
            likeState: 0
        }
    }

    const handleUpdateFromDb = (payload: RealtimePostgresChangesPayload<{
        [key: string]: any;
    }>) => {
                    
        console.log("Update recieved");

        // check relevance of change
        if (!["dqQuestions", "dqAnswers"].includes(payload.table))
        {
            console.log("Update not relevant", payload)
            return;
        }

        if (question === undefined   // not loaded 
            || question === null)    // not found
            
            {
                console.log("No question loaded, ignoring update", question)
                return;
            }

        

        switch(payload.table){
            
            case "dqQuestions" : {
                console.log("Processing Question (in case)")
                const {id} = payload.new as Question;
    
                if (id && id == question.id){
                    console.log("Updating question")
                    loadQuestionById(question.id);    

                } else {
                    console.log("Ignoring update to quesitons", id, question, id == question?.id  )
                }

                return;
            }
            

            
            case "dqAnswers" : {

                console.log("Processing Answer from db", payload.new);
    
                const newAnswer = payload.new as Database["public"]["Tables"]["dqAnswers"]["Row"];
                console.log("New Answer", newAnswer);
                // updating Answer object
                setAnswer((prev) => {

                    if (prev && prev.id == newAnswer.id) {
                        return newAnswer;
                    }
                    return prev;
                })
                

                return;
            }
            
            
            default : console.log("unknown table", payload.table)
        }
    }

    const handleAnswerChangeFromUser = (answer : Answer) => {
        setAnswer((prev) => {
            return Object.assign({}, 
                    answer, 
                    {
                        isCorrect: answer.answer == question?.correctanswer,
                        attempts : answer.attempts + 1,
                        correct : (answer.answer == question?.correctanswer) ? answer.correct + 1 : answer.correct
                    }
                    );
        });
        setAnswerHasChanged(true);
    }

    const handleLikeStateChangeFromUser = (answer : Answer) => {
        setAnswer(answer);
        setAnswerHasChanged(true);
    }
    
    const subscribeToDbEvents = () => {
        
        const listener = supabase.channel('schema-db-changes')
                                 .on('postgres_changes', {
                                    event: '*',
                                    schema: 'public',
                                 },
                                 (payload: any) => handleUpdateFromDb(payload)
                            )
                            .subscribe();

        return listener;
    }

    // load most recent answer for this question for this user
    const loadAnswer = async (question: LoadQuestionBySpecItemIdReturn | undefined | null, user: User | null) => {

        if (!user || !user.email || !question){
            return;
        }

        const {data, error} = await supabase.from("dqAnswers")
                                        .select("*")
                                        .eq("owner", user.email)
                                        .eq("questionId", question.id)
                                        .order("created_at")
                                        .limit(1)
                                        .single()
        
        error && console.log(error);
        console.log("Answer", data)
        
        // return a new answer if no answer is found
        setAnswer(data || newAnswer())

    }

    const updateAnswerToDb = async (answer: Answer | null) => {
        
        if (answer == null || user == null || !answerHasChanged)
            return;

        answer.created_at = formatISO(new Date());

        try{
            console.log("Writing Answer to DB", user, answer);
            const {data,error} = await supabase.from("dqAnswers")
            .upsert(answer)
            .select("id")

            if (error) {
                throw (new Error(error.message));
            } 

            console.log("Wrote answer to db", data);
        }
        catch(error) {
            
            error && console.error(error);

        }
        finally {
            setAnswerHasChanged(false);
        }
        
    }

    const handleNextQuestion = async (specItemId:number) => {

        console.log("User is ", user);
        console.log("For SpecId", specItemId)

        if (!user || !user.email){
            return;
        }

        let { data, error } = await supabase
                .rpc('dq_loadnextquestionbyspecitem', {
                    _owner : user.email || '', 
                    _specitemid : specItemId
                });

        if (error) console.error(error)
        else console.log(data);

        setAnswer(null);
        setQuestion(data);
        
    }

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

        subscribeToDbEvents();

        // Load the Next question
        handleNextQuestion(specItemId)

    }, []);
    
    // user or specItemId has changed, so reload question
    useEffect(()=>{

        if (!user || specItemId == 0){
            setQuestion(null);
            return;
        }

        // valid params, load question
        // loadQuestionBySpecItemId(specItemId, user)
        handleNextQuestion(specItemId)
    }, [specItemId, user]);

    // question has changed, so update subscription
    useEffect(()=>{

        const listener = subscribeToDbEvents();


        loadAnswer(question, user)

        return ()=> {
            listener.unsubscribe();
        }

    }, [question]);

    useEffect(()=>{
        if (!answerHasChanged || answer === undefined)
            return;

        updateAnswerToDb(answer);
        setAnswerHasChanged(false);

    },[answerHasChanged, answer]);


    if (!user) {
        return <h1>No user</h1>
    }

    if (!question) {
        return <h1>Loading Question</h1>
    }

    if (!question.id) {
        return <h1>No Question</h1>
    }

    return <>
    <div className={styles.pageHeader}>
        
        <div className={styles.pageContainer}>
            {question && user && answer && <DisplayQuestion 
                question={question}
                answer={answer}
                showAnswer={showAnswer}
                showIsCorrect={showIsCorrect}
                user={user}
                onAnswerChange={handleAnswerChangeFromUser}
                onLikeStateChange={handleLikeStateChangeFromUser}
                onNextQuestion={handleNextQuestion}    
            />
            }
        
        </div>
        </div>
    </>
}