export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Classes: {
        Row: {
          created_at: string | null
          id: number
          join_code: string
          specId: number
          tag: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          join_code: string
          specId: number
          tag: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: number
          join_code?: string
          specId?: number
          tag?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "Classes_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          }
        ]
      }
      ClassMembership: {
        Row: {
          classId: number
          created_at: string | null
          pupilId: string
        }
        Insert: {
          classId: number
          created_at?: string | null
          pupilId: string
        }
        Update: {
          classId?: number
          created_at?: string | null
          pupilId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ClassMembership_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          }
        ]
      }
      ClassPapers: {
        Row: {
          availableFrom: string | null
          classId: number
          completeBy: string | null
          created_at: string | null
          markBy: string | null
          paperId: number
        }
        Insert: {
          availableFrom?: string | null
          classId: number
          completeBy?: string | null
          created_at?: string | null
          markBy?: string | null
          paperId: number
        }
        Update: {
          availableFrom?: string | null
          classId?: number
          completeBy?: string | null
          created_at?: string | null
          markBy?: string | null
          paperId?: number
        }
        Relationships: [
          {
            foreignKeyName: "ClassPapers_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ClassPapers_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ClassPapers_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          }
        ]
      }
      dqAnswers: {
        Row: {
          answer: Json | null
          attempts: number
          correct: number
          created_at: string | null
          id: string
          isCorrect: boolean | null
          likeState: number
          owner: string
          questionId: number
        }
        Insert: {
          answer?: Json | null
          attempts?: number
          correct?: number
          created_at?: string | null
          id?: string
          isCorrect?: boolean | null
          likeState?: number
          owner: string
          questionId: number
        }
        Update: {
          answer?: Json | null
          attempts?: number
          correct?: number
          created_at?: string | null
          id?: string
          isCorrect?: boolean | null
          likeState?: number
          owner?: string
          questionId?: number
        }
        Relationships: [
          {
            foreignKeyName: "dqAnswers_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "dqQuestions"
            referencedColumns: ["id"]
          }
        ]
      }
      dqQuestions: {
        Row: {
          correctAnswer: Json | null
          created_at: string
          createdBy: string | null
          id: number
          questionData: Json | null
          questionType: number | null
          specItemId: number | null
        }
        Insert: {
          correctAnswer?: Json | null
          created_at?: string
          createdBy?: string | null
          id?: number
          questionData?: Json | null
          questionType?: number | null
          specItemId?: number | null
        }
        Update: {
          correctAnswer?: Json | null
          created_at?: string
          createdBy?: string | null
          id?: number
          questionData?: Json | null
          questionType?: number | null
          specItemId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dqQuestions_questionType_fkey"
            columns: ["questionType"]
            isOneToOne: false
            referencedRelation: "dqQuestionType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dqQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          }
        ]
      }
      dqQuestionType: {
        Row: {
          created_at: string
          description: string | null
          id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      FCQuestions: {
        Row: {
          created_at: string
          id: string
          specItemId: number
          term: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          specItemId: number
          term: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          specItemId?: number
          term?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "FCQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          }
        ]
      }
      FCUserQuestionHistory: {
        Row: {
          answer: string
          created_at: string
          id: number
          questionId: string
          result: boolean
          specItemId: number
          userid: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: number
          questionId: string
          result: boolean
          specItemId: number
          userid: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: number
          questionId?: string
          result?: boolean
          specItemId?: number
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "FCUserQuestionHistory_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "FCQuestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUserQuestionHistory_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          }
        ]
      }
      FCUSerQueueEntries: {
        Row: {
          created_at: string
          currentQueue: number
          dueDate: string
          id: number
          questionId: string
          specItemId: number
          userId: string
        }
        Insert: {
          created_at?: string
          currentQueue: number
          dueDate: string
          id?: number
          questionId: string
          specItemId: number
          userId: string
        }
        Update: {
          created_at?: string
          currentQueue?: number
          dueDate?: string
          id?: number
          questionId?: string
          specItemId?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "FCUSerQueueEntries_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "FCQuestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          }
        ]
      }
      FCUserQueues: {
        Row: {
          created_at: string | null
          specItemId: number
          userid: string
        }
        Insert: {
          created_at?: string | null
          specItemId: number
          userid: string
        }
        Update: {
          created_at?: string | null
          specItemId?: number
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "FCUserQueues_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          }
        ]
      }
      Papers: {
        Row: {
          aPaperLabel: string | null
          created_at: string | null
          id: number
          marks: number | null
          month: string | null
          paper: string | null
          qPaperLabel: string | null
          specId: number | null
          subject: string | null
          title: string | null
          year: string | null
        }
        Insert: {
          aPaperLabel?: string | null
          created_at?: string | null
          id?: number
          marks?: number | null
          month?: string | null
          paper?: string | null
          qPaperLabel?: string | null
          specId?: number | null
          subject?: string | null
          title?: string | null
          year?: string | null
        }
        Update: {
          aPaperLabel?: string | null
          created_at?: string | null
          id?: number
          marks?: number | null
          month?: string | null
          paper?: string | null
          qPaperLabel?: string | null
          specId?: number | null
          subject?: string | null
          title?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Papers_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          }
        ]
      }
      Profile: {
        Row: {
          classes: string[] | null
          created_at: string | null
          familyName: string
          firstName: string
          id: string
          isAdmin: boolean
        }
        Insert: {
          classes?: string[] | null
          created_at?: string | null
          familyName: string
          firstName: string
          id: string
          isAdmin?: boolean
        }
        Update: {
          classes?: string[] | null
          created_at?: string | null
          familyName?: string
          firstName?: string
          id?: string
          isAdmin?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "Profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      PupilMarks: {
        Row: {
          created_at: string | null
          id: number
          marks: number | null
          paperId: number
          questionId: number
          userId: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          marks?: number | null
          paperId: number
          questionId: number
          userId: string
        }
        Update: {
          created_at?: string | null
          id?: number
          marks?: number | null
          paperId?: number
          questionId?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "Questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["q_id"]
          }
        ]
      }
      "PupilMarks.copy": {
        Row: {
          created_at: string | null
          id: number | null
          marks: number | null
          paperId: number | null
          questionId: number | null
          userId: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number | null
          marks?: number | null
          paperId?: number | null
          questionId?: number | null
          userId?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number | null
          marks?: number | null
          paperId?: number | null
          questionId?: number | null
          userId?: string | null
        }
        Relationships: []
      }
      QPAnswer: {
        Row: {
          answer: string
          created_at: string | null
          id: number
          isCorrect: boolean
          max_points: number
          path: string
          points: number
          questionId: string
          userId: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: number
          isCorrect: boolean
          max_points?: number
          path: string
          points?: number
          questionId: string
          userId: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: number
          isCorrect?: boolean
          max_points?: number
          path?: string
          points?: number
          questionId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "QPAnswer_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          }
        ]
      }
      Questions: {
        Row: {
          created_at: string | null
          id: number
          marks: number | null
          PaperId: number | null
          question_number: string | null
          question_order: number | null
          specItemId: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          marks?: number | null
          PaperId?: number | null
          question_number?: string | null
          question_order?: number | null
          specItemId?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          marks?: number | null
          PaperId?: number | null
          question_number?: string | null
          question_order?: number | null
          specItemId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Questions_PaperId_fkey"
            columns: ["PaperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Questions_PaperId_fkey"
            columns: ["PaperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
          {
            foreignKeyName: "Questions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          }
        ]
      }
      result_record: {
        Row: {
          correctAnswer: Json | null
          created_at: string | null
          createdBy: string | null
          id: number | null
          questionData: Json | null
          questionType: number | null
          specItemId: number | null
          specTitle: string | null
          tag: string | null
          title: string | null
        }
        Insert: {
          correctAnswer?: Json | null
          created_at?: string | null
          createdBy?: string | null
          id?: number | null
          questionData?: Json | null
          questionType?: number | null
          specItemId?: number | null
          specTitle?: string | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          correctAnswer?: Json | null
          created_at?: string | null
          createdBy?: string | null
          id?: number | null
          questionData?: Json | null
          questionType?: number | null
          specItemId?: number | null
          specTitle?: string | null
          tag?: string | null
          title?: string | null
        }
        Relationships: []
      }
      Spec: {
        Row: {
          created_at: string | null
          id: number
          subject: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          subject?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          subject?: string | null
          title?: string | null
        }
        Relationships: []
      }
      SpecItem: {
        Row: {
          created_at: string | null
          id: number
          revisionMaterials: string | null
          SpecId: number | null
          tag: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          revisionMaterials?: string | null
          SpecId?: number | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          revisionMaterials?: string | null
          SpecId?: number | null
          tag?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          }
        ]
      }
      Tasks: {
        Row: {
          classId: number | null
          created_at: string | null
          id: number
          isActive: boolean | null
          paperId: number | null
        }
        Insert: {
          classId?: number | null
          created_at?: string | null
          id?: number
          isActive?: boolean | null
          paperId?: number | null
        }
        Update: {
          classId?: number | null
          created_at?: string | null
          id?: number
          isActive?: boolean | null
          paperId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Tasks_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          }
        ]
      }
      "TBD-ClassPaperResources": {
        Row: {
          classId: number | null
          created_at: string | null
          id: number
          label: string | null
          paperId: number | null
          url: string | null
        }
        Insert: {
          classId?: number | null
          created_at?: string | null
          id?: number
          label?: string | null
          paperId?: number | null
          url?: string | null
        }
        Update: {
          classId?: number | null
          created_at?: string | null
          id?: number
          label?: string | null
          paperId?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TBD-ClassPaperResources_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TBD-ClassPaperResources_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TBD-ClassPaperResources_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          }
        ]
      }
    }
    Views: {
      vw_duplicate_pupil_marks: {
        Row: {
          count: number | null
          firstName: string | null
          paperId: number | null
          questionId: number | null
          userId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "Questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["q_id"]
          }
        ]
      }
      vw_pupil_marks_for_spec: {
        Row: {
          avg: number | null
          pm_marks: number | null
          q_marks: number | null
          SpecId: number | null
          tag: string | null
          title: string | null
          userId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          }
        ]
      }
      vw_questions_denorm: {
        Row: {
          p_id: number | null
          p_paper: string | null
          p_subject: string | null
          p_title: string | null
          p_year: string | null
          pm_entered: string | null
          pm_id: number | null
          pm_pMarks: number | null
          pm_userId: string | null
          q_amarks: number | null
          q_id: number | null
          q_month: string | null
          q_qnumber: string | null
          q_qorder: number | null
          si_revision_materials: string | null
          si_specId: number | null
          si_tag: string | null
          si_title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["si_specId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          }
        ]
      }
      vw_user_marks_for_paper: {
        Row: {
          qMarks: number | null
          question_number: string | null
          "Spec Title": string | null
          tag: string | null
          title: string | null
          uMarks: number | null
          userId: string | null
        }
        Relationships: []
      }
      vw_user_marks_for_paper_clone: {
        Row: {
          "?column?": number | null
        }
        Relationships: []
      }
      vw_user_marks_for_spec: {
        Row: {
          avg: number | null
          pm_marks: number | null
          q_marks: number | null
          tag: string | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      dq_getspecitemquestioncount: {
        Args: {
          _specid: number
        }
        Returns: {
          specid: number
          specitemid: number
          title: string
          subject: string
          tag: string
          specitem_title: string
          questiondatacount: number
        }[]
      }
      dq_loadnextquestionbyspecitem: {
        Args: {
          _specitemid: number
          _owner: string
        }
        Returns: Database["public"]["CompositeTypes"]["dq_loadquestionbyspecitemidreturn"]
      }
      dq_loadquestionbyid: {
        Args: {
          _questionid: number
        }
        Returns: Database["public"]["CompositeTypes"]["dq_loadquestionbyspecitemidreturn"]
      }
      dq_loadquestionbyspecitemid: {
        Args: {
          _specitemid: number
        }
        Returns: Database["public"]["CompositeTypes"]["dq_loadquestionbyspecitemidreturn"]
      }
      fn_admin_get_papers_for_class: {
        Args: {
          _classid: number
        }
        Returns: {
          paperId: number
          year: string
          month: string
          subject: string
          paper: string
          qpaperlabel: string
          apaperlabel: string
          availableFrom: string
          completeBy: string
          markBy: string
        }[]
      }
      fn_check_class: {
        Args: {
          classid: number
        }
        Returns: {
          pupilId: string
          firstName: string
          familyName: string
          classId: number
          paperId: number
          year: string
          month: string
          paper: string
          pMarks: number
        }[]
      }
      fn_check_class_spec_item: {
        Args: {
          classid: number
        }
        Returns: {
          pupilId: string
          firstName: string
          familyName: string
          tag: string
          title: string
          pMarks: number
          qMarks: number
        }[]
      }
      fn_check_paper_for_class: {
        Args: {
          paperid: number
          classid: number
        }
        Returns: {
          pupilId: string
          firstName: string
          familyName: string
          pMarks: number
        }[]
      }
      fn_fc_add_spec_item_to_pupil_queue: {
        Args: {
          _userid: string
          _specitemid: number
        }
        Returns: number
      }
      fn_fc_get_distractors: {
        Args: {
          _specid: number
          _qid: string
        }
        Returns: unknown
      }
      fn_fc_get_next_question: {
        Args: {
          _userid: string
          _specitemid: number
        }
        Returns: {
          userId: string
          specItemId: number
          tag: string
          title: string
          dueDate: string
          currentQueue: number
          history: Json
          questionId: string
          term: string
          text: string
          distractors: string[]
        }[]
      }
      fn_fc_get_queue: {
        Args: {
          _userid: string
          _specitemid: number
        }
        Returns: {
          userId: string
          specItemId: number
          tag: string
          title: string
          dueDate: string
          currentQueue: number
          history: Json
          questionId: string
          term: string
          text: string
          distractors: string[]
        }[]
      }
      fn_fc_get_queue_summary: {
        Args: {
          _userid: string
          _specitemid: number
        }
        Returns: {
          isDue: string
          count: number
        }[]
      }
      fn_fc_get_queues: {
        Args: {
          _userid: string
        }
        Returns: {
          specItemId: number
          specItemTag: string
          specItemTitle: string
          specId: number
          specTitle: string
          specSubject: string
        }[]
      }
      fn_get_paper_data_for_pupil: {
        Args: {
          pupilid: string
        }
        Returns: {
          classId: number
          classTag: string
          specId: number
          pupilId: string
          firstName: string
          familyName: string
          paperId: number
          year: string
          month: string
          paper: string
          availableFrom: string
          completeBy: string
          markBy: string
          qMarks: number
          pMarks: number
        }[]
      }
      fn_marks_entered: {
        Args: {
          paperid: number
          classid: number
        }
        Returns: {
          pupilId: string
          firstName: string
          familyName: string
          pMarks: number
          qMarks: number
          pct: number
        }[]
      }
      fn_pupil_marks_by_available_from_date: {
        Args: {
          uuid: string
          specid: number
        }
        Returns: {
          tag: string
          title: string
          paperid: number
          availablefrom: string
          amarks: number
          pmarks: number
        }[]
      }
      fn_pupil_marks_by_available_marks: {
        Args: {
          userid: string
          specid: number
        }
        Returns: {
          avMarks: number
          pMarks: number
          aMarks: number
        }[]
      }
      fn_pupil_marks_by_paper: {
        Args: {
          uuid: string
          specid: number
        }
        Returns: {
          paperId: number
          pMarks: number
          aMarks: number
        }[]
      }
      fn_pupil_marks_by_spec_item: {
        Args: {
          userid: string
          specid: number
        }
        Returns: {
          specTag: string
          specItem: string
          revisionMaterials: string
          pMarks: number
          aMarks: number
        }[]
      }
      fn_pupil_marks_for_all_papers: {
        Args: {
          _userid: string
        }
        Returns: {
          userId: string
          paperId: number
          max_marks: number
          marks: number
        }[]
      }
      fn_pupilmarks_by_specitem: {
        Args: {
          userid: string
          specid: number
        }
        Returns: {
          tag: string
          SpecItem: string
          pupilMarks: number
          availableMarks: number
        }[]
      }
      fn_qp_get_current_answers: {
        Args: {
          _userid: string
          _path: string
        }
        Returns: {
          _created_at: string
          _questionid: string
          _iscorrect: boolean
          _max_points: number
          _points: number
        }[]
      }
      fn_tdf_get_queue: {
        Args: {
          pid: string
          questionsetid: number
        }
        Returns: {
          questionId: number
          questionSetId: number
          specItemId: number
          term: string
          def: string
          AO: number
          createdAt: string
          pupilId: string
          queueType: number
          result: boolean
          dueDate: string
          inQueue: number
        }[]
      }
      fn_test_vars: {
        Args: Record<PropertyKey, never>
        Returns: {
          _count: number
          _sum: number
          _avg: number
        }[]
      }
      fn_upsert_pupilmarks: {
        Args: {
          _paperid: number
          _questionid: number
          _userid: string
          _marks: number
        }
        Returns: {
          id: number
          created_at: string
          userid: string
          questionid: number
          marks: number
          paperid: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      dq_loadquestionbyspecitemidreturn: {
        id: number
        created_at: string
        createdby: string
        specitemid: number
        questiondata: Json
        questiontype: number
        correctanswer: Json
        tag: string
        title: string
        spectitle: string
      }
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
