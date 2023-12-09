import {useState} from 'react';
import {useEffect} from 'react';

import MyInput from "../RichEditorTipTap";
// import styles from './card.module.css';
import './card.css'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import {User} from '@supabase/supabase-js';
// sbp_7c2b87b827aa333a37eb889bded13d3f80af0d8e

const Card = () => {

    const [saving, setSaving] = useState<boolean>(false);
    const [questionText, setQuestionText] = useState();
    const [answers, setAnswers] = useState(['','','','']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [specItems, setSpecItems] = useState([]);
    const [specs, setSpecs] = useState([]);
    const [currentSpec, setCurrentSpec] = useState(0);
    const [currentSpecItem, setCurrentSpecItem] = useState(0);
    const [user, setUser] = useState<User | null>(null);

    const supabase = createPagesBrowserClient();

    

    const buildSpecItems = () => {
        const items = {}

        //@ts-ignore
        specItems.forEach((si:any) => {items[si.Spec.id] = si.Spec;})

        //@ts-ignore
        const itemsArr = Object.keys(items).map(k => ({id:k,  title:items[k].title}))
        //@ts-ignore
        setSpecs(itemsArr);
    }

    useEffect(()=> {
        const loadSpecItems = async () => {
            const {data, error} = await supabase.from("SpecItem").select("id, tag, title, Spec(id, title)");
            error && console.log(error);

            //@ts-ignore
            data && setSpecItems(data);
            setIsLoading(false);

        } 

        supabase.auth.onAuthStateChange((event, session) => {
            console.log("AUTH STATE CHANGE", event);
    
            const user = session?.user;
    
            setUser(user || null);
        });

        

        loadSpecItems();
    }, [])

    useEffect(buildSpecItems, [specItems]);

    useEffect(() => {
        //@ts-ignore
        specs && specs.length > 1 && setCurrentSpec(specs[0].id);
    }, [specs]);

    useEffect(()=> {
        //@ts-ignore
        setCurrentSpecItem(specItems
            // @ts-ignore
            .filter(si => si.Spec.id == currentSpec)
            //@ts-ignore
            .sort((a, b)=> a.tag > b.tag ? 1: 0)[0]?.id);

    }, [currentSpec])

    const setAnswer = (text: string, index: number) => {
        const tmp = [...answers];

        tmp[index] = text;

        setAnswers(tmp);
    }

    

    if (isLoading){
        return (
        <>
        <div className="formcontainer">
            <div className="card">Loading</div>
        </div>
        </>)
    }

    const handleSubmit = async () => {

        setSaving(true);

        try{
            const {data, error} = await supabase.from("dqQuestions").insert({
                createdBy: user?.email, 
                specItemId: currentSpecItem, 
                questionData: {questionText, 
                               answers, 
                               correctAnswer},
                }).select("id")
                
    
            if (error?.message)
                throw new Error(error.message)

            console.log(data);

    
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setSaving(false);
        }
        
        // console.log(data);

        return;


        try{

            const response = await fetch("/api/question/submit", {
                method: "POST",
                body: JSON.stringify({
                    createdBy: user?.email, 
                    specItemId: currentSpecItem, 
                    questionData: {questionText, 
                                   answers, 
                                   correctAnswer},
                    })
            });
    
            const result = await response.json();
            console.log(result);
        } 
        catch (error){
            console.error(error)
        }
        
    }

    return  <><div className="formcontainer">
    <div className="card">
    <h1>Submit a Question</h1>
    <div>{user && user.email}</div>
    
    <div className="field">
        {//@ts-ignore
            specs && <select value={currentSpec} onChange={(e) => setCurrentSpec(e.target.value)}>
            <option>Choose Spec</option>
            {specs && specs.map((s:any, i: number) => <option key={i} value={s.id}>{s.title}</option>)}
        </select>
        }
        {   // @ts-ignore
            specItems && currentSpec && <select value={currentSpecItem} onChange={(e) => setCurrentSpecItem(e.target.value)}>
            <option>Choose Spec Item</option>
            
            {//@ts-ignore
            specItems.filter(si => si.Spec.id == currentSpec)
                      //@ts-ignore
                      .sort((a, b)=> a.tag > b.tag ? 1: -1)
                      //@ts-ignore
                      .map((si, i) => <option key={si.id} value={si.id}>{si.title}({si.tag})</option>)
            }
        </select>
        }
    </div>
    
    <div><MyInput setData={setQuestionText}/></div>
    <hr></hr>
    <div className="answerField"><input type="radio" name="isCorrect" checked={correctAnswer == 1} onChange={() => setCorrectAnswer(1)}></input><MyInput setData={(text: string) => setAnswer(text, 0)}/></div>
    <div className="answerField"><input type="radio" name="isCorrect" checked={correctAnswer == 2} onChange={() => setCorrectAnswer(2)}></input><MyInput setData={(text: string) => setAnswer(text, 1)}/></div>
    <div className="answerField"><input type="radio" name="isCorrect" checked={correctAnswer == 3} onChange={() => setCorrectAnswer(3)}></input><MyInput setData={(text: string) => setAnswer(text, 2)}/></div>
    <div className="answerField"><input type="radio" name="isCorrect" checked={correctAnswer == 4} onChange={() => setCorrectAnswer(4)}></input><MyInput setData={(text: string) => setAnswer(text, 3)}/></div>
    <button disabled={saving} onClick={handleSubmit}>Submit</button>
   
</div>


</div>
<pre>{JSON.stringify({
    createdBy: user?.email, 
    currentSpecItem, 
    questionText, 
    answers, 
    correctAnswer,
    }, null, 2)}</pre>
</>
}


export default Card;