import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';

import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import FlagIcon from '@mui/icons-material/Flag';

import { QuestionWithSpec, Answer, LoadQuestionBySpecItemIdReturn } from "../../../alias";
import styles from "./question.module.css";
import {User} from "@supabase/supabase-js";

type DisplayEditProps = {
    
    question : LoadQuestionBySpecItemIdReturn,
    answer: Answer,
    showIsCorrect: boolean,
    showAnswer: boolean,
    user:User,
    onAnswerChange : (answer: Answer) => void,
    onLikeStateChange  :(answer: Answer) => void,
    onNextQuestion : (specItemId: number) => void
}

type MCQQuestionType = {
    questionText : string, 
    answers: string[]
}

const DisplayQuestion = ({
        question, 
        answer,
        showIsCorrect,
        showAnswer, 
        onAnswerChange,
        onLikeStateChange,
        onNextQuestion
    }: DisplayEditProps) => {

    const qData = question.questiondata as MCQQuestionType;

    const handleAnswerChange = (index: number) => {
        console.log("Building Answer"); 
        const newObj = Object.assign({}, answer, {answer:index});       
        console.log(newObj);
        onAnswerChange(newObj);
    }

    const handleDislikeStateChange = () => {
        console.log("Building Answer"); 
        const likeState = answer.likeState == 0 ? -1 : 0;
        const newObj = Object.assign({}, answer, {likeState});       
        console.log(newObj);
        onLikeStateChange(newObj);
    }

    if (!qData) {
        return <h1>No more questions</h1>
    }

    return <>
        <div className={styles.card}>
        <div className={styles.specHeader}>{question && question.spectitle} </div>
        <hr/>
        <div className={styles.specHeader}>{question && question.tag} {question && question.spectitle}</div>
        <h2>{question && qData && qData.questionText}</h2>

    
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Choose One</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
            >
                <div className={styles.answers}>
                {
                    qData.answers.map((a, i) => <div key={i}>
                        <FormControlLabel 
                                value={i} 
                                control={<Radio />} 
                                label={a} 
                                onChange={(e) => {handleAnswerChange(i)}}
                                />
                        </div>)
                }
                </div>
            </RadioGroup>
            </FormControl>
            
            <div className={styles.cardFooter}>
                <div>
                    {answer.attempts} attempts | {answer?.correct } correct | &nbsp;
                    {answer.attempts == 0? 0 : ((answer.correct / answer.attempts) * 100).toFixed(2)}%
                </div>  
                <div>
                         
                    

                    {
                        ( answer.likeState >= 0 ) && (    
                    <IconButton aria-label="unlike">
                        <ThumbDownOutlinedIcon onClick={handleDislikeStateChange}/>
                    </IconButton>
                    )
                    }

                    {
                        answer.likeState == -1 && (
                    <IconButton aria-label="unlike">
                        <ThumbDownIcon onClick={handleDislikeStateChange}/>
                    </IconButton>
                    )
                    }

                    <Button disabled={answer.isCorrect === null } onClick={() => onNextQuestion(question.specitemid)}>Next Question</Button>
                </div>
            </div>
        <div>{showIsCorrect && JSON.stringify(answer.isCorrect)}</div>
        <div>{showAnswer && JSON.stringify(question.correctanswer)}</div>
        </div>
    </>
}

export default DisplayQuestion;