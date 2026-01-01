export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          code: string
          created_at: string
          criteria: Json
          description: string
          icon: string
          id: string
          is_active: boolean
          order_index: number
          title: string
          xp_reward: number
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          criteria: Json
          description: string
          icon: string
          id?: string
          is_active?: boolean
          order_index?: number
          title: string
          xp_reward?: number
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          criteria?: Json
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          order_index?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          is_premium: boolean | null
          is_published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          is_premium?: boolean | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          is_premium?: boolean | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_analytics: {
        Row: {
          correct_answers: number | null
          created_at: string | null
          date: string
          id: string
          lessons_completed: number | null
          quizzes_attempted: number | null
          stars_earned: number | null
          total_answers: number | null
          total_study_minutes: number | null
          updated_at: string | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          correct_answers?: number | null
          created_at?: string | null
          date: string
          id?: string
          lessons_completed?: number | null
          quizzes_attempted?: number | null
          stars_earned?: number | null
          total_answers?: number | null
          total_study_minutes?: number | null
          updated_at?: string | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          correct_answers?: number | null
          created_at?: string | null
          date?: string
          id?: string
          lessons_completed?: number | null
          quizzes_attempted?: number | null
          stars_earned?: number | null
          total_answers?: number | null
          total_study_minutes?: number | null
          updated_at?: string | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      daily_quests: {
        Row: {
          code: string
          created_at: string
          description: string
          difficulty: string
          icon: string
          id: string
          is_active: boolean
          quest_type: string
          target_value: number
          title: string
          weight: number
          xp_reward: number
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          difficulty?: string
          icon: string
          id?: string
          is_active?: boolean
          quest_type: string
          target_value: number
          title: string
          weight?: number
          xp_reward: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          difficulty?: string
          icon?: string
          id?: string
          is_active?: boolean
          quest_type?: string
          target_value?: number
          title?: string
          weight?: number
          xp_reward?: number
        }
        Relationships: []
      }
      event_achievements: {
        Row: {
          code: string
          created_at: string | null
          criteria: Json
          description: string | null
          event_id: string
          icon: string | null
          id: string
          title: string
          xp_reward: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          criteria: Json
          description?: string | null
          event_id: string
          icon?: string | null
          id?: string
          title: string
          xp_reward?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          criteria?: Json
          description?: string | null
          event_id?: string
          icon?: string | null
          id?: string
          title?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_achievements_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "seasonal_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_quests: {
        Row: {
          bonus_reward: Json | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          event_id: string
          icon: string | null
          id: string
          order_index: number | null
          quest_type: string | null
          target_value: number
          title: string
          xp_reward: number | null
        }
        Insert: {
          bonus_reward?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          event_id: string
          icon?: string | null
          id?: string
          order_index?: number | null
          quest_type?: string | null
          target_value: number
          title: string
          xp_reward?: number | null
        }
        Update: {
          bonus_reward?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          event_id?: string
          icon?: string | null
          id?: string
          order_index?: number | null
          quest_type?: string | null
          target_value?: number
          title?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_quests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "seasonal_events"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_answered: boolean | null
          is_pinned: boolean | null
          lesson_id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_answered?: boolean | null
          is_pinned?: boolean | null
          lesson_id: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_answered?: boolean | null
          is_pinned?: boolean | null
          lesson_id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_comments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "lesson_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_files: {
        Row: {
          created_at: string
          file_name: string
          file_url: string
          id: string
          lesson_id: string
          order_index: number | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_url: string
          id?: string
          lesson_id: string
          order_index?: number | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          lesson_id?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_files_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          education_level: string | null
          id: string
          is_premium: boolean
          is_published: boolean | null
          lesson_type: string | null
          order_index: number | null
          pdf_url: string | null
          simulation_url: string | null
          structured_content: Json | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          education_level?: string | null
          id?: string
          is_premium?: boolean
          is_published?: boolean | null
          lesson_type?: string | null
          order_index?: number | null
          pdf_url?: string | null
          simulation_url?: string | null
          structured_content?: Json | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          education_level?: string | null
          id?: string
          is_premium?: boolean
          is_published?: boolean | null
          lesson_type?: string | null
          order_index?: number | null
          pdf_url?: string | null
          simulation_url?: string | null
          structured_content?: Json | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_premium_user: boolean | null
          updated_at: string
          user_id: string
          user_level: Database["public"]["Enums"]["user_level"] | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_premium_user?: boolean | null
          updated_at?: string
          user_id: string
          user_level?: Database["public"]["Enums"]["user_level"] | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_premium_user?: boolean | null
          updated_at?: string
          user_id?: string
          user_level?: Database["public"]["Enums"]["user_level"] | null
        }
        Relationships: []
      }
      purchase_transactions: {
        Row: {
          id: string
          purchased_at: string | null
          shop_item_id: string | null
          user_id: string
          xp_spent: number
        }
        Insert: {
          id?: string
          purchased_at?: string | null
          shop_item_id?: string | null
          user_id: string
          xp_spent: number
        }
        Update: {
          id?: string
          purchased_at?: string | null
          shop_item_id?: string | null
          user_id?: string
          xp_spent?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_transactions_shop_item_id_fkey"
            columns: ["shop_item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          completed_at: string
          essay_feedback: Json | null
          essay_scores: Json | null
          graded_at: string | null
          graded_by: string | null
          id: string
          quiz_id: string
          score: number
          status: string
          time_taken_seconds: number | null
          total_questions: number
          user_answers: Json | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          essay_feedback?: Json | null
          essay_scores?: Json | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          quiz_id: string
          score: number
          status?: string
          time_taken_seconds?: number | null
          total_questions: number
          user_answers?: Json | null
          user_id: string
        }
        Update: {
          completed_at?: string
          essay_feedback?: Json | null
          essay_scores?: Json | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          quiz_id?: string
          score?: number
          status?: string
          time_taken_seconds?: number | null
          total_questions?: number
          user_answers?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_files: {
        Row: {
          created_at: string
          file_name: string
          file_url: string
          id: string
          order_index: number | null
          quiz_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_url: string
          id?: string
          order_index?: number | null
          quiz_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          order_index?: number | null
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_files_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: number
          created_at: string
          explanation: string | null
          id: string
          image_url: string | null
          options: Json
          order_index: number | null
          question: string
          question_type: string
          quiz_id: string
        }
        Insert: {
          correct_answer: number
          created_at?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          options?: Json
          order_index?: number | null
          question: string
          question_type?: string
          quiz_id: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          options?: Json
          order_index?: number | null
          question?: string
          question_type?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          time_limit_minutes: number | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          time_limit_minutes?: number | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          time_limit_minutes?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_events: {
        Row: {
          banner_image: string | null
          bonus_xp_multiplier: number | null
          created_at: string | null
          description: string | null
          end_date: string
          event_type: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          theme_config: Json | null
          updated_at: string | null
        }
        Insert: {
          banner_image?: string | null
          bonus_xp_multiplier?: number | null
          created_at?: string | null
          description?: string | null
          end_date: string
          event_type?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          theme_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          banner_image?: string | null
          bonus_xp_multiplier?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          event_type?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          theme_config?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          metadata: Json | null
          name: string
          stock_limit: number | null
          xp_cost: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          metadata?: Json | null
          name: string
          stock_limit?: number | null
          xp_cost: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          metadata?: Json | null
          name?: string
          stock_limit?: number | null
          xp_cost?: number
        }
        Relationships: []
      }
      simulation_interactions: {
        Row: {
          first_opened_at: string
          id: string
          interaction_count: number | null
          last_opened_at: string
          lesson_id: string
          total_time_seconds: number | null
          user_id: string
        }
        Insert: {
          first_opened_at?: string
          id?: string
          interaction_count?: number | null
          last_opened_at?: string
          lesson_id: string
          total_time_seconds?: number | null
          user_id: string
        }
        Update: {
          first_opened_at?: string
          id?: string
          interaction_count?: number | null
          last_opened_at?: string
          lesson_id?: string
          total_time_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_interactions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      student_achievements: {
        Row: {
          achievement_id: string
          id: string
          notified: boolean
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          notified?: boolean
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          notified?: boolean
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      student_daily_quests: {
        Row: {
          assigned_date: string
          completed_at: string | null
          current_progress: number
          daily_quest_id: string
          id: string
          is_completed: boolean
          target_value: number
          user_id: string
        }
        Insert: {
          assigned_date?: string
          completed_at?: string | null
          current_progress?: number
          daily_quest_id: string
          id?: string
          is_completed?: boolean
          target_value: number
          user_id: string
        }
        Update: {
          assigned_date?: string
          completed_at?: string | null
          current_progress?: number
          daily_quest_id?: string
          id?: string
          is_completed?: boolean
          target_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_daily_quests_daily_quest_id_fkey"
            columns: ["daily_quest_id"]
            isOneToOne: false
            referencedRelation: "daily_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      student_gamification: {
        Row: {
          created_at: string
          current_level: number
          current_streak: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          streak_freeze_count: number
          total_lessons_completed: number
          total_quizzes_completed: number
          total_stars_earned: number
          total_xp: number
          updated_at: string
          user_id: string
          xp_to_next_level: number
        }
        Insert: {
          created_at?: string
          current_level?: number
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          streak_freeze_count?: number
          total_lessons_completed?: number
          total_quizzes_completed?: number
          total_stars_earned?: number
          total_xp?: number
          updated_at?: string
          user_id: string
          xp_to_next_level?: number
        }
        Update: {
          created_at?: string
          current_level?: number
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          streak_freeze_count?: number
          total_lessons_completed?: number
          total_quizzes_completed?: number
          total_stars_earned?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
          xp_to_next_level?: number
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          activity_type: string | null
          completed: boolean | null
          created_at: string | null
          duration_minutes: number | null
          ended_at: string | null
          id: string
          lesson_id: string | null
          started_at: string
          user_id: string
        }
        Insert: {
          activity_type?: string | null
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          lesson_id?: string | null
          started_at?: string
          user_id: string
        }
        Update: {
          activity_type?: string | null
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          lesson_id?: string | null
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_event_achievements: {
        Row: {
          event_achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          event_achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          event_achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_event_achievements_event_achievement_id_fkey"
            columns: ["event_achievement_id"]
            isOneToOne: false
            referencedRelation: "event_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_event_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_progress: number | null
          event_id: string
          event_quest_id: string | null
          id: string
          target_value: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          event_id: string
          event_quest_id?: string | null
          id?: string
          target_value: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          event_id?: string
          event_quest_id?: string | null
          id?: string
          target_value?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_event_progress_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "seasonal_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_event_progress_event_quest_id_fkey"
            columns: ["event_quest_id"]
            isOneToOne: false
            referencedRelation: "event_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_inventory: {
        Row: {
          id: string
          is_equipped: boolean | null
          purchased_at: string | null
          shop_item_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_equipped?: boolean | null
          purchased_at?: string | null
          shop_item_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_equipped?: boolean | null
          purchased_at?: string | null
          shop_item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_inventory_shop_item_id_fkey"
            columns: ["shop_item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          source_id: string | null
          source_type: string
          user_id: string
          xp_amount: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          source_id?: string | null
          source_type: string
          user_id: string
          xp_amount: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          source_id?: string | null
          source_type?: string
          user_id?: string
          xp_amount?: number
        }
        Relationships: []
      }
    }
    Views: {
      public_quiz_questions: {
        Row: {
          id: string | null
          image_url: string | null
          options: Json | null
          order_index: number | null
          question: string | null
          question_type: string | null
          quiz_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      award_xp: {
        Args: {
          _description?: string
          _source_id?: string
          _source_type: string
          _user_id: string
          _xp_amount: number
        }
        Returns: Json
      }
      calculate_weekly_stats: {
        Args: { p_user_id: string; p_week_start?: string }
        Returns: Json
      }
      check_achievements: { Args: { _user_id: string }; Returns: Json }
      complete_event_quest: {
        Args: { p_quest_id: string; p_user_id: string }
        Returns: Json
      }
      equip_shop_item: {
        Args: { p_item_id: string; p_user_id: string }
        Returns: Json
      }
      get_active_events: {
        Args: never
        Returns: {
          banner_image: string | null
          bonus_xp_multiplier: number | null
          created_at: string | null
          description: string | null
          end_date: string
          event_type: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          theme_config: Json | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "seasonal_events"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_event_leaderboard: {
        Args: { p_event_id: string; p_limit?: number }
        Returns: {
          full_name: string
          quests_completed: number
          rank: number
          total_xp: number
          user_id: string
        }[]
      }
      get_quiz_questions_for_student: {
        Args: { p_quiz_id: string }
        Returns: {
          id: string
          options: Json
          order_index: number
          question: string
          quiz_id: string
        }[]
      }
      get_streak_heatmap: {
        Args: { p_user_id: string }
        Returns: {
          date: string
          intensity: number
          lessons_completed: number
          study_minutes: number
        }[]
      }
      get_user_event_progress: {
        Args: { p_event_id: string; p_user_id: string }
        Returns: {
          completed: boolean
          completed_at: string
          current_progress: number
          difficulty: string
          quest_description: string
          quest_icon: string
          quest_id: string
          quest_title: string
          quest_type: string
          target_value: number
          xp_reward: number
        }[]
      }
      has_any_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      promote_to_admin: { Args: { _user_email: string }; Returns: undefined }
      purchase_shop_item: {
        Args: { p_item_id: string; p_user_id: string }
        Returns: Json
      }
      update_daily_analytics_for_date: {
        Args: { p_date?: string; p_user_id: string }
        Returns: undefined
      }
      update_event_quest_progress: {
        Args: { p_increment?: number; p_quest_type: string; p_user_id: string }
        Returns: undefined
      }
      update_streak: { Args: { _user_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "student"
      user_level: "thcs" | "thpt"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student"],
      user_level: ["thcs", "thpt"],
    },
  },
} as const
