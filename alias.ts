import {Database} from "./database";




export type Specs = Database["public"]["Tables"]["Spec"]
export type Spec = Database["public"]["Tables"]["Spec"]["Row"]

export type SpecItems = Database["public"]["Tables"]["SpecItem"]
export type SpecItem = Database["public"]["Tables"]["SpecItem"]["Row"]

export type Question = Database["public"]["Tables"]["dqQuestions"]["Row"];
export type Answer = Database["public"]["Tables"]["dqAnswers"]["Row"];
export type LoadQuestionBySpecItemIdReturn = Database["public"]["Functions"]["dq_loadquestionbyspecitemid"]["Returns"];
export type LoadSpecItemsQuestionCount = Database["public"]["Functions"]["dq_getspecitemquestioncount"]["Returns"];
export type LoadSpecItemsQuestionCountRow = LoadSpecItemsQuestionCount[0];

export type QuestionWithSpec = Question & {
    SpecItem : {
        tag: string,
        title: string,
        Spec: {
            title: string, 
            subject: string,
        }
    }
}