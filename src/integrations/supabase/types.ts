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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account_metrics: {
        Row: {
          date_loaded: string
          id: string
          metric_name: string
          page_id_meta: string
          value: number
        }
        Insert: {
          date_loaded: string
          id?: string
          metric_name: string
          page_id_meta: string
          value: number
        }
        Update: {
          date_loaded?: string
          id?: string
          metric_name?: string
          page_id_meta?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "account_metrics_page_id_meta_fkey"
            columns: ["page_id_meta"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["page_id_meta"]
          },
        ]
      }
      accounts: {
        Row: {
          account_name: string
          company_id: string | null
          created_at: string | null
          id_db: string
          page_id_meta: string
          platform: string
        }
        Insert: {
          account_name: string
          company_id?: string | null
          created_at?: string | null
          id_db?: string
          page_id_meta: string
          platform: string
        }
        Update: {
          account_name?: string
          company_id?: string | null
          created_at?: string | null
          id_db?: string
          page_id_meta?: string
          platform?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          action_category: string | null
          action_metadata: Json | null
          action_name: string | null
          created_at: string
          event_type: string
          id: string
          page_path: string | null
          page_title: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          screen_height: number | null
          screen_width: number | null
          session_id: string
          user_agent: string | null
          user_email: string
          user_id: string
        }
        Insert: {
          action_category?: string | null
          action_metadata?: Json | null
          action_name?: string | null
          created_at?: string
          event_type: string
          id?: string
          page_path?: string | null
          page_title?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_id: string
          user_agent?: string | null
          user_email: string
          user_id: string
        }
        Update: {
          action_category?: string | null
          action_metadata?: Json | null
          action_name?: string | null
          created_at?: string
          event_type?: string
          id?: string
          page_path?: string | null
          page_title?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_id?: string
          user_agent?: string | null
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      ad_accounts: {
        Row: {
          account_id: string
          account_name: string | null
          id_meta_ad_accounts: string | null
        }
        Insert: {
          account_id?: string
          account_name?: string | null
          id_meta_ad_accounts?: string | null
        }
        Update: {
          account_id?: string
          account_name?: string | null
          id_meta_ad_accounts?: string | null
        }
        Relationships: []
      }
      ads: {
        Row: {
          account_id: string | null
          ad_name: string | null
          adset_id: string | null
          adset_name: string | null
          campaign_id: string | null
          campaign_name: string | null
          id_meta_ads: string
        }
        Insert: {
          account_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          id_meta_ads: string
        }
        Update: {
          account_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          id_meta_ads?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ads_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "ad_accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      ads_insight_daily: {
        Row: {
          ad_id: string | null
          id: string
          p_account_name: string | null
          p_ad_name: string | null
          p_adset_name: string | null
          p_campaign_name: string | null
          p_captura_video: number | null
          p_clicks: number | null
          p_comment: number | null
          p_conversions: number | null
          p_date: string | null
          p_id_meta_adsets: string | null
          p_id_meta_campaigns: string | null
          p_impressions: number | null
          p_inserted_at: string | null
          p_landing_page_view: number | null
          p_like: number | null
          p_link_click: number | null
          p_omni_landing_page_view: number | null
          p_page_engagement: number | null
          p_pixel_custom_conversion: number | null
          p_post_engagement: number | null
          p_post_reaction: number | null
          p_retencion_video: number | null
          p_spend: number | null
          p_video_thruplays: number | null
          p_video_view: number | null
          p_video_watched_pct_100: number | null
          p_video_watched_pct_25: number | null
          p_video_watched_pct_50: number | null
          p_video_watched_pct_75: number | null
        }
        Insert: {
          ad_id?: string | null
          id?: string
          p_account_name?: string | null
          p_ad_name?: string | null
          p_adset_name?: string | null
          p_campaign_name?: string | null
          p_captura_video?: number | null
          p_clicks?: number | null
          p_comment?: number | null
          p_conversions?: number | null
          p_date?: string | null
          p_id_meta_adsets?: string | null
          p_id_meta_campaigns?: string | null
          p_impressions?: number | null
          p_inserted_at?: string | null
          p_landing_page_view?: number | null
          p_like?: number | null
          p_link_click?: number | null
          p_omni_landing_page_view?: number | null
          p_page_engagement?: number | null
          p_pixel_custom_conversion?: number | null
          p_post_engagement?: number | null
          p_post_reaction?: number | null
          p_retencion_video?: number | null
          p_spend?: number | null
          p_video_thruplays?: number | null
          p_video_view?: number | null
          p_video_watched_pct_100?: number | null
          p_video_watched_pct_25?: number | null
          p_video_watched_pct_50?: number | null
          p_video_watched_pct_75?: number | null
        }
        Update: {
          ad_id?: string | null
          id?: string
          p_account_name?: string | null
          p_ad_name?: string | null
          p_adset_name?: string | null
          p_campaign_name?: string | null
          p_captura_video?: number | null
          p_clicks?: number | null
          p_comment?: number | null
          p_conversions?: number | null
          p_date?: string | null
          p_id_meta_adsets?: string | null
          p_id_meta_campaigns?: string | null
          p_impressions?: number | null
          p_inserted_at?: string | null
          p_landing_page_view?: number | null
          p_like?: number | null
          p_link_click?: number | null
          p_omni_landing_page_view?: number | null
          p_page_engagement?: number | null
          p_pixel_custom_conversion?: number | null
          p_post_engagement?: number | null
          p_post_reaction?: number | null
          p_retencion_video?: number | null
          p_spend?: number | null
          p_video_thruplays?: number | null
          p_video_view?: number | null
          p_video_watched_pct_100?: number | null
          p_video_watched_pct_25?: number | null
          p_video_watched_pct_50?: number | null
          p_video_watched_pct_75?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_adsinsights_ads"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id_meta_ads"]
          },
        ]
      }
      ads_insight_daily_inversiones: {
        Row: {
          ad_id: string | null
          id: string
          p_account_name: string | null
          p_ad_name: string | null
          p_adset_name: string | null
          p_campaign_name: string | null
          p_captura_video: number | null
          p_clicks: number | null
          p_comment: number | null
          p_conversions: number | null
          p_date: string | null
          p_id_meta_adsets: string | null
          p_id_meta_campaigns: string | null
          p_impressions: number | null
          p_inserted_at: string | null
          p_landing_page_view: number | null
          p_like: number | null
          p_link_click: number | null
          p_omni_landing_page_view: number | null
          p_page_engagement: number | null
          p_pixel_custom_conversion: number | null
          p_post_engagement: number | null
          p_post_reaction: number | null
          p_retencion_video: number | null
          p_spend: number | null
          p_video_thruplays: number | null
          p_video_view: number | null
          p_video_watched_pct_100: number | null
          p_video_watched_pct_25: number | null
          p_video_watched_pct_50: number | null
          p_video_watched_pct_75: number | null
        }
        Insert: {
          ad_id?: string | null
          id?: string
          p_account_name?: string | null
          p_ad_name?: string | null
          p_adset_name?: string | null
          p_campaign_name?: string | null
          p_captura_video?: number | null
          p_clicks?: number | null
          p_comment?: number | null
          p_conversions?: number | null
          p_date?: string | null
          p_id_meta_adsets?: string | null
          p_id_meta_campaigns?: string | null
          p_impressions?: number | null
          p_inserted_at?: string | null
          p_landing_page_view?: number | null
          p_like?: number | null
          p_link_click?: number | null
          p_omni_landing_page_view?: number | null
          p_page_engagement?: number | null
          p_pixel_custom_conversion?: number | null
          p_post_engagement?: number | null
          p_post_reaction?: number | null
          p_retencion_video?: number | null
          p_spend?: number | null
          p_video_thruplays?: number | null
          p_video_view?: number | null
          p_video_watched_pct_100?: number | null
          p_video_watched_pct_25?: number | null
          p_video_watched_pct_50?: number | null
          p_video_watched_pct_75?: number | null
        }
        Update: {
          ad_id?: string | null
          id?: string
          p_account_name?: string | null
          p_ad_name?: string | null
          p_adset_name?: string | null
          p_campaign_name?: string | null
          p_captura_video?: number | null
          p_clicks?: number | null
          p_comment?: number | null
          p_conversions?: number | null
          p_date?: string | null
          p_id_meta_adsets?: string | null
          p_id_meta_campaigns?: string | null
          p_impressions?: number | null
          p_inserted_at?: string | null
          p_landing_page_view?: number | null
          p_like?: number | null
          p_link_click?: number | null
          p_omni_landing_page_view?: number | null
          p_page_engagement?: number | null
          p_pixel_custom_conversion?: number | null
          p_post_engagement?: number | null
          p_post_reaction?: number | null
          p_retencion_video?: number | null
          p_spend?: number | null
          p_video_thruplays?: number | null
          p_video_view?: number | null
          p_video_watched_pct_100?: number | null
          p_video_watched_pct_25?: number | null
          p_video_watched_pct_50?: number | null
          p_video_watched_pct_75?: number | null
        }
        Relationships: []
      }
      ads_inversiones: {
        Row: {
          account_id: string | null
          ad_name: string | null
          adset_id: string | null
          adset_name: string | null
          campaign_id: string | null
          campaign_name: string | null
          id_meta_ads: string
        }
        Insert: {
          account_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          id_meta_ads: string
        }
        Update: {
          account_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          id_meta_ads?: string
        }
        Relationships: []
      }
      analisis_discrepancias_jobs: {
        Row: {
          codigo_inmueble: string
          created_at: string | null
          error_msg: string | null
          id: string
          resultado: Json | null
          status: string
          updated_at: string | null
        }
        Insert: {
          codigo_inmueble: string
          created_at?: string | null
          error_msg?: string | null
          id?: string
          resultado?: Json | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          codigo_inmueble?: string
          created_at?: string | null
          error_msg?: string | null
          id?: string
          resultado?: Json | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          canceled_reason: string | null
          contact_id: string | null
          created_at: string | null
          date: string | null
          id: string
          requires_payment: boolean | null
          status: string | null
        }
        Insert: {
          canceled_reason?: string | null
          contact_id?: string | null
          created_at?: string | null
          date?: string | null
          id: string
          requires_payment?: boolean | null
          status?: string | null
        }
        Update: {
          canceled_reason?: string | null
          contact_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          requires_payment?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          client_name: string
          created_at: string | null
          current_phase: string | null
          current_process_type: string | null
          financial_summary: Json | null
          id: string
          inmueble_code: string | null
          is_watchlist: boolean | null
          metadata: Json | null
          overall_progress: number | null
          status: string | null
          updated_at: string | null
          watchlist_category: string | null
          watchlist_notes: string | null
        }
        Insert: {
          client_name: string
          created_at?: string | null
          current_phase?: string | null
          current_process_type?: string | null
          financial_summary?: Json | null
          id: string
          inmueble_code?: string | null
          is_watchlist?: boolean | null
          metadata?: Json | null
          overall_progress?: number | null
          status?: string | null
          updated_at?: string | null
          watchlist_category?: string | null
          watchlist_notes?: string | null
        }
        Update: {
          client_name?: string
          created_at?: string | null
          current_phase?: string | null
          current_process_type?: string | null
          financial_summary?: Json | null
          id?: string
          inmueble_code?: string | null
          is_watchlist?: boolean | null
          metadata?: Json | null
          overall_progress?: number | null
          status?: string | null
          updated_at?: string | null
          watchlist_category?: string | null
          watchlist_notes?: string | null
        }
        Relationships: []
      }
      briefing_opciones: {
        Row: {
          channel: string | null
          comercial: string
          created_at: string | null
          fecha: string
          id: number
          opciones: Json
          slack_user_id: string
          thread_ts: string | null
        }
        Insert: {
          channel?: string | null
          comercial: string
          created_at?: string | null
          fecha: string
          id?: never
          opciones: Json
          slack_user_id: string
          thread_ts?: string | null
        }
        Update: {
          channel?: string | null
          comercial?: string
          created_at?: string | null
          fecha?: string
          id?: never
          opciones?: Json
          slack_user_id?: string
          thread_ts?: string | null
        }
        Relationships: []
      }
      call_analysis: {
        Row: {
          amount_saved: number | null
          arrival_date: string | null
          channel: string | null
          client_income: number | null
          created_at: string | null
          duration_seconds: number | null
          etapa_proceso_comercial: string | null
          gestion_dudas_score: number | null
          house_value: number | null
          id: string
          id_tldv_meetings: string | null
          interventions_asesor: number | null
          interventions_cliente: number | null
          meeting_datetime: string | null
          model_name: string | null
          pct_cliente_speaking: number | null
          prohibited_words: Json | null
          sentiment_score: number | null
          steps_completed: number | null
          steps_total: number | null
          structure_score: number | null
          updated_at: string | null
        }
        Insert: {
          amount_saved?: number | null
          arrival_date?: string | null
          channel?: string | null
          client_income?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          etapa_proceso_comercial?: string | null
          gestion_dudas_score?: number | null
          house_value?: number | null
          id?: string
          id_tldv_meetings?: string | null
          interventions_asesor?: number | null
          interventions_cliente?: number | null
          meeting_datetime?: string | null
          model_name?: string | null
          pct_cliente_speaking?: number | null
          prohibited_words?: Json | null
          sentiment_score?: number | null
          steps_completed?: number | null
          steps_total?: number | null
          structure_score?: number | null
          updated_at?: string | null
        }
        Update: {
          amount_saved?: number | null
          arrival_date?: string | null
          channel?: string | null
          client_income?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          etapa_proceso_comercial?: string | null
          gestion_dudas_score?: number | null
          house_value?: number | null
          id?: string
          id_tldv_meetings?: string | null
          interventions_asesor?: number | null
          interventions_cliente?: number | null
          meeting_datetime?: string | null
          model_name?: string | null
          pct_cliente_speaking?: number | null
          prohibited_words?: Json | null
          sentiment_score?: number | null
          steps_completed?: number | null
          steps_total?: number | null
          structure_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      campaign_name_mapping: {
        Row: {
          campaign_group: string | null
          created_at: string | null
          ES_APTO: boolean | null
          ES_AWARENESS: boolean | null
          ES_EXPERIMENTO: boolean | null
          id: string
          meta_campaign_name: string | null
          sf_campaign_id: string | null
          sf_campaign_name: string | null
        }
        Insert: {
          campaign_group?: string | null
          created_at?: string | null
          ES_APTO?: boolean | null
          ES_AWARENESS?: boolean | null
          ES_EXPERIMENTO?: boolean | null
          id?: string
          meta_campaign_name?: string | null
          sf_campaign_id?: string | null
          sf_campaign_name?: string | null
        }
        Update: {
          campaign_group?: string | null
          created_at?: string | null
          ES_APTO?: boolean | null
          ES_AWARENESS?: boolean | null
          ES_EXPERIMENTO?: boolean | null
          id?: string
          meta_campaign_name?: string | null
          sf_campaign_id?: string | null
          sf_campaign_name?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          ad_id_meta: string | null
          comment_id_meta: string | null
          comments_id_db: string
          created_at_supabase: string | null
          created_time_comment: string | null
          from_name: string | null
          message: string | null
          post_id_bd: string | null
        }
        Insert: {
          ad_id_meta?: string | null
          comment_id_meta?: string | null
          comments_id_db?: string
          created_at_supabase?: string | null
          created_time_comment?: string | null
          from_name?: string | null
          message?: string | null
          post_id_bd?: string | null
        }
        Update: {
          ad_id_meta?: string | null
          comment_id_meta?: string | null
          comments_id_db?: string
          created_at_supabase?: string | null
          created_time_comment?: string | null
          from_name?: string | null
          message?: string | null
          post_id_bd?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id_bd"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id_bd"]
          },
        ]
      }
      commission_audit_log: {
        Row: {
          action: string
          created_at: string | null
          detalles: Json | null
          id: string
          liquidacion_id: string | null
          new_status: Database["public"]["Enums"]["liquidation_status"] | null
          previous_status:
            | Database["public"]["Enums"]["liquidation_status"]
            | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          detalles?: Json | null
          id?: string
          liquidacion_id?: string | null
          new_status?: Database["public"]["Enums"]["liquidation_status"] | null
          previous_status?:
            | Database["public"]["Enums"]["liquidation_status"]
            | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          detalles?: Json | null
          id?: string
          liquidacion_id?: string | null
          new_status?: Database["public"]["Enums"]["liquidation_status"] | null
          previous_status?:
            | Database["public"]["Enums"]["liquidation_status"]
            | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_audit_log_liquidacion_id_fkey"
            columns: ["liquidacion_id"]
            isOneToOne: false
            referencedRelation: "liquidaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rules: {
        Row: {
          campana_name: string | null
          canal_name: string
          canal_type: Database["public"]["Enums"]["canal_type"]
          comision_pct: number
          comision_secundaria_pct: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          monto_max: number
          monto_min: number
          soporte_comercial_pct: number | null
          soporte_documental_pct: number | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          campana_name?: string | null
          canal_name: string
          canal_type: Database["public"]["Enums"]["canal_type"]
          comision_pct: number
          comision_secundaria_pct?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          monto_max: number
          monto_min: number
          soporte_comercial_pct?: number | null
          soporte_documental_pct?: number | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          campana_name?: string | null
          canal_name?: string
          canal_type?: Database["public"]["Enums"]["canal_type"]
          comision_pct?: number
          comision_secundaria_pct?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          monto_max?: number
          monto_min?: number
          soporte_comercial_pct?: number | null
          soporte_documental_pct?: number | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      compromisos_diarios: {
        Row: {
          accion: string | null
          Accion: string | null
          avanzo: boolean | null
          comercial: string
          created_at: string | null
          etapa_cierre: string | null
          etapa_inicio: string
          fecha: string
          id: number
          numbered_text: string | null
          oportunidad_id: string
          oportunidad_nombre: string
          prioridad: string | null
          score: number | null
          slack_user_id: string
        }
        Insert: {
          accion?: string | null
          Accion?: string | null
          avanzo?: boolean | null
          comercial: string
          created_at?: string | null
          etapa_cierre?: string | null
          etapa_inicio: string
          fecha: string
          id?: never
          numbered_text?: string | null
          oportunidad_id: string
          oportunidad_nombre: string
          prioridad?: string | null
          score?: number | null
          slack_user_id: string
        }
        Update: {
          accion?: string | null
          Accion?: string | null
          avanzo?: boolean | null
          comercial?: string
          created_at?: string | null
          etapa_cierre?: string | null
          etapa_inicio?: string
          fecha?: string
          id?: never
          numbered_text?: string | null
          oportunidad_id?: string
          oportunidad_nombre?: string
          prioridad?: string | null
          score?: number | null
          slack_user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          Campana_ads: string | null
          created_at: string | null
          email: string | null
          id: string
          is_internal: boolean | null
          name: string | null
          phone: string
        }
        Insert: {
          Campana_ads?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_internal?: boolean | null
          name?: string | null
          phone: string
        }
        Update: {
          Campana_ads?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_internal?: boolean | null
          name?: string | null
          phone?: string
        }
        Relationships: []
      }
      conversation_resolutions: {
        Row: {
          client_lost_due_to_error: boolean | null
          context_explanation: string | null
          conversation_id: string
          converted_to_opportunity: boolean | null
          created_at: string
          had_real_problem: boolean
          id: string
          problem_type: string | null
          resolved_by: string
          technical_category: string | null
        }
        Insert: {
          client_lost_due_to_error?: boolean | null
          context_explanation?: string | null
          conversation_id: string
          converted_to_opportunity?: boolean | null
          created_at?: string
          had_real_problem: boolean
          id?: string
          problem_type?: string | null
          resolved_by: string
          technical_category?: string | null
        }
        Update: {
          client_lost_due_to_error?: boolean | null
          context_explanation?: string | null
          conversation_id?: string
          converted_to_opportunity?: boolean | null
          created_at?: string
          had_real_problem?: boolean
          id?: string
          problem_type?: string | null
          resolved_by?: string
          technical_category?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          campana: string
          cliente_acepto_bajar_valor: boolean | null
          cliente_se_molesto: boolean | null
          comercial_asignado: string | null
          contact_id_duppla: string | null
          contact_id_externo: string
          created_at: string | null
          desistio_por_falta_de_cuota: boolean | null
          duppla_lo_rechaza: boolean | null
          estado_finalziacion: string | null
          Estado_quien_responde: string | null
          explicacion_error: string | null
          fecha_recontacto: string | null
          humano_necesario: string | null
          id: string
          last_message_sender: string | null
          last_message_text: string | null
          last_message_time: string | null
          lo_corrimos_en_datacredito: boolean | null
          metadata: Json | null
          responde_primera_pregunta: string | null
          se_le_pidio_la_cedula: boolean | null
          se_nego_a_dar_cedula: boolean | null
          solicitamos_bajar_precio: boolean | null
          solicito_calculo_cuota: boolean | null
          ultima_revision: string | null
          ultimo_paso_finalizado: string | null
        }
        Insert: {
          campana?: string
          cliente_acepto_bajar_valor?: boolean | null
          cliente_se_molesto?: boolean | null
          comercial_asignado?: string | null
          contact_id_duppla?: string | null
          contact_id_externo: string
          created_at?: string | null
          desistio_por_falta_de_cuota?: boolean | null
          duppla_lo_rechaza?: boolean | null
          estado_finalziacion?: string | null
          Estado_quien_responde?: string | null
          explicacion_error?: string | null
          fecha_recontacto?: string | null
          humano_necesario?: string | null
          id?: string
          last_message_sender?: string | null
          last_message_text?: string | null
          last_message_time?: string | null
          lo_corrimos_en_datacredito?: boolean | null
          metadata?: Json | null
          responde_primera_pregunta?: string | null
          se_le_pidio_la_cedula?: boolean | null
          se_nego_a_dar_cedula?: boolean | null
          solicitamos_bajar_precio?: boolean | null
          solicito_calculo_cuota?: boolean | null
          ultima_revision?: string | null
          ultimo_paso_finalizado?: string | null
        }
        Update: {
          campana?: string
          cliente_acepto_bajar_valor?: boolean | null
          cliente_se_molesto?: boolean | null
          comercial_asignado?: string | null
          contact_id_duppla?: string | null
          contact_id_externo?: string
          created_at?: string | null
          desistio_por_falta_de_cuota?: boolean | null
          duppla_lo_rechaza?: boolean | null
          estado_finalziacion?: string | null
          Estado_quien_responde?: string | null
          explicacion_error?: string | null
          fecha_recontacto?: string | null
          humano_necesario?: string | null
          id?: string
          last_message_sender?: string | null
          last_message_text?: string | null
          last_message_time?: string | null
          lo_corrimos_en_datacredito?: boolean | null
          metadata?: Json | null
          responde_primera_pregunta?: string | null
          se_le_pidio_la_cedula?: boolean | null
          se_nego_a_dar_cedula?: boolean | null
          solicitamos_bajar_precio?: boolean | null
          solicito_calculo_cuota?: boolean | null
          ultima_revision?: string | null
          ultimo_paso_finalizado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_contact_id_externo_fkey"
            columns: ["contact_id_externo"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      cuentas_por_pagar: {
        Row: {
          alejandria: boolean | null
          created_at: string | null
          estado: string | null
          fecha_a_pagar: string | null
          fecha_pago: string | null
          id: string
          link_factura: string | null
          link_pago: string | null
          no_factura: string
          observacion: string | null
          proveedor: string
          siigo: boolean | null
          updated_at: string | null
          valor: number
          vencimiento: string
        }
        Insert: {
          alejandria?: boolean | null
          created_at?: string | null
          estado?: string | null
          fecha_a_pagar?: string | null
          fecha_pago?: string | null
          id?: string
          link_factura?: string | null
          link_pago?: string | null
          no_factura: string
          observacion?: string | null
          proveedor: string
          siigo?: boolean | null
          updated_at?: string | null
          valor: number
          vencimiento: string
        }
        Update: {
          alejandria?: boolean | null
          created_at?: string | null
          estado?: string | null
          fecha_a_pagar?: string | null
          fecha_pago?: string | null
          id?: string
          link_factura?: string | null
          link_pago?: string | null
          no_factura?: string
          observacion?: string | null
          proveedor?: string
          siigo?: boolean | null
          updated_at?: string | null
          valor?: number
          vencimiento?: string
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          chart_id: string
          created_at: string
          format_type: string
          id: string
          label: string
          record_mode: string
          series_key: string | null
          sort_order: number
          suffix: string
        }
        Insert: {
          chart_id: string
          created_at?: string
          format_type?: string
          id?: string
          label: string
          record_mode?: string
          series_key?: string | null
          sort_order?: number
          suffix?: string
        }
        Update: {
          chart_id?: string
          created_at?: string
          format_type?: string
          id?: string
          label?: string
          record_mode?: string
          series_key?: string | null
          sort_order?: number
          suffix?: string
        }
        Relationships: []
      }
      dashboard_permissions: {
        Row: {
          created_at: string | null
          dashboard_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_permissions_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_routes: {
        Row: {
          author: string | null
          created_at: string | null
          description: string | null
          id: string
          kpis: string[] | null
          last_updated_at: string | null
          route: string
          shared_with: string[] | null
          status: string
          tags: string[] | null
          thumbnail_route: string | null
          title: string
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          kpis?: string[] | null
          last_updated_at?: string | null
          route: string
          shared_with?: string[] | null
          status?: string
          tags?: string[] | null
          thumbnail_route?: string | null
          title: string
        }
        Update: {
          author?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          kpis?: string[] | null
          last_updated_at?: string | null
          route?: string
          shared_with?: string[] | null
          status?: string
          tags?: string[] | null
          thumbnail_route?: string | null
          title?: string
        }
        Relationships: []
      }
      dashboards: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          route: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          route: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          route?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      demographic_metrics: {
        Row: {
          description: string | null
          id: string
          name: string
          page_id_meta: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          page_id_meta: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          page_id_meta?: string
        }
        Relationships: [
          {
            foreignKeyName: "demographic_metrics_instagram_page_id_meta_fkey"
            columns: ["page_id_meta"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["page_id_meta"]
          },
        ]
      }
      demographic_values: {
        Row: {
          date_loaded: string
          dimension_type_id: string
          dimension_value: string
          id: string
          metric_id: string
          value: number
        }
        Insert: {
          date_loaded?: string
          dimension_type_id: string
          dimension_value: string
          id?: string
          metric_id: string
          value: number
        }
        Update: {
          date_loaded?: string
          dimension_type_id?: string
          dimension_value?: string
          id?: string
          metric_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "demographic_values_instagram_dimension_type_id_fkey"
            columns: ["dimension_type_id"]
            isOneToOne: false
            referencedRelation: "dimension_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demographic_values_instagram_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "demographic_metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      desembolsos_desistidos: {
        Row: {
          Fecha_estimada: string | null
          Name: string | null
          Valor_de_desembolso__c: number | null
        }
        Insert: {
          Fecha_estimada?: string | null
          Name?: string | null
          Valor_de_desembolso__c?: number | null
        }
        Update: {
          Fecha_estimada?: string | null
          Name?: string | null
          Valor_de_desembolso__c?: number | null
        }
        Relationships: []
      }
      desembolsos_duppla: {
        Row: {
          "Centro de costo": string | null
          Fecha: string | null
          Valor: number | null
        }
        Insert: {
          "Centro de costo"?: string | null
          Fecha?: string | null
          Valor?: number | null
        }
        Update: {
          "Centro de costo"?: string | null
          Fecha?: string | null
          Valor?: number | null
        }
        Relationships: []
      }
      dimension_types: {
        Row: {
          description: string | null
          id: string
          type: string
        }
        Insert: {
          description?: string | null
          id?: string
          type: string
        }
        Update: {
          description?: string | null
          id?: string
          type?: string
        }
        Relationships: []
      }
      documentos_tipo_rag: {
        Row: {
          checklist_validacion: Json | null
          contenido_referencia: string | null
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          tipo_doc: string
        }
        Insert: {
          checklist_validacion?: Json | null
          contenido_referencia?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          tipo_doc: string
        }
        Update: {
          checklist_validacion?: Json | null
          contenido_referencia?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          tipo_doc?: string
        }
        Relationships: []
      }
      duppla_conversation_metrics_daily: {
        Row: {
          conversaciones_avanzaron: number
          conversaciones_no_avanzaron: number
          fecha: string
          internal_contact_id: string
          internal_contact_name: string
          total_conversaciones: number
          updated_at: string
        }
        Insert: {
          conversaciones_avanzaron: number
          conversaciones_no_avanzaron: number
          fecha: string
          internal_contact_id: string
          internal_contact_name: string
          total_conversaciones: number
          updated_at?: string
        }
        Update: {
          conversaciones_avanzaron?: number
          conversaciones_no_avanzaron?: number
          fecha?: string
          internal_contact_id?: string
          internal_contact_name?: string
          total_conversaciones?: number
          updated_at?: string
        }
        Relationships: []
      }
      entrevista_bonificaciones_empleo: {
        Row: {
          created_at: string | null
          explicacion_bonificacion: string | null
          id_bonificacion: string
          id_cuenta: string | null
          id_empleo: string | null
          periodicidad_bonificacion: number | null
          valor_bonificacion: number | null
        }
        Insert: {
          created_at?: string | null
          explicacion_bonificacion?: string | null
          id_bonificacion: string
          id_cuenta?: string | null
          id_empleo?: string | null
          periodicidad_bonificacion?: number | null
          valor_bonificacion?: number | null
        }
        Update: {
          created_at?: string | null
          explicacion_bonificacion?: string | null
          id_bonificacion?: string
          id_cuenta?: string | null
          id_empleo?: string | null
          periodicidad_bonificacion?: number | null
          valor_bonificacion?: number | null
        }
        Relationships: []
      }
      entrevista_cuentas_bancarias: {
        Row: {
          created_at: string | null
          cuenta_extranjero: boolean | null
          id_bank_account: string
          id_cuenta: string
          nombre_cuenta: string | null
        }
        Insert: {
          created_at?: string | null
          cuenta_extranjero?: boolean | null
          id_bank_account: string
          id_cuenta: string
          nombre_cuenta?: string | null
        }
        Update: {
          created_at?: string | null
          cuenta_extranjero?: boolean | null
          id_bank_account?: string
          id_cuenta?: string
          nombre_cuenta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_cuentas_bancarias_id_cuenta_fkey"
            columns: ["id_cuenta"]
            isOneToOne: false
            referencedRelation: "entrevista_solicitantes"
            referencedColumns: ["id_cuenta"]
          },
        ]
      }
      entrevista_data_para_semaforo: {
        Row: {
          calidad: string | null
          conscientiousness: string | null
          extraversion: string | null
          fluid_intelligence: string | null
          honesty: string | null
          id_cuenta: string
          id_oportunidad: string | null
          life_satisfaction: string | null
          locus_of_control: string | null
          moderation: string | null
          nivel_psicometrico: string | null
          openness: string | null
          optimism: string | null
          overconfidence: string | null
          present_bias: string | null
          risk_aversion: string | null
          saldo_mora: number | null
          score_crediticio: number | null
        }
        Insert: {
          calidad?: string | null
          conscientiousness?: string | null
          extraversion?: string | null
          fluid_intelligence?: string | null
          honesty?: string | null
          id_cuenta: string
          id_oportunidad?: string | null
          life_satisfaction?: string | null
          locus_of_control?: string | null
          moderation?: string | null
          nivel_psicometrico?: string | null
          openness?: string | null
          optimism?: string | null
          overconfidence?: string | null
          present_bias?: string | null
          risk_aversion?: string | null
          saldo_mora?: number | null
          score_crediticio?: number | null
        }
        Update: {
          calidad?: string | null
          conscientiousness?: string | null
          extraversion?: string | null
          fluid_intelligence?: string | null
          honesty?: string | null
          id_cuenta?: string
          id_oportunidad?: string | null
          life_satisfaction?: string | null
          locus_of_control?: string | null
          moderation?: string | null
          nivel_psicometrico?: string | null
          openness?: string | null
          optimism?: string | null
          overconfidence?: string | null
          present_bias?: string | null
          risk_aversion?: string | null
          saldo_mora?: number | null
          score_crediticio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_data_para_semaforo_id_cuenta_fkey"
            columns: ["id_cuenta"]
            isOneToOne: true
            referencedRelation: "entrevista_solicitantes"
            referencedColumns: ["id_cuenta"]
          },
        ]
      }
      entrevista_deducciones_empleo: {
        Row: {
          created_at: string | null
          explicacion_deduccion: string | null
          id_cuenta: string | null
          id_deduccion: string
          id_empleo: string | null
          monto_deduccion: number | null
          tipo_deduccion: string | null
        }
        Insert: {
          created_at?: string | null
          explicacion_deduccion?: string | null
          id_cuenta?: string | null
          id_deduccion: string
          id_empleo?: string | null
          monto_deduccion?: number | null
          tipo_deduccion?: string | null
        }
        Update: {
          created_at?: string | null
          explicacion_deduccion?: string | null
          id_cuenta?: string | null
          id_deduccion?: string
          id_empleo?: string | null
          monto_deduccion?: number | null
          tipo_deduccion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_deducciones_empleo_id_cuenta_fkey"
            columns: ["id_cuenta"]
            isOneToOne: false
            referencedRelation: "entrevista_solicitantes"
            referencedColumns: ["id_cuenta"]
          },
          {
            foreignKeyName: "entrevista_deducciones_empleo_id_empleo_fkey"
            columns: ["id_empleo"]
            isOneToOne: false
            referencedRelation: "entrevista_informacion_empleo"
            referencedColumns: ["id_empleo"]
          },
        ]
      }
      entrevista_gastos_hogar: {
        Row: {
          created_at: string | null
          explicacion_gasto_importante: string | null
          gasto_importante_adicional: string | null
          gastos_mantenimiento_hogar: number | null
          gastos_vacaciones_mes: number | null
          id_entrevista: string
          num_vehiculos: number | null
          valor_gastos_colegios: number | null
          valor_gastos_entretenimiento: number | null
          valor_gastos_impuesto_vehicular: number | null
          valor_gastos_materiales_escolares: number | null
          valor_gastos_mercado: number | null
          valor_gastos_seguro_salud: number | null
          valor_gastos_seguro_vehicular: number | null
          valor_gastos_servicios_publicos: number | null
          valor_gastos_soat: number | null
          valor_gastos_transporte: number | null
          valor_prom_gasto_importante: number | null
          vehiculos: string | null
        }
        Insert: {
          created_at?: string | null
          explicacion_gasto_importante?: string | null
          gasto_importante_adicional?: string | null
          gastos_mantenimiento_hogar?: number | null
          gastos_vacaciones_mes?: number | null
          id_entrevista: string
          num_vehiculos?: number | null
          valor_gastos_colegios?: number | null
          valor_gastos_entretenimiento?: number | null
          valor_gastos_impuesto_vehicular?: number | null
          valor_gastos_materiales_escolares?: number | null
          valor_gastos_mercado?: number | null
          valor_gastos_seguro_salud?: number | null
          valor_gastos_seguro_vehicular?: number | null
          valor_gastos_servicios_publicos?: number | null
          valor_gastos_soat?: number | null
          valor_gastos_transporte?: number | null
          valor_prom_gasto_importante?: number | null
          vehiculos?: string | null
        }
        Update: {
          created_at?: string | null
          explicacion_gasto_importante?: string | null
          gasto_importante_adicional?: string | null
          gastos_mantenimiento_hogar?: number | null
          gastos_vacaciones_mes?: number | null
          id_entrevista?: string
          num_vehiculos?: number | null
          valor_gastos_colegios?: number | null
          valor_gastos_entretenimiento?: number | null
          valor_gastos_impuesto_vehicular?: number | null
          valor_gastos_materiales_escolares?: number | null
          valor_gastos_mercado?: number | null
          valor_gastos_seguro_salud?: number | null
          valor_gastos_seguro_vehicular?: number | null
          valor_gastos_servicios_publicos?: number | null
          valor_gastos_soat?: number | null
          valor_gastos_transporte?: number | null
          valor_prom_gasto_importante?: number | null
          vehiculos?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_gastos_hogar_id_entrevista_fkey"
            columns: ["id_entrevista"]
            isOneToOne: true
            referencedRelation: "entrevista_registro_solicitud"
            referencedColumns: ["id_entrevista"]
          },
        ]
      }
      entrevista_hijos: {
        Row: {
          created_at: string | null
          edad_hijo: number | null
          hijo_num: number
          id_entrevista: string
        }
        Insert: {
          created_at?: string | null
          edad_hijo?: number | null
          hijo_num?: number
          id_entrevista: string
        }
        Update: {
          created_at?: string | null
          edad_hijo?: number | null
          hijo_num?: number
          id_entrevista?: string
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_hijos_id_entrevista_fkey"
            columns: ["id_entrevista"]
            isOneToOne: false
            referencedRelation: "entrevista_registro_solicitud"
            referencedColumns: ["id_entrevista"]
          },
        ]
      }
      entrevista_informacion_adicional: {
        Row: {
          ahorro_periodico: string | null
          created_at: string | null
          explicacion_ahorro: string | null
          id_entrevista: string
          recibe_ayuda_familiar: string | null
          valor_ahorro_prom_mensual: number | null
          valor_ayuda_prom_mensual: number | null
        }
        Insert: {
          ahorro_periodico?: string | null
          created_at?: string | null
          explicacion_ahorro?: string | null
          id_entrevista: string
          recibe_ayuda_familiar?: string | null
          valor_ahorro_prom_mensual?: number | null
          valor_ayuda_prom_mensual?: number | null
        }
        Update: {
          ahorro_periodico?: string | null
          created_at?: string | null
          explicacion_ahorro?: string | null
          id_entrevista?: string
          recibe_ayuda_familiar?: string | null
          valor_ahorro_prom_mensual?: number | null
          valor_ayuda_prom_mensual?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_informacion_adicional_id_entrevista_fkey"
            columns: ["id_entrevista"]
            isOneToOne: true
            referencedRelation: "entrevista_registro_solicitud"
            referencedColumns: ["id_entrevista"]
          },
        ]
      }
      entrevista_informacion_deudas: {
        Row: {
          created_at: string | null
          cuota_deuda_consumo: number | null
          cuota_deuda_educativa: number | null
          cuota_deuda_vehicular: number | null
          cuota_deuda_vivienda: number | null
          id_entrevista: string
          moneda_obligacion: string | null
          tasa_de_cambio: number | null
        }
        Insert: {
          created_at?: string | null
          cuota_deuda_consumo?: number | null
          cuota_deuda_educativa?: number | null
          cuota_deuda_vehicular?: number | null
          cuota_deuda_vivienda?: number | null
          id_entrevista: string
          moneda_obligacion?: string | null
          tasa_de_cambio?: number | null
        }
        Update: {
          created_at?: string | null
          cuota_deuda_consumo?: number | null
          cuota_deuda_educativa?: number | null
          cuota_deuda_vehicular?: number | null
          cuota_deuda_vivienda?: number | null
          id_entrevista?: string
          moneda_obligacion?: string | null
          tasa_de_cambio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_informacion_deudas_id_entrevista_fkey"
            columns: ["id_entrevista"]
            isOneToOne: true
            referencedRelation: "entrevista_registro_solicitud"
            referencedColumns: ["id_entrevista"]
          },
        ]
      }
      entrevista_informacion_empleo: {
        Row: {
          anho_inicio_contrato: number | null
          created_at: string | null
          empleo_extranjero: boolean | null
          id_cuenta: string
          id_empleo: string
          moneda_salario: string | null
          nombre_empleador: string | null
          ps_duracion_contrato: number | null
          ps_meses_sin_contrato: string | null
          ps_pago_seguridad: string | null
          ps_primer_anho_renovacion_contrato: number | null
          ps_retencion_fuente: string | null
          salario_mensual: number | null
          sector: string | null
          tasa_de_cambio: number | null
          tipo_contrato: string | null
        }
        Insert: {
          anho_inicio_contrato?: number | null
          created_at?: string | null
          empleo_extranjero?: boolean | null
          id_cuenta: string
          id_empleo: string
          moneda_salario?: string | null
          nombre_empleador?: string | null
          ps_duracion_contrato?: number | null
          ps_meses_sin_contrato?: string | null
          ps_pago_seguridad?: string | null
          ps_primer_anho_renovacion_contrato?: number | null
          ps_retencion_fuente?: string | null
          salario_mensual?: number | null
          sector?: string | null
          tasa_de_cambio?: number | null
          tipo_contrato?: string | null
        }
        Update: {
          anho_inicio_contrato?: number | null
          created_at?: string | null
          empleo_extranjero?: boolean | null
          id_cuenta?: string
          id_empleo?: string
          moneda_salario?: string | null
          nombre_empleador?: string | null
          ps_duracion_contrato?: number | null
          ps_meses_sin_contrato?: string | null
          ps_pago_seguridad?: string | null
          ps_primer_anho_renovacion_contrato?: number | null
          ps_retencion_fuente?: string | null
          salario_mensual?: number | null
          sector?: string | null
          tasa_de_cambio?: number | null
          tipo_contrato?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_informacion_empleo_id_cuenta_fkey"
            columns: ["id_cuenta"]
            isOneToOne: false
            referencedRelation: "entrevista_solicitantes"
            referencedColumns: ["id_cuenta"]
          },
        ]
      }
      entrevista_informacion_independientes: {
        Row: {
          created_at: string | null
          cuota_deudas_negocio: number | null
          descripcion_actividad_negocio: string | null
          descripcion_gasto_importante: string | null
          descripcion_ingreso_importante: string | null
          deudas_negocio: string | null
          estacionalidad_negocio: string | null
          gasto_arriendos: number | null
          gasto_comisiones: number | null
          gasto_empleados: number | null
          gasto_importante_negocio: string | null
          gasto_logistica: number | null
          gasto_materia_prima: number | null
          gasto_publicidad: number | null
          gasto_servicios: number | null
          gasto_servicios_terceros: number | null
          id_cuenta: string | null
          id_negocio: string
          ingreso_importante_negocio: string | null
          margen_promedio: number | null
          meses_buenos: string | null
          meses_malos: string | null
          moneda_negocio: string | null
          nombre_negocio: string | null
          num_empleados: number | null
          porcentaje_ownership_negocio: number | null
          porcentaje_ventas_efectivo: number | null
          precio_promedio_producto: number | null
          reinversion_negocio: number | null
          saldo_deudas_negocio: number | null
          sector_negocio: string | null
          tasa_de_cambio: number | null
          unidades_vendidas_mes_bueno: number | null
          unidades_vendidas_mes_malo: number | null
          utilidad_mes_1: number | null
          utilidad_mes_2: number | null
          utilidad_mes_3: number | null
          valor_prom_gasto: number | null
          valor_prom_ingreso: number | null
          ventas_mes_1: number | null
          ventas_mes_2: number | null
          ventas_mes_3: number | null
          ventas_mes_bueno: number | null
          ventas_mes_malo: number | null
        }
        Insert: {
          created_at?: string | null
          cuota_deudas_negocio?: number | null
          descripcion_actividad_negocio?: string | null
          descripcion_gasto_importante?: string | null
          descripcion_ingreso_importante?: string | null
          deudas_negocio?: string | null
          estacionalidad_negocio?: string | null
          gasto_arriendos?: number | null
          gasto_comisiones?: number | null
          gasto_empleados?: number | null
          gasto_importante_negocio?: string | null
          gasto_logistica?: number | null
          gasto_materia_prima?: number | null
          gasto_publicidad?: number | null
          gasto_servicios?: number | null
          gasto_servicios_terceros?: number | null
          id_cuenta?: string | null
          id_negocio: string
          ingreso_importante_negocio?: string | null
          margen_promedio?: number | null
          meses_buenos?: string | null
          meses_malos?: string | null
          moneda_negocio?: string | null
          nombre_negocio?: string | null
          num_empleados?: number | null
          porcentaje_ownership_negocio?: number | null
          porcentaje_ventas_efectivo?: number | null
          precio_promedio_producto?: number | null
          reinversion_negocio?: number | null
          saldo_deudas_negocio?: number | null
          sector_negocio?: string | null
          tasa_de_cambio?: number | null
          unidades_vendidas_mes_bueno?: number | null
          unidades_vendidas_mes_malo?: number | null
          utilidad_mes_1?: number | null
          utilidad_mes_2?: number | null
          utilidad_mes_3?: number | null
          valor_prom_gasto?: number | null
          valor_prom_ingreso?: number | null
          ventas_mes_1?: number | null
          ventas_mes_2?: number | null
          ventas_mes_3?: number | null
          ventas_mes_bueno?: number | null
          ventas_mes_malo?: number | null
        }
        Update: {
          created_at?: string | null
          cuota_deudas_negocio?: number | null
          descripcion_actividad_negocio?: string | null
          descripcion_gasto_importante?: string | null
          descripcion_ingreso_importante?: string | null
          deudas_negocio?: string | null
          estacionalidad_negocio?: string | null
          gasto_arriendos?: number | null
          gasto_comisiones?: number | null
          gasto_empleados?: number | null
          gasto_importante_negocio?: string | null
          gasto_logistica?: number | null
          gasto_materia_prima?: number | null
          gasto_publicidad?: number | null
          gasto_servicios?: number | null
          gasto_servicios_terceros?: number | null
          id_cuenta?: string | null
          id_negocio?: string
          ingreso_importante_negocio?: string | null
          margen_promedio?: number | null
          meses_buenos?: string | null
          meses_malos?: string | null
          moneda_negocio?: string | null
          nombre_negocio?: string | null
          num_empleados?: number | null
          porcentaje_ownership_negocio?: number | null
          porcentaje_ventas_efectivo?: number | null
          precio_promedio_producto?: number | null
          reinversion_negocio?: number | null
          saldo_deudas_negocio?: number | null
          sector_negocio?: string | null
          tasa_de_cambio?: number | null
          unidades_vendidas_mes_bueno?: number | null
          unidades_vendidas_mes_malo?: number | null
          utilidad_mes_1?: number | null
          utilidad_mes_2?: number | null
          utilidad_mes_3?: number | null
          valor_prom_gasto?: number | null
          valor_prom_ingreso?: number | null
          ventas_mes_1?: number | null
          ventas_mes_2?: number | null
          ventas_mes_3?: number | null
          ventas_mes_bueno?: number | null
          ventas_mes_malo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_informacion_independientes_id_cuenta_fkey"
            columns: ["id_cuenta"]
            isOneToOne: false
            referencedRelation: "entrevista_solicitantes"
            referencedColumns: ["id_cuenta"]
          },
        ]
      }
      entrevista_informacion_socioeconomica: {
        Row: {
          arriendo_esperado: number | null
          comentario_subsidio_hijos: string | null
          created_at: string | null
          habitara_vivienda: boolean | null
          hijos_dependientes: string | null
          id_entrevista: string
          inversion_proyectada_sobre_vivienda: number | null
          num_hijos_dependientes: number | null
          pago_arriendo: number | null
          proposito_vivienda: string | null
          subisidio_por_hijos: string | null
          tiempo_viviendo_en_inmueble: number | null
          tipo_vivienda_actual: string | null
          valor_administracion_mensual: number | null
          valor_impuesto_predial: number | null
          valor_subsidio_hijos: number | null
          vive_arriendo: string | null
        }
        Insert: {
          arriendo_esperado?: number | null
          comentario_subsidio_hijos?: string | null
          created_at?: string | null
          habitara_vivienda?: boolean | null
          hijos_dependientes?: string | null
          id_entrevista: string
          inversion_proyectada_sobre_vivienda?: number | null
          num_hijos_dependientes?: number | null
          pago_arriendo?: number | null
          proposito_vivienda?: string | null
          subisidio_por_hijos?: string | null
          tiempo_viviendo_en_inmueble?: number | null
          tipo_vivienda_actual?: string | null
          valor_administracion_mensual?: number | null
          valor_impuesto_predial?: number | null
          valor_subsidio_hijos?: number | null
          vive_arriendo?: string | null
        }
        Update: {
          arriendo_esperado?: number | null
          comentario_subsidio_hijos?: string | null
          created_at?: string | null
          habitara_vivienda?: boolean | null
          hijos_dependientes?: string | null
          id_entrevista?: string
          inversion_proyectada_sobre_vivienda?: number | null
          num_hijos_dependientes?: number | null
          pago_arriendo?: number | null
          proposito_vivienda?: string | null
          subisidio_por_hijos?: string | null
          tiempo_viviendo_en_inmueble?: number | null
          tipo_vivienda_actual?: string | null
          valor_administracion_mensual?: number | null
          valor_impuesto_predial?: number | null
          valor_subsidio_hijos?: number | null
          vive_arriendo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_informacion_socioeconomica_id_entrevista_fkey"
            columns: ["id_entrevista"]
            isOneToOne: true
            referencedRelation: "entrevista_registro_solicitud"
            referencedColumns: ["id_entrevista"]
          },
        ]
      }
      entrevista_informacion_solicitante_extranjero: {
        Row: {
          created_at: string | null
          explicacion_status_migratorio: string | null
          fecha_migracion: string | null
          id_cuenta: string
          num_trabajos_extranjero: number | null
          pais_residencia: string | null
          status_migratorio: string | null
          trabajo_extranjero: string | null
        }
        Insert: {
          created_at?: string | null
          explicacion_status_migratorio?: string | null
          fecha_migracion?: string | null
          id_cuenta: string
          num_trabajos_extranjero?: number | null
          pais_residencia?: string | null
          status_migratorio?: string | null
          trabajo_extranjero?: string | null
        }
        Update: {
          created_at?: string | null
          explicacion_status_migratorio?: string | null
          fecha_migracion?: string | null
          id_cuenta?: string
          num_trabajos_extranjero?: number | null
          pais_residencia?: string | null
          status_migratorio?: string | null
          trabajo_extranjero?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_informacion_solicitante_extranjero_id_cuenta_fkey"
            columns: ["id_cuenta"]
            isOneToOne: true
            referencedRelation: "entrevista_solicitantes"
            referencedColumns: ["id_cuenta"]
          },
        ]
      }
      entrevista_ingresos_adicionales: {
        Row: {
          created_at: string | null
          detalle_ingreso_adicional: string | null
          id_cuenta: string
          id_ingreso_adicional: string
          moneda_ingreso: string | null
          tasa_de_cambio: number | null
          tipo_ingreso_adicional: string | null
          valor_promedio_ingreso_adicional: number | null
        }
        Insert: {
          created_at?: string | null
          detalle_ingreso_adicional?: string | null
          id_cuenta: string
          id_ingreso_adicional: string
          moneda_ingreso?: string | null
          tasa_de_cambio?: number | null
          tipo_ingreso_adicional?: string | null
          valor_promedio_ingreso_adicional?: number | null
        }
        Update: {
          created_at?: string | null
          detalle_ingreso_adicional?: string | null
          id_cuenta?: string
          id_ingreso_adicional?: string
          moneda_ingreso?: string | null
          tasa_de_cambio?: number | null
          tipo_ingreso_adicional?: string | null
          valor_promedio_ingreso_adicional?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_ingresos_adicionales_id_cuenta_fkey"
            columns: ["id_cuenta"]
            isOneToOne: false
            referencedRelation: "entrevista_solicitantes"
            referencedColumns: ["id_cuenta"]
          },
        ]
      }
      entrevista_registro_solicitud: {
        Row: {
          ahorro_sugerido: number | null
          canon_cotizacion: number | null
          canon_mas_ahorro_sugerido: number | null
          created_at: string | null
          cuota_inicial: number | null
          estado_aprobacion: string | null
          id_entrevista: string
          id_oportunidad: string | null
          link_entrevista: string | null
          link_modelo_financiero: string | null
          meta: number | null
          porcentaje_cuota_inicial: number | null
          presupuesto_inmueble: number | null
          responsable_entrevista: string | null
          semaforo_aprobacion: string | null
          timestamp_aprobacion: string | null
        }
        Insert: {
          ahorro_sugerido?: number | null
          canon_cotizacion?: number | null
          canon_mas_ahorro_sugerido?: number | null
          created_at?: string | null
          cuota_inicial?: number | null
          estado_aprobacion?: string | null
          id_entrevista: string
          id_oportunidad?: string | null
          link_entrevista?: string | null
          link_modelo_financiero?: string | null
          meta?: number | null
          porcentaje_cuota_inicial?: number | null
          presupuesto_inmueble?: number | null
          responsable_entrevista?: string | null
          semaforo_aprobacion?: string | null
          timestamp_aprobacion?: string | null
        }
        Update: {
          ahorro_sugerido?: number | null
          canon_cotizacion?: number | null
          canon_mas_ahorro_sugerido?: number | null
          created_at?: string | null
          cuota_inicial?: number | null
          estado_aprobacion?: string | null
          id_entrevista?: string
          id_oportunidad?: string | null
          link_entrevista?: string | null
          link_modelo_financiero?: string | null
          meta?: number | null
          porcentaje_cuota_inicial?: number | null
          presupuesto_inmueble?: number | null
          responsable_entrevista?: string | null
          semaforo_aprobacion?: string | null
          timestamp_aprobacion?: string | null
        }
        Relationships: []
      }
      entrevista_solicitantes: {
        Row: {
          actividad_economica: string | null
          cabeza_de_hogar: boolean | null
          calidad: string | null
          created_at: string | null
          estado_civil: string | null
          fecha_nacimiento: string | null
          genero: string | null
          id_cuenta: string
          id_entrevista: string | null
          nivel_educativo: string | null
          nombre: string | null
          num_id: string | null
          parentezco: string | null
          tipo_id: string | null
          vive_en_extranjero: boolean | null
        }
        Insert: {
          actividad_economica?: string | null
          cabeza_de_hogar?: boolean | null
          calidad?: string | null
          created_at?: string | null
          estado_civil?: string | null
          fecha_nacimiento?: string | null
          genero?: string | null
          id_cuenta: string
          id_entrevista?: string | null
          nivel_educativo?: string | null
          nombre?: string | null
          num_id?: string | null
          parentezco?: string | null
          tipo_id?: string | null
          vive_en_extranjero?: boolean | null
        }
        Update: {
          actividad_economica?: string | null
          cabeza_de_hogar?: boolean | null
          calidad?: string | null
          created_at?: string | null
          estado_civil?: string | null
          fecha_nacimiento?: string | null
          genero?: string | null
          id_cuenta?: string
          id_entrevista?: string | null
          nivel_educativo?: string | null
          nombre?: string | null
          num_id?: string | null
          parentezco?: string | null
          tipo_id?: string | null
          vive_en_extranjero?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevista_solicitantes_id_entrevista_fkey"
            columns: ["id_entrevista"]
            isOneToOne: false
            referencedRelation: "entrevista_registro_solicitud"
            referencedColumns: ["id_entrevista"]
          },
        ]
      }
      equipos_colaboradores: {
        Row: {
          colaborador: string
          email: string | null
          id: number
          no_llamadas: number | null
          team: string
        }
        Insert: {
          colaborador: string
          email?: string | null
          id?: number
          no_llamadas?: number | null
          team: string
        }
        Update: {
          colaborador?: string
          email?: string | null
          id?: number
          no_llamadas?: number | null
          team?: string
        }
        Relationships: []
      }
      fixes_log: {
        Row: {
          chart_target: string | null
          created_at: string | null
          description: string | null
          fix_date: string
          id: string
          image_url: string | null
          inbox_names: string | null
          title: string
        }
        Insert: {
          chart_target?: string | null
          created_at?: string | null
          description?: string | null
          fix_date: string
          id?: string
          image_url?: string | null
          inbox_names?: string | null
          title: string
        }
        Update: {
          chart_target?: string | null
          created_at?: string | null
          description?: string | null
          fix_date?: string
          id?: string
          image_url?: string | null
          inbox_names?: string | null
          title?: string
        }
        Relationships: []
      }
      gastos_comisiones: {
        Row: {
          "Centro de costo": string | null
          "Código contable": string | null
          Comprobante: string | null
          "Cuenta contable": string | null
          Débito: number | null
          "Fecha elaboración": string | null
          Identificación: string | null
          "Nombre del tercero": string | null
        }
        Insert: {
          "Centro de costo"?: string | null
          "Código contable"?: string | null
          Comprobante?: string | null
          "Cuenta contable"?: string | null
          Débito?: number | null
          "Fecha elaboración"?: string | null
          Identificación?: string | null
          "Nombre del tercero"?: string | null
        }
        Update: {
          "Centro de costo"?: string | null
          "Código contable"?: string | null
          Comprobante?: string | null
          "Cuenta contable"?: string | null
          Débito?: number | null
          "Fecha elaboración"?: string | null
          Identificación?: string | null
          "Nombre del tercero"?: string | null
        }
        Relationships: []
      }
      gastos_publicidad: {
        Row: {
          "Código contable": string | null
          Comprobante: string | null
          "Cuenta contable": string | null
          Débito: number | null
          "Fecha elaboración": string | null
          Identificación: string | null
          "Nombre tercero": string | null
        }
        Insert: {
          "Código contable"?: string | null
          Comprobante?: string | null
          "Cuenta contable"?: string | null
          Débito?: number | null
          "Fecha elaboración"?: string | null
          Identificación?: string | null
          "Nombre tercero"?: string | null
        }
        Update: {
          "Código contable"?: string | null
          Comprobante?: string | null
          "Cuenta contable"?: string | null
          Débito?: number | null
          "Fecha elaboración"?: string | null
          Identificación?: string | null
          "Nombre tercero"?: string | null
        }
        Relationships: []
      }
      gestion_predial: {
        Row: {
          anio_vigencia: number | null
          created_at: string | null
          estado: string | null
          fecha_pago: string | null
          id: string
          nombre_inmueble: string | null
          notas: string | null
          pago_incluido_inmueble: boolean
          salesforce_id: string
          tipo_predio: string
          url_soporte: string | null
          valor_avaluo: number | null
          valor_pago: number | null
        }
        Insert: {
          anio_vigencia?: number | null
          created_at?: string | null
          estado?: string | null
          fecha_pago?: string | null
          id?: string
          nombre_inmueble?: string | null
          notas?: string | null
          pago_incluido_inmueble?: boolean
          salesforce_id: string
          tipo_predio?: string
          url_soporte?: string | null
          valor_avaluo?: number | null
          valor_pago?: number | null
        }
        Update: {
          anio_vigencia?: number | null
          created_at?: string | null
          estado?: string | null
          fecha_pago?: string | null
          id?: string
          nombre_inmueble?: string | null
          notas?: string | null
          pago_incluido_inmueble?: boolean
          salesforce_id?: string
          tipo_predio?: string
          url_soporte?: string | null
          valor_avaluo?: number | null
          valor_pago?: number | null
        }
        Relationships: []
      }
      google_ads_raw: {
        Row: {
          account_name: string | null
          ad_name: string | null
          adset_name: string | null
          budget: number | null
          clicks: number | null
          conversions: number | null
          cost_per_conversion: number | null
          ctr: number | null
          date: string | null
          impressions: number | null
          interactions: number | null
          spend: number | null
        }
        Insert: {
          account_name?: string | null
          ad_name?: string | null
          adset_name?: string | null
          budget?: number | null
          clicks?: number | null
          conversions?: number | null
          cost_per_conversion?: number | null
          ctr?: number | null
          date?: string | null
          impressions?: number | null
          interactions?: number | null
          spend?: number | null
        }
        Update: {
          account_name?: string | null
          ad_name?: string | null
          adset_name?: string | null
          budget?: number | null
          clicks?: number | null
          conversions?: number | null
          cost_per_conversion?: number | null
          ctr?: number | null
          date?: string | null
          impressions?: number | null
          interactions?: number | null
          spend?: number | null
        }
        Relationships: []
      }
      google_analytics: {
        Row: {
          campana: string
          fecha: string
          id: string
          total_usuarios_activos: number
        }
        Insert: {
          campana: string
          fecha: string
          id?: string
          total_usuarios_activos: number
        }
        Update: {
          campana?: string
          fecha?: string
          id?: string
          total_usuarios_activos?: number
        }
        Relationships: []
      }
      growth_experiments: {
        Row: {
          chart_target: string | null
          comments: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          hypothesis: string | null
          id: string
          image_url: string | null
          inbox_names: string | null
          learnings: string | null
          outcome: string | null
          start_date: string | null
          tags: string | null
          title: string
        }
        Insert: {
          chart_target?: string | null
          comments?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          hypothesis?: string | null
          id?: string
          image_url?: string | null
          inbox_names?: string | null
          learnings?: string | null
          outcome?: string | null
          start_date?: string | null
          tags?: string | null
          title: string
        }
        Update: {
          chart_target?: string | null
          comments?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          hypothesis?: string | null
          id?: string
          image_url?: string | null
          inbox_names?: string | null
          learnings?: string | null
          outcome?: string | null
          start_date?: string | null
          tags?: string | null
          title?: string
        }
        Relationships: []
      }
      historial_cambios_sf: {
        Row: {
          aprobado_por: string
          campo_corregido: string
          codigo_inmueble: string
          created_at: string
          fuente: string | null
          id: string
          salesforce_id: string | null
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          aprobado_por: string
          campo_corregido: string
          codigo_inmueble: string
          created_at?: string
          fuente?: string | null
          id?: string
          salesforce_id?: string | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          aprobado_por?: string
          campo_corregido?: string
          codigo_inmueble?: string
          created_at?: string
          fuente?: string | null
          id?: string
          salesforce_id?: string | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: []
      }
      humano_logs: {
        Row: {
          conversation_id: string
          id: string
          logged_at: string | null
        }
        Insert: {
          conversation_id: string
          id?: string
          logged_at?: string | null
        }
        Update: {
          conversation_id?: string
          id?: string
          logged_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_conversation"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      inmuebles_administraciones: {
        Row: {
          ano_pago: number
          ano_registro: number | null
          bad_debt: number | null
          balance_admon: number | null
          codigo_inmueble: string | null
          cuenta_de_cobro: boolean | null
          cuenta_de_cobro_url: string | null
          estado_balance_admon:
            | Database["public"]["Enums"]["estado_balance_admon"]
            | null
          fecha_pago: string | null
          id_inmueble: string
          inserted_At: string | null
          mes_pago: number
          mes_registro: number | null
          notas_pago: string | null
          otros_cobros: number | null
          paga_cliente: boolean | null
          pagado: boolean | null
          record_id: string
          soporte_pago_url: string | null
          updated_at: string | null
          valor_admon: number | null
          valor_admon_descuento: number | null
          valor_extraordinaria: number | null
          valor_multa: number | null
          valor_total: number | null
        }
        Insert: {
          ano_pago: number
          ano_registro?: number | null
          bad_debt?: number | null
          balance_admon?: number | null
          codigo_inmueble?: string | null
          cuenta_de_cobro?: boolean | null
          cuenta_de_cobro_url?: string | null
          estado_balance_admon?:
            | Database["public"]["Enums"]["estado_balance_admon"]
            | null
          fecha_pago?: string | null
          id_inmueble: string
          inserted_At?: string | null
          mes_pago: number
          mes_registro?: number | null
          notas_pago?: string | null
          otros_cobros?: number | null
          paga_cliente?: boolean | null
          pagado?: boolean | null
          record_id?: string
          soporte_pago_url?: string | null
          updated_at?: string | null
          valor_admon?: number | null
          valor_admon_descuento?: number | null
          valor_extraordinaria?: number | null
          valor_multa?: number | null
          valor_total?: number | null
        }
        Update: {
          ano_pago?: number
          ano_registro?: number | null
          bad_debt?: number | null
          balance_admon?: number | null
          codigo_inmueble?: string | null
          cuenta_de_cobro?: boolean | null
          cuenta_de_cobro_url?: string | null
          estado_balance_admon?:
            | Database["public"]["Enums"]["estado_balance_admon"]
            | null
          fecha_pago?: string | null
          id_inmueble?: string
          inserted_At?: string | null
          mes_pago?: number
          mes_registro?: number | null
          notas_pago?: string | null
          otros_cobros?: number | null
          paga_cliente?: boolean | null
          pagado?: boolean | null
          record_id?: string
          soporte_pago_url?: string | null
          updated_at?: string | null
          valor_admon?: number | null
          valor_admon_descuento?: number | null
          valor_extraordinaria?: number | null
          valor_multa?: number | null
          valor_total?: number | null
        }
        Relationships: []
      }
      inmuebles_administraciones_notas: {
        Row: {
          created_at: string
          created_by_email: string | null
          created_by_org: string | null
          created_by_user_id: string | null
          note: string | null
          note_id: string
          record_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_email?: string | null
          created_by_org?: string | null
          created_by_user_id?: string | null
          note?: string | null
          note_id?: string
          record_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_email?: string | null
          created_by_org?: string | null
          created_by_user_id?: string | null
          note?: string | null
          note_id?: string
          record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inmuebles_administraciones_notas_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "inmuebles_administraciones"
            referencedColumns: ["record_id"]
          },
        ]
      }
      inmuebles_asambleas: {
        Row: {
          anio_asamblea: number
          asistio: string | null
          aumento_actualizado_sf: boolean | null
          aumento_cliente_notificado: boolean | null
          aumento_confirmado: boolean | null
          cliente_notificado: boolean | null
          codigo_inmueble: string | null
          created_at: string
          fecha_asamblea: string
          id: string
          id_inmueble: string
          notas: string | null
          notas_aumento: string | null
          tipo_asamblea: string
          tipo_aumento: string | null
          updated_at: string
        }
        Insert: {
          anio_asamblea: number
          asistio?: string | null
          aumento_actualizado_sf?: boolean | null
          aumento_cliente_notificado?: boolean | null
          aumento_confirmado?: boolean | null
          cliente_notificado?: boolean | null
          codigo_inmueble?: string | null
          created_at?: string
          fecha_asamblea: string
          id?: string
          id_inmueble: string
          notas?: string | null
          notas_aumento?: string | null
          tipo_asamblea: string
          tipo_aumento?: string | null
          updated_at?: string
        }
        Update: {
          anio_asamblea?: number
          asistio?: string | null
          aumento_actualizado_sf?: boolean | null
          aumento_cliente_notificado?: boolean | null
          aumento_confirmado?: boolean | null
          cliente_notificado?: boolean | null
          codigo_inmueble?: string | null
          created_at?: string
          fecha_asamblea?: string
          id?: string
          id_inmueble?: string
          notas?: string | null
          notas_aumento?: string | null
          tipo_asamblea?: string
          tipo_aumento?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inversiones: {
        Row: {
          fecha_creacion: string | null
          fecha_inversion: string | null
          fecha_ultima_actividad: string | null
          fecha_ultima_modificacion: string | null
          fecha_ultima_visualizacion: string | null
          id_inversion: string
          id_inversionista: string | null
          id_oportunidad: string | null
          monto_invertido: number | null
          nombre_inversion: string | null
          nombre_inversionista: string | null
          nombre_oportunidad: string | null
          participacion_sobre_el_portafolio: number | null
          portafolio: string | null
          propietario_transaccion: string | null
          tasa_de_entrada_al_portafolio: number | null
          tipo_de_inversion: string | null
          usuario_creador: string | null
          usuario_responsable: string | null
          usuario_ultima_modificacion: string | null
          valor_de_entrada_portafolio: number | null
        }
        Insert: {
          fecha_creacion?: string | null
          fecha_inversion?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_ultima_visualizacion?: string | null
          id_inversion: string
          id_inversionista?: string | null
          id_oportunidad?: string | null
          monto_invertido?: number | null
          nombre_inversion?: string | null
          nombre_inversionista?: string | null
          nombre_oportunidad?: string | null
          participacion_sobre_el_portafolio?: number | null
          portafolio?: string | null
          propietario_transaccion?: string | null
          tasa_de_entrada_al_portafolio?: number | null
          tipo_de_inversion?: string | null
          usuario_creador?: string | null
          usuario_responsable?: string | null
          usuario_ultima_modificacion?: string | null
          valor_de_entrada_portafolio?: number | null
        }
        Update: {
          fecha_creacion?: string | null
          fecha_inversion?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_ultima_visualizacion?: string | null
          id_inversion?: string
          id_inversionista?: string | null
          id_oportunidad?: string | null
          monto_invertido?: number | null
          nombre_inversion?: string | null
          nombre_inversionista?: string | null
          nombre_oportunidad?: string | null
          participacion_sobre_el_portafolio?: number | null
          portafolio?: string | null
          propietario_transaccion?: string | null
          tasa_de_entrada_al_portafolio?: number | null
          tipo_de_inversion?: string | null
          usuario_creador?: string | null
          usuario_responsable?: string | null
          usuario_ultima_modificacion?: string | null
          valor_de_entrada_portafolio?: number | null
        }
        Relationships: []
      }
      leads_inversionistas: {
        Row: {
          "  acepto": boolean
          "  anio_nacimiento": number
          "  apellidos": string
          "  campaign": string | null
          "  correo": string
          "  created_at": string | null
          "  cuando_invertir": string | null
          "  fuente_fondos": string | null
          "  id": number
          "  indicativo_celular": string
          "  monto_a_invertir": string
          "  nombres": string
          "  numero_celular": string
          "  ocupacion": string
          "  updated_at": string | null
        }
        Insert: {
          "  acepto"?: boolean
          "  anio_nacimiento": number
          "  apellidos": string
          "  campaign"?: string | null
          "  correo": string
          "  created_at"?: string | null
          "  cuando_invertir"?: string | null
          "  fuente_fondos"?: string | null
          "  id"?: number
          "  indicativo_celular": string
          "  monto_a_invertir": string
          "  nombres": string
          "  numero_celular": string
          "  ocupacion": string
          "  updated_at"?: string | null
        }
        Update: {
          "  acepto"?: boolean
          "  anio_nacimiento"?: number
          "  apellidos"?: string
          "  campaign"?: string | null
          "  correo"?: string
          "  created_at"?: string | null
          "  cuando_invertir"?: string | null
          "  fuente_fondos"?: string | null
          "  id"?: number
          "  indicativo_celular"?: string
          "  monto_a_invertir"?: string
          "  nombres"?: string
          "  numero_celular"?: string
          "  ocupacion"?: string
          "  updated_at"?: string | null
        }
        Relationships: []
      }
      leads_offload: {
        Row: {
          campana: string | null
          clasificacion_final: string | null
          declara_renta: boolean | null
          estado_del_lead: string | null
          fecha_creacion: string | null
          fecha_ultima_actividad: string | null
          fecha_ultima_modificacion: string | null
          fecha_ultima_visualizacion: string | null
          id_campana: string | null
          id_lead: string
          id_oportunidad: string | null
          lead_convertido: boolean | null
          modelo_canal: string | null
          monto_invertir: string | null
          nombre_lead: string | null
          ocupacion: string | null
          perfilador: string | null
          rango_edad: string | null
          razon_de_perdida_lead: string | null
          score: number | null
          telefono_celular: string | null
          tipo_canal: string | null
        }
        Insert: {
          campana?: string | null
          clasificacion_final?: string | null
          declara_renta?: boolean | null
          estado_del_lead?: string | null
          fecha_creacion?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_ultima_visualizacion?: string | null
          id_campana?: string | null
          id_lead: string
          id_oportunidad?: string | null
          lead_convertido?: boolean | null
          modelo_canal?: string | null
          monto_invertir?: string | null
          nombre_lead?: string | null
          ocupacion?: string | null
          perfilador?: string | null
          rango_edad?: string | null
          razon_de_perdida_lead?: string | null
          score?: number | null
          telefono_celular?: string | null
          tipo_canal?: string | null
        }
        Update: {
          campana?: string | null
          clasificacion_final?: string | null
          declara_renta?: boolean | null
          estado_del_lead?: string | null
          fecha_creacion?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_ultima_visualizacion?: string | null
          id_campana?: string | null
          id_lead?: string
          id_oportunidad?: string | null
          lead_convertido?: boolean | null
          modelo_canal?: string | null
          monto_invertir?: string | null
          nombre_lead?: string | null
          ocupacion?: string | null
          perfilador?: string | null
          rango_edad?: string | null
          razon_de_perdida_lead?: string | null
          score?: number | null
          telefono_celular?: string | null
          tipo_canal?: string | null
        }
        Relationships: []
      }
      leads_rent_to_own: {
        Row: {
          actividad_economica: string | null
          ahorros_cuota_inicial: string | null
          area: string | null
          autorizacion_centrales_riesgo: boolean | null
          ayuda_cuota_inicial: string | null
          barrio_deseado: string | null
          broker: string | null
          busca_inmueble_vis: boolean | null
          busca_subsidio_de_vivienda: boolean | null
          calidad_darwin: string | null
          calidad_lead: string | null
          celular: string | null
          ciudad: string | null
          con_quien_comprar: string | null
          condicion_inmueble: string | null
          copropietario_1: string | null
          copropietario_2: string | null
          copropietario_3: string | null
          correo: string | null
          costo_arriendo_actual: number | null
          cuando_quiere_comprar: string | null
          cuota_inicial: number | null
          cuota_inicial_minima: number | null
          cuota_mensual_creditos: number | null
          data_quality_score: number | null
          deuda: number | null
          dias_gestion: number | null
          diferencia_ingreso_minimo: number | null
          do_not_call: boolean | null
          edad: number | null
          estado_civil: string | null
          estatus_lead: string | null
          fecha_creacion: string | null
          fecha_ultima_modificacion: string | null
          financiamiento_banca: string | null
          genero: string | null
          id_canal: string | null
          id_lead: string
          id_oportunidad: string | null
          ingresos_cliente: number | null
          ingresos_copropietario: number | null
          ingresos_familiares: number | null
          ingresos_minimos: number | null
          ingresos_totales: number | null
          lead_recontactado: boolean | null
          lead_recuperado: boolean | null
          nivel_academico: string | null
          nombre_campana: string | null
          nombre_lead: string | null
          numero_documento: string | null
          numero_documento_temporal: number | null
          numero_habitaciones_deseado: number | null
          numero_llamadas: number | null
          observaciones: string | null
          ocupacion_darwin: string | null
          pain_points_cliente: string | null
          pct_faltante_ingresos: number | null
          pct_ingresos_sobre_inmueble: number | null
          pctcuota_inicial: number | null
          picklist_ciudad: string | null
          porcentaje_deuda_sobre_ingresos: number | null
          porcentaje_mora_sobre_suma_ingresos: number | null
          presupuesto: number | null
          prioridad_llamada: number | null
          proceso_con_inmueble: string | null
          profesion: string | null
          razon_calidad: string | null
          razon_descalificado: string | null
          recomedacion_mora_suma_ingresos: string | null
          recomendacion_deuda_ingreso: string | null
          reportes_en_datacredito: string | null
          responsable: string | null
          saldo_mora_30dias: number | null
          saldo_mora_60dias: number | null
          saldo_mora_90dias: number | null
          score: number | null
          score_datacredito: number | null
          sector_inmueble: string | null
          Suma_de_ingresos: number | null
          suma_saldos_mora: number | null
          telefono: string | null
          terminos_y_condiciones: boolean | null
          tipo_documento: string | null
          tipo_ingreso: string | null
          tipo_ingreso_cotitular: string | null
          tipo_vivienda: string | null
          ultima_fecha_transferencia: string | null
          valor_max_inmueble_ci: number | null
          valor_max_inmueble_in: number | null
        }
        Insert: {
          actividad_economica?: string | null
          ahorros_cuota_inicial?: string | null
          area?: string | null
          autorizacion_centrales_riesgo?: boolean | null
          ayuda_cuota_inicial?: string | null
          barrio_deseado?: string | null
          broker?: string | null
          busca_inmueble_vis?: boolean | null
          busca_subsidio_de_vivienda?: boolean | null
          calidad_darwin?: string | null
          calidad_lead?: string | null
          celular?: string | null
          ciudad?: string | null
          con_quien_comprar?: string | null
          condicion_inmueble?: string | null
          copropietario_1?: string | null
          copropietario_2?: string | null
          copropietario_3?: string | null
          correo?: string | null
          costo_arriendo_actual?: number | null
          cuando_quiere_comprar?: string | null
          cuota_inicial?: number | null
          cuota_inicial_minima?: number | null
          cuota_mensual_creditos?: number | null
          data_quality_score?: number | null
          deuda?: number | null
          dias_gestion?: number | null
          diferencia_ingreso_minimo?: number | null
          do_not_call?: boolean | null
          edad?: number | null
          estado_civil?: string | null
          estatus_lead?: string | null
          fecha_creacion?: string | null
          fecha_ultima_modificacion?: string | null
          financiamiento_banca?: string | null
          genero?: string | null
          id_canal?: string | null
          id_lead: string
          id_oportunidad?: string | null
          ingresos_cliente?: number | null
          ingresos_copropietario?: number | null
          ingresos_familiares?: number | null
          ingresos_minimos?: number | null
          ingresos_totales?: number | null
          lead_recontactado?: boolean | null
          lead_recuperado?: boolean | null
          nivel_academico?: string | null
          nombre_campana?: string | null
          nombre_lead?: string | null
          numero_documento?: string | null
          numero_documento_temporal?: number | null
          numero_habitaciones_deseado?: number | null
          numero_llamadas?: number | null
          observaciones?: string | null
          ocupacion_darwin?: string | null
          pain_points_cliente?: string | null
          pct_faltante_ingresos?: number | null
          pct_ingresos_sobre_inmueble?: number | null
          pctcuota_inicial?: number | null
          picklist_ciudad?: string | null
          porcentaje_deuda_sobre_ingresos?: number | null
          porcentaje_mora_sobre_suma_ingresos?: number | null
          presupuesto?: number | null
          prioridad_llamada?: number | null
          proceso_con_inmueble?: string | null
          profesion?: string | null
          razon_calidad?: string | null
          razon_descalificado?: string | null
          recomedacion_mora_suma_ingresos?: string | null
          recomendacion_deuda_ingreso?: string | null
          reportes_en_datacredito?: string | null
          responsable?: string | null
          saldo_mora_30dias?: number | null
          saldo_mora_60dias?: number | null
          saldo_mora_90dias?: number | null
          score?: number | null
          score_datacredito?: number | null
          sector_inmueble?: string | null
          Suma_de_ingresos?: number | null
          suma_saldos_mora?: number | null
          telefono?: string | null
          terminos_y_condiciones?: boolean | null
          tipo_documento?: string | null
          tipo_ingreso?: string | null
          tipo_ingreso_cotitular?: string | null
          tipo_vivienda?: string | null
          ultima_fecha_transferencia?: string | null
          valor_max_inmueble_ci?: number | null
          valor_max_inmueble_in?: number | null
        }
        Update: {
          actividad_economica?: string | null
          ahorros_cuota_inicial?: string | null
          area?: string | null
          autorizacion_centrales_riesgo?: boolean | null
          ayuda_cuota_inicial?: string | null
          barrio_deseado?: string | null
          broker?: string | null
          busca_inmueble_vis?: boolean | null
          busca_subsidio_de_vivienda?: boolean | null
          calidad_darwin?: string | null
          calidad_lead?: string | null
          celular?: string | null
          ciudad?: string | null
          con_quien_comprar?: string | null
          condicion_inmueble?: string | null
          copropietario_1?: string | null
          copropietario_2?: string | null
          copropietario_3?: string | null
          correo?: string | null
          costo_arriendo_actual?: number | null
          cuando_quiere_comprar?: string | null
          cuota_inicial?: number | null
          cuota_inicial_minima?: number | null
          cuota_mensual_creditos?: number | null
          data_quality_score?: number | null
          deuda?: number | null
          dias_gestion?: number | null
          diferencia_ingreso_minimo?: number | null
          do_not_call?: boolean | null
          edad?: number | null
          estado_civil?: string | null
          estatus_lead?: string | null
          fecha_creacion?: string | null
          fecha_ultima_modificacion?: string | null
          financiamiento_banca?: string | null
          genero?: string | null
          id_canal?: string | null
          id_lead?: string
          id_oportunidad?: string | null
          ingresos_cliente?: number | null
          ingresos_copropietario?: number | null
          ingresos_familiares?: number | null
          ingresos_minimos?: number | null
          ingresos_totales?: number | null
          lead_recontactado?: boolean | null
          lead_recuperado?: boolean | null
          nivel_academico?: string | null
          nombre_campana?: string | null
          nombre_lead?: string | null
          numero_documento?: string | null
          numero_documento_temporal?: number | null
          numero_habitaciones_deseado?: number | null
          numero_llamadas?: number | null
          observaciones?: string | null
          ocupacion_darwin?: string | null
          pain_points_cliente?: string | null
          pct_faltante_ingresos?: number | null
          pct_ingresos_sobre_inmueble?: number | null
          pctcuota_inicial?: number | null
          picklist_ciudad?: string | null
          porcentaje_deuda_sobre_ingresos?: number | null
          porcentaje_mora_sobre_suma_ingresos?: number | null
          presupuesto?: number | null
          prioridad_llamada?: number | null
          proceso_con_inmueble?: string | null
          profesion?: string | null
          razon_calidad?: string | null
          razon_descalificado?: string | null
          recomedacion_mora_suma_ingresos?: string | null
          recomendacion_deuda_ingreso?: string | null
          reportes_en_datacredito?: string | null
          responsable?: string | null
          saldo_mora_30dias?: number | null
          saldo_mora_60dias?: number | null
          saldo_mora_90dias?: number | null
          score?: number | null
          score_datacredito?: number | null
          sector_inmueble?: string | null
          Suma_de_ingresos?: number | null
          suma_saldos_mora?: number | null
          telefono?: string | null
          terminos_y_condiciones?: boolean | null
          tipo_documento?: string | null
          tipo_ingreso?: string | null
          tipo_ingreso_cotitular?: string | null
          tipo_vivienda?: string | null
          ultima_fecha_transferencia?: string | null
          valor_max_inmueble_ci?: number | null
          valor_max_inmueble_in?: number | null
        }
        Relationships: []
      }
      legal_seguimiento: {
        Row: {
          account: string | null
          acta_entrega: boolean | null
          afectacion_vivienda_familiar: boolean | null
          anexo1: boolean | null
          boleta_registro: boolean | null
          boleta_registro_escrituracion_cpv: string | null
          broker: string | null
          canon_actual: string | null
          cantidad_pagos_desembolso: string | null
          carpeta_drive_url: string | null
          carta_de_cesion_firmada_aprobada: string | null
          cesion_de_derechos: string | null
          check_entrega_inmueble: boolean | null
          check_estudio_titulos_completado: boolean | null
          check_preparacion_contrados_completado: boolean | null
          cliente_corrio_sagrilaft: boolean | null
          comentarios_sagrilaft_cliente: string | null
          contrato_arrendamiento: boolean | null
          correo: string | null
          cuota_inicial_pagada: number | null
          datos_administracion: boolean | null
          dias_abierta: number | null
          diferencia_desembolso_total: number | null
          documentos_completos_estudio_titulo: boolean | null
          encargado_proceso_legal: string | null
          entrega_explicacion_modelo_vendedor: boolean | null
          envio_escritura_registro: boolean | null
          escritura_antecedente: string | null
          escritura_publica_final: boolean | null
          escritura_publica_final_estado: string | null
          escritura_publica_firmada_vendedor: boolean | null
          escritura_publica_radicada: boolean | null
          escritura_publica_transferencia_radicada: string | null
          estado_contrato_arrendamiento: string | null
          estado_inmueble: string | null
          estado_minuta__c: string | null
          estado_promesa_compraventa_cliente: string | null
          estado_promesa_compraventa_vendedor: string | null
          estudio_titulos: boolean | null
          estudio_titulos_estado: string | null
          etapa: string | null
          fecha_cesion_del_activo: string | null
          fecha_creacion: string | null
          fecha_desembolso_1: string | null
          fecha_desembolso_2: string | null
          fecha_desembolso_3: string | null
          fecha_desembolso_comercial: string | null
          fecha_desembolso_confirmada: string | null
          fecha_desembolso_legal: string | null
          fecha_entrega_inmueble: string | null
          fecha_firma_contrato_arrendamiento: string | null
          fecha_firma_escritura: string | null
          fecha_firma_oferta_vinculante: string | null
          fecha_tentativa_entrega: string | null
          fecha_ultima_actividad: string | null
          fecha_ultima_modificacion: string | null
          fecha_ultima_visualizacion: string | null
          fecha_video_anexo1: string | null
          fecha_video_contrato_arrendamiento: string | null
          fecha_video_promesa_compraventa: string | null
          fee_cotizacion_legal: number | null
          fideicomiso_inmueble: string | null
          fiduciaria_inmueble: string | null
          firma_cliente_transferecia: string | null
          firma_duppla_transferencia: string | null
          firma_ep_fiduciaria_constructora: string | null
          firma_escritura: boolean | null
          firma_escritura_publica_cliente: string | null
          firma_escritura_publica_duppla: boolean | null
          firma_fiduciaria_duppla: boolean | null
          formularios_diligenciados: string | null
          hipoteca: boolean | null
          id_inmueble: string | null
          id_legal: string
          id_oportunidad: string | null
          minuta: boolean | null
          nit_fideicomiso_inmueble: string | null
          nombre_legal: string | null
          nombre_oportunidad: string | null
          nombre_vendedor: string | null
          notaria_numero: string | null
          numero_documento: string | null
          numero_documento_vendedor: string | null
          numero_escritura: string | null
          numero_escritura_publica_transfer: string | null
          numero_notaria_transferencia: string | null
          observaciones: string | null
          pago_100_aporte_cliente: string | null
          pago_comision_broker: number | null
          pago_derechos_notariales: boolean | null
          pago_duppla: string | null
          pago_impuesto_beneficiencia: boolean | null
          participacion_actual: number | null
          participacion_inicial: number | null
          patrimonio_familia: boolean | null
          poder_especial_amplio_suficiente: string | null
          porcentaje_comision_broker: number | null
          porcentaje_inicial_cliente: number | null
          portafolio_tentativo: string | null
          preliquidacion_gastos_notariales: boolean | null
          promesa_compraventa_cliente: boolean | null
          promesa_compraventa_vendedor: boolean | null
          propietario_legal: string | null
          propietario_oportunidad: string | null
          razon_desistimiento: string | null
          record_type: string | null
          reglamento_propiedad_horizontal: string | null
          sagrilaft_vendedor: string | null
          sarlaft: string | null
          telefono: string | null
          tenemos_certificacion_bancaria_vendedor: boolean | null
          tenemos_ctl: boolean | null
          tenemos_documento_identidad_cliente: boolean | null
          tenemos_documento_identidad_vendedor: boolean | null
          tenemos_escrituras_prediales: boolean | null
          tenemos_paz_y_salvo_admin: string | null
          tenemos_paz_y_salvo_prediales: boolean | null
          tenemos_paz_y_salvo_servicios: boolean | null
          tipo_documento: string | null
          tipo_identificacion_vendedor: string | null
          tipo_vivienda_usada: string | null
          usuario_ultima_modificacion: string | null
          valor_arras: string | null
          valor_canon: string | null
          valor_desembolso: number | null
          valor_desembolso_1: number | null
          valor_desembolso_2: number | null
          valor_desembolso_3: number | null
          valor_fee: number | null
          valor_gastos_notariales: number | null
          valor_hipoteca: number | null
          valor_preliquidacion_gastos_notariales: number | null
          valor_total_inmueble: number | null
          vendedor_corrio_sagrilaft: boolean | null
        }
        Insert: {
          account?: string | null
          acta_entrega?: boolean | null
          afectacion_vivienda_familiar?: boolean | null
          anexo1?: boolean | null
          boleta_registro?: boolean | null
          boleta_registro_escrituracion_cpv?: string | null
          broker?: string | null
          canon_actual?: string | null
          cantidad_pagos_desembolso?: string | null
          carpeta_drive_url?: string | null
          carta_de_cesion_firmada_aprobada?: string | null
          cesion_de_derechos?: string | null
          check_entrega_inmueble?: boolean | null
          check_estudio_titulos_completado?: boolean | null
          check_preparacion_contrados_completado?: boolean | null
          cliente_corrio_sagrilaft?: boolean | null
          comentarios_sagrilaft_cliente?: string | null
          contrato_arrendamiento?: boolean | null
          correo?: string | null
          cuota_inicial_pagada?: number | null
          datos_administracion?: boolean | null
          dias_abierta?: number | null
          diferencia_desembolso_total?: number | null
          documentos_completos_estudio_titulo?: boolean | null
          encargado_proceso_legal?: string | null
          entrega_explicacion_modelo_vendedor?: boolean | null
          envio_escritura_registro?: boolean | null
          escritura_antecedente?: string | null
          escritura_publica_final?: boolean | null
          escritura_publica_final_estado?: string | null
          escritura_publica_firmada_vendedor?: boolean | null
          escritura_publica_radicada?: boolean | null
          escritura_publica_transferencia_radicada?: string | null
          estado_contrato_arrendamiento?: string | null
          estado_inmueble?: string | null
          estado_minuta__c?: string | null
          estado_promesa_compraventa_cliente?: string | null
          estado_promesa_compraventa_vendedor?: string | null
          estudio_titulos?: boolean | null
          estudio_titulos_estado?: string | null
          etapa?: string | null
          fecha_cesion_del_activo?: string | null
          fecha_creacion?: string | null
          fecha_desembolso_1?: string | null
          fecha_desembolso_2?: string | null
          fecha_desembolso_3?: string | null
          fecha_desembolso_comercial?: string | null
          fecha_desembolso_confirmada?: string | null
          fecha_desembolso_legal?: string | null
          fecha_entrega_inmueble?: string | null
          fecha_firma_contrato_arrendamiento?: string | null
          fecha_firma_escritura?: string | null
          fecha_firma_oferta_vinculante?: string | null
          fecha_tentativa_entrega?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_ultima_visualizacion?: string | null
          fecha_video_anexo1?: string | null
          fecha_video_contrato_arrendamiento?: string | null
          fecha_video_promesa_compraventa?: string | null
          fee_cotizacion_legal?: number | null
          fideicomiso_inmueble?: string | null
          fiduciaria_inmueble?: string | null
          firma_cliente_transferecia?: string | null
          firma_duppla_transferencia?: string | null
          firma_ep_fiduciaria_constructora?: string | null
          firma_escritura?: boolean | null
          firma_escritura_publica_cliente?: string | null
          firma_escritura_publica_duppla?: boolean | null
          firma_fiduciaria_duppla?: boolean | null
          formularios_diligenciados?: string | null
          hipoteca?: boolean | null
          id_inmueble?: string | null
          id_legal: string
          id_oportunidad?: string | null
          minuta?: boolean | null
          nit_fideicomiso_inmueble?: string | null
          nombre_legal?: string | null
          nombre_oportunidad?: string | null
          nombre_vendedor?: string | null
          notaria_numero?: string | null
          numero_documento?: string | null
          numero_documento_vendedor?: string | null
          numero_escritura?: string | null
          numero_escritura_publica_transfer?: string | null
          numero_notaria_transferencia?: string | null
          observaciones?: string | null
          pago_100_aporte_cliente?: string | null
          pago_comision_broker?: number | null
          pago_derechos_notariales?: boolean | null
          pago_duppla?: string | null
          pago_impuesto_beneficiencia?: boolean | null
          participacion_actual?: number | null
          participacion_inicial?: number | null
          patrimonio_familia?: boolean | null
          poder_especial_amplio_suficiente?: string | null
          porcentaje_comision_broker?: number | null
          porcentaje_inicial_cliente?: number | null
          portafolio_tentativo?: string | null
          preliquidacion_gastos_notariales?: boolean | null
          promesa_compraventa_cliente?: boolean | null
          promesa_compraventa_vendedor?: boolean | null
          propietario_legal?: string | null
          propietario_oportunidad?: string | null
          razon_desistimiento?: string | null
          record_type?: string | null
          reglamento_propiedad_horizontal?: string | null
          sagrilaft_vendedor?: string | null
          sarlaft?: string | null
          telefono?: string | null
          tenemos_certificacion_bancaria_vendedor?: boolean | null
          tenemos_ctl?: boolean | null
          tenemos_documento_identidad_cliente?: boolean | null
          tenemos_documento_identidad_vendedor?: boolean | null
          tenemos_escrituras_prediales?: boolean | null
          tenemos_paz_y_salvo_admin?: string | null
          tenemos_paz_y_salvo_prediales?: boolean | null
          tenemos_paz_y_salvo_servicios?: boolean | null
          tipo_documento?: string | null
          tipo_identificacion_vendedor?: string | null
          tipo_vivienda_usada?: string | null
          usuario_ultima_modificacion?: string | null
          valor_arras?: string | null
          valor_canon?: string | null
          valor_desembolso?: number | null
          valor_desembolso_1?: number | null
          valor_desembolso_2?: number | null
          valor_desembolso_3?: number | null
          valor_fee?: number | null
          valor_gastos_notariales?: number | null
          valor_hipoteca?: number | null
          valor_preliquidacion_gastos_notariales?: number | null
          valor_total_inmueble?: number | null
          vendedor_corrio_sagrilaft?: boolean | null
        }
        Update: {
          account?: string | null
          acta_entrega?: boolean | null
          afectacion_vivienda_familiar?: boolean | null
          anexo1?: boolean | null
          boleta_registro?: boolean | null
          boleta_registro_escrituracion_cpv?: string | null
          broker?: string | null
          canon_actual?: string | null
          cantidad_pagos_desembolso?: string | null
          carpeta_drive_url?: string | null
          carta_de_cesion_firmada_aprobada?: string | null
          cesion_de_derechos?: string | null
          check_entrega_inmueble?: boolean | null
          check_estudio_titulos_completado?: boolean | null
          check_preparacion_contrados_completado?: boolean | null
          cliente_corrio_sagrilaft?: boolean | null
          comentarios_sagrilaft_cliente?: string | null
          contrato_arrendamiento?: boolean | null
          correo?: string | null
          cuota_inicial_pagada?: number | null
          datos_administracion?: boolean | null
          dias_abierta?: number | null
          diferencia_desembolso_total?: number | null
          documentos_completos_estudio_titulo?: boolean | null
          encargado_proceso_legal?: string | null
          entrega_explicacion_modelo_vendedor?: boolean | null
          envio_escritura_registro?: boolean | null
          escritura_antecedente?: string | null
          escritura_publica_final?: boolean | null
          escritura_publica_final_estado?: string | null
          escritura_publica_firmada_vendedor?: boolean | null
          escritura_publica_radicada?: boolean | null
          escritura_publica_transferencia_radicada?: string | null
          estado_contrato_arrendamiento?: string | null
          estado_inmueble?: string | null
          estado_minuta__c?: string | null
          estado_promesa_compraventa_cliente?: string | null
          estado_promesa_compraventa_vendedor?: string | null
          estudio_titulos?: boolean | null
          estudio_titulos_estado?: string | null
          etapa?: string | null
          fecha_cesion_del_activo?: string | null
          fecha_creacion?: string | null
          fecha_desembolso_1?: string | null
          fecha_desembolso_2?: string | null
          fecha_desembolso_3?: string | null
          fecha_desembolso_comercial?: string | null
          fecha_desembolso_confirmada?: string | null
          fecha_desembolso_legal?: string | null
          fecha_entrega_inmueble?: string | null
          fecha_firma_contrato_arrendamiento?: string | null
          fecha_firma_escritura?: string | null
          fecha_firma_oferta_vinculante?: string | null
          fecha_tentativa_entrega?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_ultima_visualizacion?: string | null
          fecha_video_anexo1?: string | null
          fecha_video_contrato_arrendamiento?: string | null
          fecha_video_promesa_compraventa?: string | null
          fee_cotizacion_legal?: number | null
          fideicomiso_inmueble?: string | null
          fiduciaria_inmueble?: string | null
          firma_cliente_transferecia?: string | null
          firma_duppla_transferencia?: string | null
          firma_ep_fiduciaria_constructora?: string | null
          firma_escritura?: boolean | null
          firma_escritura_publica_cliente?: string | null
          firma_escritura_publica_duppla?: boolean | null
          firma_fiduciaria_duppla?: boolean | null
          formularios_diligenciados?: string | null
          hipoteca?: boolean | null
          id_inmueble?: string | null
          id_legal?: string
          id_oportunidad?: string | null
          minuta?: boolean | null
          nit_fideicomiso_inmueble?: string | null
          nombre_legal?: string | null
          nombre_oportunidad?: string | null
          nombre_vendedor?: string | null
          notaria_numero?: string | null
          numero_documento?: string | null
          numero_documento_vendedor?: string | null
          numero_escritura?: string | null
          numero_escritura_publica_transfer?: string | null
          numero_notaria_transferencia?: string | null
          observaciones?: string | null
          pago_100_aporte_cliente?: string | null
          pago_comision_broker?: number | null
          pago_derechos_notariales?: boolean | null
          pago_duppla?: string | null
          pago_impuesto_beneficiencia?: boolean | null
          participacion_actual?: number | null
          participacion_inicial?: number | null
          patrimonio_familia?: boolean | null
          poder_especial_amplio_suficiente?: string | null
          porcentaje_comision_broker?: number | null
          porcentaje_inicial_cliente?: number | null
          portafolio_tentativo?: string | null
          preliquidacion_gastos_notariales?: boolean | null
          promesa_compraventa_cliente?: boolean | null
          promesa_compraventa_vendedor?: boolean | null
          propietario_legal?: string | null
          propietario_oportunidad?: string | null
          razon_desistimiento?: string | null
          record_type?: string | null
          reglamento_propiedad_horizontal?: string | null
          sagrilaft_vendedor?: string | null
          sarlaft?: string | null
          telefono?: string | null
          tenemos_certificacion_bancaria_vendedor?: boolean | null
          tenemos_ctl?: boolean | null
          tenemos_documento_identidad_cliente?: boolean | null
          tenemos_documento_identidad_vendedor?: boolean | null
          tenemos_escrituras_prediales?: boolean | null
          tenemos_paz_y_salvo_admin?: string | null
          tenemos_paz_y_salvo_prediales?: boolean | null
          tenemos_paz_y_salvo_servicios?: boolean | null
          tipo_documento?: string | null
          tipo_identificacion_vendedor?: string | null
          tipo_vivienda_usada?: string | null
          usuario_ultima_modificacion?: string | null
          valor_arras?: string | null
          valor_canon?: string | null
          valor_desembolso?: number | null
          valor_desembolso_1?: number | null
          valor_desembolso_2?: number | null
          valor_desembolso_3?: number | null
          valor_fee?: number | null
          valor_gastos_notariales?: number | null
          valor_hipoteca?: number | null
          valor_preliquidacion_gastos_notariales?: number | null
          valor_total_inmueble?: number | null
          vendedor_corrio_sagrilaft?: boolean | null
        }
        Relationships: []
      }
      liquidacion_detalles: {
        Row: {
          canal_type: Database["public"]["Enums"]["canal_type"]
          comision_calculada: number
          comision_pct: number
          created_at: string | null
          fecha_cierre: string
          id: string
          liquidacion_id: string
          monto_verificado: number
          notas: string | null
          oportunidad_id: string
          portafolio: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          canal_type: Database["public"]["Enums"]["canal_type"]
          comision_calculada: number
          comision_pct: number
          created_at?: string | null
          fecha_cierre: string
          id?: string
          liquidacion_id: string
          monto_verificado: number
          notas?: string | null
          oportunidad_id: string
          portafolio?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          canal_type?: Database["public"]["Enums"]["canal_type"]
          comision_calculada?: number
          comision_pct?: number
          created_at?: string | null
          fecha_cierre?: string
          id?: string
          liquidacion_id?: string
          monto_verificado?: number
          notas?: string | null
          oportunidad_id?: string
          portafolio?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "liquidacion_detalles_liquidacion_id_fkey"
            columns: ["liquidacion_id"]
            isOneToOne: false
            referencedRelation: "liquidaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      liquidaciones: {
        Row: {
          aprobado_por: string | null
          canal_venta: string
          comprobante_url: string | null
          created_at: string | null
          fecha_aprobacion: string | null
          fecha_calculo: string | null
          fecha_pago: string | null
          id: string
          motivo_rechazo: string | null
          notas: string | null
          periodo_anio: number
          periodo_mes: number
          responsable_comercial: string
          status: Database["public"]["Enums"]["liquidation_status"] | null
          total_comision: number
          total_monto_cerrado: number
          updated_at: string | null
        }
        Insert: {
          aprobado_por?: string | null
          canal_venta: string
          comprobante_url?: string | null
          created_at?: string | null
          fecha_aprobacion?: string | null
          fecha_calculo?: string | null
          fecha_pago?: string | null
          id?: string
          motivo_rechazo?: string | null
          notas?: string | null
          periodo_anio: number
          periodo_mes: number
          responsable_comercial: string
          status?: Database["public"]["Enums"]["liquidation_status"] | null
          total_comision: number
          total_monto_cerrado: number
          updated_at?: string | null
        }
        Update: {
          aprobado_por?: string | null
          canal_venta?: string
          comprobante_url?: string | null
          created_at?: string | null
          fecha_aprobacion?: string | null
          fecha_calculo?: string | null
          fecha_pago?: string | null
          id?: string
          motivo_rechazo?: string | null
          notas?: string | null
          periodo_anio?: number
          periodo_mes?: number
          responsable_comercial?: string
          status?: Database["public"]["Enums"]["liquidation_status"] | null
          total_comision?: number
          total_monto_cerrado?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      mensajes: {
        Row: {
          conversation_id: string | null
          id: string
          message: string | null
          message_norm: string | null
          message_type: string | null
          raw_data: Json | null
          sender: string | null
          timestamp: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          message?: string | null
          message_norm?: string | null
          message_type?: string | null
          raw_data?: Json | null
          sender?: string | null
          timestamp?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          message?: string | null
          message_norm?: string | null
          message_type?: string | null
          raw_data?: Json | null
          sender?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensajes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      micromanager_resultados: {
        Row: {
          actividades_hoy: string | null
          aprobacion_cliente_cantidad: number | null
          aprobacion_cliente_pct: number | null
          aprobacion_cliente_prom_dias: number | null
          asignacion_inmueble_cantidad: number | null
          asignacion_inmueble_pct: number | null
          asignacion_inmueble_prom_dias: number | null
          avance_ops_dia: string | null
          comercial: string | null
          created_at: string | null
          entrevista_cantidad: number | null
          entrevista_pct: number | null
          entrevista_prom_dias: number | null
          evaluacion_riesgo_cantidad: number | null
          evaluacion_riesgo_pct: number | null
          evaluacion_riesgo_prom_dias: number | null
          fecha: string
          funnel_total: number | null
          id: number
          oferta_vinculante_cantidad: number | null
          oferta_vinculante_pct: number | null
          oferta_vinculante_prom_dias: number | null
          presentacion_modelo_cantidad: number | null
          presentacion_modelo_pct: number | null
          presentacion_modelo_prom_dias: number | null
          proceso_documental_cantidad: number | null
          proceso_documental_pct: number | null
          proceso_documental_prom_dias: number | null
          resultado: string | null
        }
        Insert: {
          actividades_hoy?: string | null
          aprobacion_cliente_cantidad?: number | null
          aprobacion_cliente_pct?: number | null
          aprobacion_cliente_prom_dias?: number | null
          asignacion_inmueble_cantidad?: number | null
          asignacion_inmueble_pct?: number | null
          asignacion_inmueble_prom_dias?: number | null
          avance_ops_dia?: string | null
          comercial?: string | null
          created_at?: string | null
          entrevista_cantidad?: number | null
          entrevista_pct?: number | null
          entrevista_prom_dias?: number | null
          evaluacion_riesgo_cantidad?: number | null
          evaluacion_riesgo_pct?: number | null
          evaluacion_riesgo_prom_dias?: number | null
          fecha: string
          funnel_total?: number | null
          id?: number
          oferta_vinculante_cantidad?: number | null
          oferta_vinculante_pct?: number | null
          oferta_vinculante_prom_dias?: number | null
          presentacion_modelo_cantidad?: number | null
          presentacion_modelo_pct?: number | null
          presentacion_modelo_prom_dias?: number | null
          proceso_documental_cantidad?: number | null
          proceso_documental_pct?: number | null
          proceso_documental_prom_dias?: number | null
          resultado?: string | null
        }
        Update: {
          actividades_hoy?: string | null
          aprobacion_cliente_cantidad?: number | null
          aprobacion_cliente_pct?: number | null
          aprobacion_cliente_prom_dias?: number | null
          asignacion_inmueble_cantidad?: number | null
          asignacion_inmueble_pct?: number | null
          asignacion_inmueble_prom_dias?: number | null
          avance_ops_dia?: string | null
          comercial?: string | null
          created_at?: string | null
          entrevista_cantidad?: number | null
          entrevista_pct?: number | null
          entrevista_prom_dias?: number | null
          evaluacion_riesgo_cantidad?: number | null
          evaluacion_riesgo_pct?: number | null
          evaluacion_riesgo_prom_dias?: number | null
          fecha?: string
          funnel_total?: number | null
          id?: number
          oferta_vinculante_cantidad?: number | null
          oferta_vinculante_pct?: number | null
          oferta_vinculante_prom_dias?: number | null
          presentacion_modelo_cantidad?: number | null
          presentacion_modelo_pct?: number | null
          presentacion_modelo_prom_dias?: number | null
          proceso_documental_cantidad?: number | null
          proceso_documental_pct?: number | null
          proceso_documental_prom_dias?: number | null
          resultado?: string | null
        }
        Relationships: []
      }
      micromanager_snapshots: {
        Row: {
          actividades: number
          avances_detalle: string | null
          comercial: string
          created_at: string | null
          etapas: Json | null
          fecha: string
          id: number
          ops_avanzaron: number
          ops_nuevas: number
          pct_avance: number
          resultado_dia: string | null
          score: number
          total_ops: number
          valor_funnel: number
        }
        Insert: {
          actividades?: number
          avances_detalle?: string | null
          comercial: string
          created_at?: string | null
          etapas?: Json | null
          fecha: string
          id?: never
          ops_avanzaron?: number
          ops_nuevas?: number
          pct_avance?: number
          resultado_dia?: string | null
          score: number
          total_ops?: number
          valor_funnel?: number
        }
        Update: {
          actividades?: number
          avances_detalle?: string | null
          comercial?: string
          created_at?: string | null
          etapas?: Json | null
          fecha?: string
          id?: never
          ops_avanzaron?: number
          ops_nuevas?: number
          pct_avance?: number
          resultado_dia?: string | null
          score?: number
          total_ops?: number
          valor_funnel?: number
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          milestone_date: string
          milestone_type: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          milestone_date: string
          milestone_type?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          milestone_date?: string
          milestone_type?: string
          title?: string
        }
        Relationships: []
      }
      moved_messages_log_inbox_merge: {
        Row: {
          created_at: string
          mensaje_id: string
          new_conversation_id: string
          old_conversation_id: string
        }
        Insert: {
          created_at?: string
          mensaje_id: string
          new_conversation_id: string
          old_conversation_id: string
        }
        Update: {
          created_at?: string
          mensaje_id?: string
          new_conversation_id?: string
          old_conversation_id?: string
        }
        Relationships: []
      }
      notas_predial: {
        Row: {
          created_at: string
          id: string
          nota: string
          salesforce_id: string
          tipo_predio: string
        }
        Insert: {
          created_at?: string
          id?: string
          nota: string
          salesforce_id: string
          tipo_predio?: string
        }
        Update: {
          created_at?: string
          id?: string
          nota?: string
          salesforce_id?: string
          tipo_predio?: string
        }
        Relationships: []
      }
      oportunidades_offload: {
        Row: {
          aceptacion_propuesta: boolean | null
          asistencia_reunion_presentacion: boolean | null
          canal_venta: string | null
          canal_venta_secundario: string | null
          certificado_derechos_fiduciarios_enviado: boolean | null
          check_campos_contratos_completos: boolean | null
          check_certificacion_bancaria: boolean | null
          check_declaracion_de_renta: boolean | null
          check_documento_identidad: boolean | null
          check_documentos_completos: boolean | null
          check_instrucciones_de_pago: boolean | null
          check_pago_recibido: boolean | null
          check_rut_camara_de_comercio: boolean | null
          check_validacion_pago_en_bancos: boolean | null
          contrato_enviado: boolean | null
          contrato_firmado: boolean | null
          correo_inversionista: string | null
          detonante_inversion: string | null
          duracion_en_dias: number | null
          envio_email_presentacion: boolean | null
          envio_propuesta: boolean | null
          etapa: string | null
          fecha_cambio_ultima_etapa: string | null
          fecha_cierre_oportunidad: string | null
          fecha_creacion: string | null
          fecha_hora_follow_up: string | null
          fecha_llamada_tldv: string | null
          fecha_tentativa_inversion: string | null
          fecha_ultima_actividad: string | null
          fecha_ultima_modificacion: string | null
          fecha_validacion_bancaria: string | null
          id_broker: string | null
          id_cuenta_inversionista: string | null
          id_inversion: string | null
          id_inversionista: string | null
          id_oportunidad: string
          id_transaccion_externa: string | null
          inversion_esperada: number | null
          modelo_canal: string | null
          monto_pagado_a_la_fecha: number | null
          monto_verificado_en_bancos: number | null
          nombre_oportunidad: string | null
          numero_actividades_registradas: number | null
          observaciones: string | null
          owner_oportunidad: string | null
          perfilador: string | null
          porcentaje_adquisicion_portafolio: number | null
          portafolio_de_interes: string | null
          probabilidad_de_cierre: number | null
          razon_de_perdida: string | null
          razon_resultado_kyc: string | null
          responsable_comercial_negocio: string | null
          resultado_kyc: string | null
          saldo_pendiente: number | null
          score_lead: number | null
          tipo_canal: string | null
          usuario_creador: string | null
          usuario_ultima_modificacion: string | null
          validacion_documentos: string | null
          valor_base_portafolio: number | null
        }
        Insert: {
          aceptacion_propuesta?: boolean | null
          asistencia_reunion_presentacion?: boolean | null
          canal_venta?: string | null
          canal_venta_secundario?: string | null
          certificado_derechos_fiduciarios_enviado?: boolean | null
          check_campos_contratos_completos?: boolean | null
          check_certificacion_bancaria?: boolean | null
          check_declaracion_de_renta?: boolean | null
          check_documento_identidad?: boolean | null
          check_documentos_completos?: boolean | null
          check_instrucciones_de_pago?: boolean | null
          check_pago_recibido?: boolean | null
          check_rut_camara_de_comercio?: boolean | null
          check_validacion_pago_en_bancos?: boolean | null
          contrato_enviado?: boolean | null
          contrato_firmado?: boolean | null
          correo_inversionista?: string | null
          detonante_inversion?: string | null
          duracion_en_dias?: number | null
          envio_email_presentacion?: boolean | null
          envio_propuesta?: boolean | null
          etapa?: string | null
          fecha_cambio_ultima_etapa?: string | null
          fecha_cierre_oportunidad?: string | null
          fecha_creacion?: string | null
          fecha_hora_follow_up?: string | null
          fecha_llamada_tldv?: string | null
          fecha_tentativa_inversion?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_validacion_bancaria?: string | null
          id_broker?: string | null
          id_cuenta_inversionista?: string | null
          id_inversion?: string | null
          id_inversionista?: string | null
          id_oportunidad: string
          id_transaccion_externa?: string | null
          inversion_esperada?: number | null
          modelo_canal?: string | null
          monto_pagado_a_la_fecha?: number | null
          monto_verificado_en_bancos?: number | null
          nombre_oportunidad?: string | null
          numero_actividades_registradas?: number | null
          observaciones?: string | null
          owner_oportunidad?: string | null
          perfilador?: string | null
          porcentaje_adquisicion_portafolio?: number | null
          portafolio_de_interes?: string | null
          probabilidad_de_cierre?: number | null
          razon_de_perdida?: string | null
          razon_resultado_kyc?: string | null
          responsable_comercial_negocio?: string | null
          resultado_kyc?: string | null
          saldo_pendiente?: number | null
          score_lead?: number | null
          tipo_canal?: string | null
          usuario_creador?: string | null
          usuario_ultima_modificacion?: string | null
          validacion_documentos?: string | null
          valor_base_portafolio?: number | null
        }
        Update: {
          aceptacion_propuesta?: boolean | null
          asistencia_reunion_presentacion?: boolean | null
          canal_venta?: string | null
          canal_venta_secundario?: string | null
          certificado_derechos_fiduciarios_enviado?: boolean | null
          check_campos_contratos_completos?: boolean | null
          check_certificacion_bancaria?: boolean | null
          check_declaracion_de_renta?: boolean | null
          check_documento_identidad?: boolean | null
          check_documentos_completos?: boolean | null
          check_instrucciones_de_pago?: boolean | null
          check_pago_recibido?: boolean | null
          check_rut_camara_de_comercio?: boolean | null
          check_validacion_pago_en_bancos?: boolean | null
          contrato_enviado?: boolean | null
          contrato_firmado?: boolean | null
          correo_inversionista?: string | null
          detonante_inversion?: string | null
          duracion_en_dias?: number | null
          envio_email_presentacion?: boolean | null
          envio_propuesta?: boolean | null
          etapa?: string | null
          fecha_cambio_ultima_etapa?: string | null
          fecha_cierre_oportunidad?: string | null
          fecha_creacion?: string | null
          fecha_hora_follow_up?: string | null
          fecha_llamada_tldv?: string | null
          fecha_tentativa_inversion?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_validacion_bancaria?: string | null
          id_broker?: string | null
          id_cuenta_inversionista?: string | null
          id_inversion?: string | null
          id_inversionista?: string | null
          id_oportunidad?: string
          id_transaccion_externa?: string | null
          inversion_esperada?: number | null
          modelo_canal?: string | null
          monto_pagado_a_la_fecha?: number | null
          monto_verificado_en_bancos?: number | null
          nombre_oportunidad?: string | null
          numero_actividades_registradas?: number | null
          observaciones?: string | null
          owner_oportunidad?: string | null
          perfilador?: string | null
          porcentaje_adquisicion_portafolio?: number | null
          portafolio_de_interes?: string | null
          probabilidad_de_cierre?: number | null
          razon_de_perdida?: string | null
          razon_resultado_kyc?: string | null
          responsable_comercial_negocio?: string | null
          resultado_kyc?: string | null
          saldo_pendiente?: number | null
          score_lead?: number | null
          tipo_canal?: string | null
          usuario_creador?: string | null
          usuario_ultima_modificacion?: string | null
          validacion_documentos?: string | null
          valor_base_portafolio?: number | null
        }
        Relationships: []
      }
      oportunidades_preventa_offload: {
        Row: {
          aceptacion_propuesta: boolean | null
          asistencia_reunion_presentacion: boolean | null
          carta_intencion_enviada: boolean | null
          carta_intentcion_firmada: boolean | null
          check_campos_contratos_completos: boolean | null
          check_certificacion_bancaria: boolean | null
          check_declaracion_de_renta: boolean | null
          check_documento_identidad: boolean | null
          check_documentos_completos: boolean | null
          check_pago_recibido: boolean | null
          check_rut_camara_de_comercio: boolean | null
          check_validacion_pago_en_bancos: boolean | null
          clawbcak_aplicable: boolean | null
          codigo_fic: string | null
          cuenta_inversionista: string | null
          envio_email_presentacion: boolean | null
          envio_propuesta: boolean | null
          etapa_oportunidad: string | null
          fecha_cambio_ultima_etapa: string | null
          fecha_cierre_oportunidad: string | null
          fecha_fin_bridge_estimada: string | null
          fecha_fin_bridge_real: string | null
          fecha_firma_carta_intencion: string | null
          fecha_hora_follow_up: string | null
          fecha_inicio_fic: string | null
          fecha_llamada_tldv: string | null
          fecha_ultima_actividad: string | null
          fecha_ultima_modificacion: string | null
          fecha_validacion_bancaria: string | null
          id_broker: string | null
          id_inversion: string | null
          id_inversionista: string | null
          id_oportunidad: string
          modelo_canal: string | null
          monto_pagado_a_la_fecha: number | null
          monto_verificado_en_bancos: number | null
          motivo_clawback: string | null
          nombre_broker: string | null
          nombre_campana: string | null
          nombre_oportunidad: string | null
          numero_actividades_registradas: number | null
          observaciones: string | null
          portafolio_de_interes: string | null
          probabilidad_de_cierre: number | null
          proximo_reporte_bridge: string | null
          razon_perdida: string | null
          razon_resultado_kyc: string | null
          rentabilidad_bridge_acumulada: number | null
          rentabilidad_fic: number | null
          responsable_comercial_negocio: string | null
          resultado_kyc: string | null
          saldo_pendiente: number | null
          subsidio_duppla_pagado: number | null
          subsidio_duppla_requerido: number | null
          tipo_canal: string | null
          usuario_ultima_modificacion: string | null
          validacion_documentos: string | null
          valor_preventa: number | null
        }
        Insert: {
          aceptacion_propuesta?: boolean | null
          asistencia_reunion_presentacion?: boolean | null
          carta_intencion_enviada?: boolean | null
          carta_intentcion_firmada?: boolean | null
          check_campos_contratos_completos?: boolean | null
          check_certificacion_bancaria?: boolean | null
          check_declaracion_de_renta?: boolean | null
          check_documento_identidad?: boolean | null
          check_documentos_completos?: boolean | null
          check_pago_recibido?: boolean | null
          check_rut_camara_de_comercio?: boolean | null
          check_validacion_pago_en_bancos?: boolean | null
          clawbcak_aplicable?: boolean | null
          codigo_fic?: string | null
          cuenta_inversionista?: string | null
          envio_email_presentacion?: boolean | null
          envio_propuesta?: boolean | null
          etapa_oportunidad?: string | null
          fecha_cambio_ultima_etapa?: string | null
          fecha_cierre_oportunidad?: string | null
          fecha_fin_bridge_estimada?: string | null
          fecha_fin_bridge_real?: string | null
          fecha_firma_carta_intencion?: string | null
          fecha_hora_follow_up?: string | null
          fecha_inicio_fic?: string | null
          fecha_llamada_tldv?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_validacion_bancaria?: string | null
          id_broker?: string | null
          id_inversion?: string | null
          id_inversionista?: string | null
          id_oportunidad: string
          modelo_canal?: string | null
          monto_pagado_a_la_fecha?: number | null
          monto_verificado_en_bancos?: number | null
          motivo_clawback?: string | null
          nombre_broker?: string | null
          nombre_campana?: string | null
          nombre_oportunidad?: string | null
          numero_actividades_registradas?: number | null
          observaciones?: string | null
          portafolio_de_interes?: string | null
          probabilidad_de_cierre?: number | null
          proximo_reporte_bridge?: string | null
          razon_perdida?: string | null
          razon_resultado_kyc?: string | null
          rentabilidad_bridge_acumulada?: number | null
          rentabilidad_fic?: number | null
          responsable_comercial_negocio?: string | null
          resultado_kyc?: string | null
          saldo_pendiente?: number | null
          subsidio_duppla_pagado?: number | null
          subsidio_duppla_requerido?: number | null
          tipo_canal?: string | null
          usuario_ultima_modificacion?: string | null
          validacion_documentos?: string | null
          valor_preventa?: number | null
        }
        Update: {
          aceptacion_propuesta?: boolean | null
          asistencia_reunion_presentacion?: boolean | null
          carta_intencion_enviada?: boolean | null
          carta_intentcion_firmada?: boolean | null
          check_campos_contratos_completos?: boolean | null
          check_certificacion_bancaria?: boolean | null
          check_declaracion_de_renta?: boolean | null
          check_documento_identidad?: boolean | null
          check_documentos_completos?: boolean | null
          check_pago_recibido?: boolean | null
          check_rut_camara_de_comercio?: boolean | null
          check_validacion_pago_en_bancos?: boolean | null
          clawbcak_aplicable?: boolean | null
          codigo_fic?: string | null
          cuenta_inversionista?: string | null
          envio_email_presentacion?: boolean | null
          envio_propuesta?: boolean | null
          etapa_oportunidad?: string | null
          fecha_cambio_ultima_etapa?: string | null
          fecha_cierre_oportunidad?: string | null
          fecha_fin_bridge_estimada?: string | null
          fecha_fin_bridge_real?: string | null
          fecha_firma_carta_intencion?: string | null
          fecha_hora_follow_up?: string | null
          fecha_inicio_fic?: string | null
          fecha_llamada_tldv?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_validacion_bancaria?: string | null
          id_broker?: string | null
          id_inversion?: string | null
          id_inversionista?: string | null
          id_oportunidad?: string
          modelo_canal?: string | null
          monto_pagado_a_la_fecha?: number | null
          monto_verificado_en_bancos?: number | null
          motivo_clawback?: string | null
          nombre_broker?: string | null
          nombre_campana?: string | null
          nombre_oportunidad?: string | null
          numero_actividades_registradas?: number | null
          observaciones?: string | null
          portafolio_de_interes?: string | null
          probabilidad_de_cierre?: number | null
          proximo_reporte_bridge?: string | null
          razon_perdida?: string | null
          razon_resultado_kyc?: string | null
          rentabilidad_bridge_acumulada?: number | null
          rentabilidad_fic?: number | null
          responsable_comercial_negocio?: string | null
          resultado_kyc?: string | null
          saldo_pendiente?: number | null
          subsidio_duppla_pagado?: number | null
          subsidio_duppla_requerido?: number | null
          tipo_canal?: string | null
          usuario_ultima_modificacion?: string | null
          validacion_documentos?: string | null
          valor_preventa?: number | null
        }
        Relationships: []
      }
      oportunidades_rent_to_own: {
        Row: {
          aceptacion_propuesta: boolean | null
          analisis_roi_completed: boolean | null
          area_inmueble_deseado: string | null
          asistio_reunion: boolean | null
          barrio_deseado: string | null
          broker: string | null
          busqueda_inmueble: boolean | null
          canon_gastos: number | null
          cantidad_inmuebles_enviados: number | null
          capacidad_endeudamiento_mensual: number | null
          carta_intencion_vendedor: string | null
          check_certificado_laboral: boolean | null
          check_certificado_laboral_cotitular: boolean | null
          check_contrato_de_arriendo: boolean | null
          check_declaracion_de_renta: boolean | null
          check_declaracion_renta_cotitular: boolean | null
          check_desprendibles_nomina_cotitular: boolean | null
          check_documento_identidad: boolean | null
          check_documento_identidad_cotitular: boolean | null
          check_estados_financieros: boolean | null
          check_estados_financieros_cotitular: boolean | null
          check_extractos_bancarios_cotitular: boolean | null
          check_resolucion_pension: boolean | null
          check_resolucion_pension_cotitular: boolean | null
          check_rut_camara_de_comercio: boolean | null
          check_rut_cc_cotitular: boolean | null
          check_tarjeta_profesional: boolean | null
          check_tarjeta_profesional_cotitular: boolean | null
          check_terminos_condiciones: boolean | null
          check_ultimos_desprendibles_nomina: boolean | null
          check_ultimos_extractos_bancarios: boolean | null
          check_ultimos_pagos_pension: boolean | null
          check_ultimos_pagos_pension_cotitular: boolean | null
          check_video_anexo_1: boolean | null
          check_video_contrato_arrendamiento: boolean | null
          check_video_promesa: boolean | null
          ciudad: string | null
          codigo_inmueble: string | null
          compraventa_cliente_documento: string | null
          compraventa_vendedor_documento: string | null
          confirmo_cita: boolean | null
          copropietario_2: string | null
          copropietario_3: string | null
          copropietario_principal: string | null
          correo_cliente: string | null
          correo_vendedor: string | null
          cuenta_cliente: string | null
          cuota_mensual_minima: number | null
          debito_automatico: boolean | null
          dias_abierta: number | null
          edad_cliente: number | null
          envio_documento_propuesta: string | null
          envio_propuesta: boolean | null
          estado_aprobacion: string | null
          estado_certificacion_laboral_cotitular: string | null
          estado_compromiso: string | null
          estado_declaracion_renta_cotitular: string | null
          estado_desprendibble_nomina_cotitular: string | null
          estado_documento_identidad_cotitular: string | null
          estado_est_financieros_cotitular: string | null
          estado_extractos_bancarios_cotitular: string | null
          estado_oferta: boolean | null
          estado_resolucion_cotitular_pension: string | null
          estado_tarjeta_profesional_cotitular: string | null
          estado_ultimos_pagos_pension_cotitular: string | null
          estudio_crediticio: string | null
          estudio_titulos: string | null
          etapa_comercial: string | null
          etapa_inicio_busqueda_inmueble: string | null
          evaluacion_psicometrica: boolean | null
          fecha_apertura_video_compraventa: string | null
          fecha_apertura_video_contrato_arrendamiento: string | null
          fecha_cierre_oportunidad: string | null
          fecha_creacion_oportunidad: string | null
          fecha_firma_oferta_vinculante: string | null
          fecha_hora_entrevista: string | null
          fecha_inicio_busqueda_inmueble: string | null
          fecha_llamada_propuesta: string | null
          fecha_reagendamiento_tldv: string | null
          fecha_tentativa_desembolso: string | null
          fecha_tentativa_entrega: string | null
          fecha_ultima_actividad: string | null
          fecha_ultima_modificacion: string | null
          fecha_ultimo_cambio_stage: string | null
          fecha_video_anexo_1: string | null
          fee_cotizacion: number | null
          firma_documento_legal: boolean | null
          gastos: number | null
          gastos_inmueble_estimados: number | null
          gastos_reembolsables: number | null
          hijos_menores_edad: string | null
          id_aliado: string | null
          id_evaluacion: string | null
          id_oportunidad: string
          ingreso_alternativo: number | null
          ingreso_neto: number | null
          ingresos_confirmados: number | null
          ingresos_copropietario: number | null
          ingresos_principales: number | null
          inmueble: string | null
          inmueble_hipoteca_patrimonio: string | null
          link_cotizacion: string | null
          link_entrevista: string | null
          link_psicometrico: string | null
          localidad_confirmada: string | null
          loss_reason_client_facing: string | null
          loss_reason_oportunidad: string | null
          monto_escrituracion_esperado: number | null
          nombre_campana: string | null
          nombre_oportunidad: string | null
          nombre_vendedor_inmueble: string | null
          numero_de_encargo_fiduciario: string | null
          numero_documento: string | null
          numero_habitaciones_deseado: number | null
          o: Json | null
          observaciones: string | null
          oferta_enviada_vendedor: boolean | null
          oferta_url: string | null
          oferta_vinculante: boolean | null
          oferta_vinculante_documento: string | null
          oportunidad_con_compromiso: boolean | null
          opp_viva: string | null
          pago_comision_broker_formula: number | null
          piso_o_techo: string | null
          porcentaje_comision_broker: number | null
          porcentaje_cuota_inicial: number | null
          porcentaje_descuento: number | null
          precio_cliente: number | null
          presupuesto_inmueble_confirmado: number | null
          presupuesto_inmueble_deseado: number | null
          prioridad_oportunidad: string | null
          probabilidad_cierre: number | null
          proceso_con_inmueble: string | null
          propietario_oportunidad: string | null
          rango_desembolso: string | null
          reagendo_llamada_tldv: boolean | null
          recepcion_documentos_capacidad_pago: boolean | null
          recoleccion_documentos: boolean | null
          referencia_personal_1: string | null
          referencia_personal_2: string | null
          referencias_personales_validadas: boolean | null
          responsable_entrevista: string | null
          sarlaft: string | null
          score_oportunidad: string | null
          semaforo_aprobacion: string | null
          siguiente_paso: string | null
          telefono: string | null
          tipo_cliente: string | null
          tipo_documento: string | null
          tipo_ingreso_copropietario: string | null
          tipo_inmueble: string | null
          tipo_negocio: string | null
          tipo_negocio_hipotecario: string | null
          url_carpeta_drive: string | null
          usuario_ultima_modificacion: string | null
          validacion_documentos: string | null
          valor_ahorrado: number | null
          valor_anticipo: number | null
          valor_anticipo_cuota_inicial_duppla: number | null
          valor_anticipo_cuota_inicial_vendedor: number | null
          valor_apartamento: number | null
          valor_comision_broker: number | null
          valor_cuota_inicial: number | null
          valor_desembolso: number | null
          valor_desembolso_oportunidad: number | null
          valor_deuda_mensual: number | null
          valor_deuda_total: number | null
          valor_estructuracion_fijo: number | null
          valor_faltante_cuota_inicial: number | null
          valor_inmueble: number | null
          valor_Inmueble_compra: number | null
          valor_maximo_compra: number | null
          valor_separacion: number | null
          valor_total: number | null
          visita_inspeccion: boolean | null
          vivienda_interes_confirmada: string | null
        }
        Insert: {
          aceptacion_propuesta?: boolean | null
          analisis_roi_completed?: boolean | null
          area_inmueble_deseado?: string | null
          asistio_reunion?: boolean | null
          barrio_deseado?: string | null
          broker?: string | null
          busqueda_inmueble?: boolean | null
          canon_gastos?: number | null
          cantidad_inmuebles_enviados?: number | null
          capacidad_endeudamiento_mensual?: number | null
          carta_intencion_vendedor?: string | null
          check_certificado_laboral?: boolean | null
          check_certificado_laboral_cotitular?: boolean | null
          check_contrato_de_arriendo?: boolean | null
          check_declaracion_de_renta?: boolean | null
          check_declaracion_renta_cotitular?: boolean | null
          check_desprendibles_nomina_cotitular?: boolean | null
          check_documento_identidad?: boolean | null
          check_documento_identidad_cotitular?: boolean | null
          check_estados_financieros?: boolean | null
          check_estados_financieros_cotitular?: boolean | null
          check_extractos_bancarios_cotitular?: boolean | null
          check_resolucion_pension?: boolean | null
          check_resolucion_pension_cotitular?: boolean | null
          check_rut_camara_de_comercio?: boolean | null
          check_rut_cc_cotitular?: boolean | null
          check_tarjeta_profesional?: boolean | null
          check_tarjeta_profesional_cotitular?: boolean | null
          check_terminos_condiciones?: boolean | null
          check_ultimos_desprendibles_nomina?: boolean | null
          check_ultimos_extractos_bancarios?: boolean | null
          check_ultimos_pagos_pension?: boolean | null
          check_ultimos_pagos_pension_cotitular?: boolean | null
          check_video_anexo_1?: boolean | null
          check_video_contrato_arrendamiento?: boolean | null
          check_video_promesa?: boolean | null
          ciudad?: string | null
          codigo_inmueble?: string | null
          compraventa_cliente_documento?: string | null
          compraventa_vendedor_documento?: string | null
          confirmo_cita?: boolean | null
          copropietario_2?: string | null
          copropietario_3?: string | null
          copropietario_principal?: string | null
          correo_cliente?: string | null
          correo_vendedor?: string | null
          cuenta_cliente?: string | null
          cuota_mensual_minima?: number | null
          debito_automatico?: boolean | null
          dias_abierta?: number | null
          edad_cliente?: number | null
          envio_documento_propuesta?: string | null
          envio_propuesta?: boolean | null
          estado_aprobacion?: string | null
          estado_certificacion_laboral_cotitular?: string | null
          estado_compromiso?: string | null
          estado_declaracion_renta_cotitular?: string | null
          estado_desprendibble_nomina_cotitular?: string | null
          estado_documento_identidad_cotitular?: string | null
          estado_est_financieros_cotitular?: string | null
          estado_extractos_bancarios_cotitular?: string | null
          estado_oferta?: boolean | null
          estado_resolucion_cotitular_pension?: string | null
          estado_tarjeta_profesional_cotitular?: string | null
          estado_ultimos_pagos_pension_cotitular?: string | null
          estudio_crediticio?: string | null
          estudio_titulos?: string | null
          etapa_comercial?: string | null
          etapa_inicio_busqueda_inmueble?: string | null
          evaluacion_psicometrica?: boolean | null
          fecha_apertura_video_compraventa?: string | null
          fecha_apertura_video_contrato_arrendamiento?: string | null
          fecha_cierre_oportunidad?: string | null
          fecha_creacion_oportunidad?: string | null
          fecha_firma_oferta_vinculante?: string | null
          fecha_hora_entrevista?: string | null
          fecha_inicio_busqueda_inmueble?: string | null
          fecha_llamada_propuesta?: string | null
          fecha_reagendamiento_tldv?: string | null
          fecha_tentativa_desembolso?: string | null
          fecha_tentativa_entrega?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_ultimo_cambio_stage?: string | null
          fecha_video_anexo_1?: string | null
          fee_cotizacion?: number | null
          firma_documento_legal?: boolean | null
          gastos?: number | null
          gastos_inmueble_estimados?: number | null
          gastos_reembolsables?: number | null
          hijos_menores_edad?: string | null
          id_aliado?: string | null
          id_evaluacion?: string | null
          id_oportunidad: string
          ingreso_alternativo?: number | null
          ingreso_neto?: number | null
          ingresos_confirmados?: number | null
          ingresos_copropietario?: number | null
          ingresos_principales?: number | null
          inmueble?: string | null
          inmueble_hipoteca_patrimonio?: string | null
          link_cotizacion?: string | null
          link_entrevista?: string | null
          link_psicometrico?: string | null
          localidad_confirmada?: string | null
          loss_reason_client_facing?: string | null
          loss_reason_oportunidad?: string | null
          monto_escrituracion_esperado?: number | null
          nombre_campana?: string | null
          nombre_oportunidad?: string | null
          nombre_vendedor_inmueble?: string | null
          numero_de_encargo_fiduciario?: string | null
          numero_documento?: string | null
          numero_habitaciones_deseado?: number | null
          o?: Json | null
          observaciones?: string | null
          oferta_enviada_vendedor?: boolean | null
          oferta_url?: string | null
          oferta_vinculante?: boolean | null
          oferta_vinculante_documento?: string | null
          oportunidad_con_compromiso?: boolean | null
          opp_viva?: string | null
          pago_comision_broker_formula?: number | null
          piso_o_techo?: string | null
          porcentaje_comision_broker?: number | null
          porcentaje_cuota_inicial?: number | null
          porcentaje_descuento?: number | null
          precio_cliente?: number | null
          presupuesto_inmueble_confirmado?: number | null
          presupuesto_inmueble_deseado?: number | null
          prioridad_oportunidad?: string | null
          probabilidad_cierre?: number | null
          proceso_con_inmueble?: string | null
          propietario_oportunidad?: string | null
          rango_desembolso?: string | null
          reagendo_llamada_tldv?: boolean | null
          recepcion_documentos_capacidad_pago?: boolean | null
          recoleccion_documentos?: boolean | null
          referencia_personal_1?: string | null
          referencia_personal_2?: string | null
          referencias_personales_validadas?: boolean | null
          responsable_entrevista?: string | null
          sarlaft?: string | null
          score_oportunidad?: string | null
          semaforo_aprobacion?: string | null
          siguiente_paso?: string | null
          telefono?: string | null
          tipo_cliente?: string | null
          tipo_documento?: string | null
          tipo_ingreso_copropietario?: string | null
          tipo_inmueble?: string | null
          tipo_negocio?: string | null
          tipo_negocio_hipotecario?: string | null
          url_carpeta_drive?: string | null
          usuario_ultima_modificacion?: string | null
          validacion_documentos?: string | null
          valor_ahorrado?: number | null
          valor_anticipo?: number | null
          valor_anticipo_cuota_inicial_duppla?: number | null
          valor_anticipo_cuota_inicial_vendedor?: number | null
          valor_apartamento?: number | null
          valor_comision_broker?: number | null
          valor_cuota_inicial?: number | null
          valor_desembolso?: number | null
          valor_desembolso_oportunidad?: number | null
          valor_deuda_mensual?: number | null
          valor_deuda_total?: number | null
          valor_estructuracion_fijo?: number | null
          valor_faltante_cuota_inicial?: number | null
          valor_inmueble?: number | null
          valor_Inmueble_compra?: number | null
          valor_maximo_compra?: number | null
          valor_separacion?: number | null
          valor_total?: number | null
          visita_inspeccion?: boolean | null
          vivienda_interes_confirmada?: string | null
        }
        Update: {
          aceptacion_propuesta?: boolean | null
          analisis_roi_completed?: boolean | null
          area_inmueble_deseado?: string | null
          asistio_reunion?: boolean | null
          barrio_deseado?: string | null
          broker?: string | null
          busqueda_inmueble?: boolean | null
          canon_gastos?: number | null
          cantidad_inmuebles_enviados?: number | null
          capacidad_endeudamiento_mensual?: number | null
          carta_intencion_vendedor?: string | null
          check_certificado_laboral?: boolean | null
          check_certificado_laboral_cotitular?: boolean | null
          check_contrato_de_arriendo?: boolean | null
          check_declaracion_de_renta?: boolean | null
          check_declaracion_renta_cotitular?: boolean | null
          check_desprendibles_nomina_cotitular?: boolean | null
          check_documento_identidad?: boolean | null
          check_documento_identidad_cotitular?: boolean | null
          check_estados_financieros?: boolean | null
          check_estados_financieros_cotitular?: boolean | null
          check_extractos_bancarios_cotitular?: boolean | null
          check_resolucion_pension?: boolean | null
          check_resolucion_pension_cotitular?: boolean | null
          check_rut_camara_de_comercio?: boolean | null
          check_rut_cc_cotitular?: boolean | null
          check_tarjeta_profesional?: boolean | null
          check_tarjeta_profesional_cotitular?: boolean | null
          check_terminos_condiciones?: boolean | null
          check_ultimos_desprendibles_nomina?: boolean | null
          check_ultimos_extractos_bancarios?: boolean | null
          check_ultimos_pagos_pension?: boolean | null
          check_ultimos_pagos_pension_cotitular?: boolean | null
          check_video_anexo_1?: boolean | null
          check_video_contrato_arrendamiento?: boolean | null
          check_video_promesa?: boolean | null
          ciudad?: string | null
          codigo_inmueble?: string | null
          compraventa_cliente_documento?: string | null
          compraventa_vendedor_documento?: string | null
          confirmo_cita?: boolean | null
          copropietario_2?: string | null
          copropietario_3?: string | null
          copropietario_principal?: string | null
          correo_cliente?: string | null
          correo_vendedor?: string | null
          cuenta_cliente?: string | null
          cuota_mensual_minima?: number | null
          debito_automatico?: boolean | null
          dias_abierta?: number | null
          edad_cliente?: number | null
          envio_documento_propuesta?: string | null
          envio_propuesta?: boolean | null
          estado_aprobacion?: string | null
          estado_certificacion_laboral_cotitular?: string | null
          estado_compromiso?: string | null
          estado_declaracion_renta_cotitular?: string | null
          estado_desprendibble_nomina_cotitular?: string | null
          estado_documento_identidad_cotitular?: string | null
          estado_est_financieros_cotitular?: string | null
          estado_extractos_bancarios_cotitular?: string | null
          estado_oferta?: boolean | null
          estado_resolucion_cotitular_pension?: string | null
          estado_tarjeta_profesional_cotitular?: string | null
          estado_ultimos_pagos_pension_cotitular?: string | null
          estudio_crediticio?: string | null
          estudio_titulos?: string | null
          etapa_comercial?: string | null
          etapa_inicio_busqueda_inmueble?: string | null
          evaluacion_psicometrica?: boolean | null
          fecha_apertura_video_compraventa?: string | null
          fecha_apertura_video_contrato_arrendamiento?: string | null
          fecha_cierre_oportunidad?: string | null
          fecha_creacion_oportunidad?: string | null
          fecha_firma_oferta_vinculante?: string | null
          fecha_hora_entrevista?: string | null
          fecha_inicio_busqueda_inmueble?: string | null
          fecha_llamada_propuesta?: string | null
          fecha_reagendamiento_tldv?: string | null
          fecha_tentativa_desembolso?: string | null
          fecha_tentativa_entrega?: string | null
          fecha_ultima_actividad?: string | null
          fecha_ultima_modificacion?: string | null
          fecha_ultimo_cambio_stage?: string | null
          fecha_video_anexo_1?: string | null
          fee_cotizacion?: number | null
          firma_documento_legal?: boolean | null
          gastos?: number | null
          gastos_inmueble_estimados?: number | null
          gastos_reembolsables?: number | null
          hijos_menores_edad?: string | null
          id_aliado?: string | null
          id_evaluacion?: string | null
          id_oportunidad?: string
          ingreso_alternativo?: number | null
          ingreso_neto?: number | null
          ingresos_confirmados?: number | null
          ingresos_copropietario?: number | null
          ingresos_principales?: number | null
          inmueble?: string | null
          inmueble_hipoteca_patrimonio?: string | null
          link_cotizacion?: string | null
          link_entrevista?: string | null
          link_psicometrico?: string | null
          localidad_confirmada?: string | null
          loss_reason_client_facing?: string | null
          loss_reason_oportunidad?: string | null
          monto_escrituracion_esperado?: number | null
          nombre_campana?: string | null
          nombre_oportunidad?: string | null
          nombre_vendedor_inmueble?: string | null
          numero_de_encargo_fiduciario?: string | null
          numero_documento?: string | null
          numero_habitaciones_deseado?: number | null
          o?: Json | null
          observaciones?: string | null
          oferta_enviada_vendedor?: boolean | null
          oferta_url?: string | null
          oferta_vinculante?: boolean | null
          oferta_vinculante_documento?: string | null
          oportunidad_con_compromiso?: boolean | null
          opp_viva?: string | null
          pago_comision_broker_formula?: number | null
          piso_o_techo?: string | null
          porcentaje_comision_broker?: number | null
          porcentaje_cuota_inicial?: number | null
          porcentaje_descuento?: number | null
          precio_cliente?: number | null
          presupuesto_inmueble_confirmado?: number | null
          presupuesto_inmueble_deseado?: number | null
          prioridad_oportunidad?: string | null
          probabilidad_cierre?: number | null
          proceso_con_inmueble?: string | null
          propietario_oportunidad?: string | null
          rango_desembolso?: string | null
          reagendo_llamada_tldv?: boolean | null
          recepcion_documentos_capacidad_pago?: boolean | null
          recoleccion_documentos?: boolean | null
          referencia_personal_1?: string | null
          referencia_personal_2?: string | null
          referencias_personales_validadas?: boolean | null
          responsable_entrevista?: string | null
          sarlaft?: string | null
          score_oportunidad?: string | null
          semaforo_aprobacion?: string | null
          siguiente_paso?: string | null
          telefono?: string | null
          tipo_cliente?: string | null
          tipo_documento?: string | null
          tipo_ingreso_copropietario?: string | null
          tipo_inmueble?: string | null
          tipo_negocio?: string | null
          tipo_negocio_hipotecario?: string | null
          url_carpeta_drive?: string | null
          usuario_ultima_modificacion?: string | null
          validacion_documentos?: string | null
          valor_ahorrado?: number | null
          valor_anticipo?: number | null
          valor_anticipo_cuota_inicial_duppla?: number | null
          valor_anticipo_cuota_inicial_vendedor?: number | null
          valor_apartamento?: number | null
          valor_comision_broker?: number | null
          valor_cuota_inicial?: number | null
          valor_desembolso?: number | null
          valor_desembolso_oportunidad?: number | null
          valor_deuda_mensual?: number | null
          valor_deuda_total?: number | null
          valor_estructuracion_fijo?: number | null
          valor_faltante_cuota_inicial?: number | null
          valor_inmueble?: number | null
          valor_Inmueble_compra?: number | null
          valor_maximo_compra?: number | null
          valor_separacion?: number | null
          valor_total?: number | null
          visita_inspeccion?: boolean | null
          vivienda_interes_confirmada?: string | null
        }
        Relationships: []
      }
      opportunity_lead_campaign_inversiones: {
        Row: {
          c_amountallopportunity: number | null
          c_amountwonopportunity: number | null
          c_id: string | null
          c_name: string | null
          c_numboardconverted: number | null
          c_numboardfsaid: number | null
          c_numboardwonopp: number | null
          l_broker__c: string | null
          l_calidad_de_lead__c: string | null
          l_ciudad_de_inmarsu__c: string | null
          l_createddate: string | null
          l_cuota_inicial__c: number | null
          l_estado_no_califica__c: string | null
          l_firstname: string | null
          l_id: string | null
          l_ingreso_familiar__c: string | null
          l_ingresos_totales__c: number | null
          l_lastname: string | null
          l_motive_de_no_c__c: string | null
          l_presupuesto_inmu__c: number | null
          l_recordtypeid: string | null
          o_asistencia_tldyc__c: string | null
          o_campaignid: string | null
          o_closedate: string | null
          o_createddate: string | null
          o_desembolso: number | null
          o_id: string | null
          o_lastmodifieddate: string | null
          o_loss_reason__c: string | null
          o_name: string | null
          o_ownerid: string | null
          o_razon_perdida__c: string | null
          o_recordtypeid: string | null
          o_signdays: number | null
          o_stagename: string | null
          st_id: string | null
        }
        Insert: {
          c_amountallopportunity?: number | null
          c_amountwonopportunity?: number | null
          c_id?: string | null
          c_name?: string | null
          c_numboardconverted?: number | null
          c_numboardfsaid?: number | null
          c_numboardwonopp?: number | null
          l_broker__c?: string | null
          l_calidad_de_lead__c?: string | null
          l_ciudad_de_inmarsu__c?: string | null
          l_createddate?: string | null
          l_cuota_inicial__c?: number | null
          l_estado_no_califica__c?: string | null
          l_firstname?: string | null
          l_id?: string | null
          l_ingreso_familiar__c?: string | null
          l_ingresos_totales__c?: number | null
          l_lastname?: string | null
          l_motive_de_no_c__c?: string | null
          l_presupuesto_inmu__c?: number | null
          l_recordtypeid?: string | null
          o_asistencia_tldyc__c?: string | null
          o_campaignid?: string | null
          o_closedate?: string | null
          o_createddate?: string | null
          o_desembolso?: number | null
          o_id?: string | null
          o_lastmodifieddate?: string | null
          o_loss_reason__c?: string | null
          o_name?: string | null
          o_ownerid?: string | null
          o_razon_perdida__c?: string | null
          o_recordtypeid?: string | null
          o_signdays?: number | null
          o_stagename?: string | null
          st_id?: string | null
        }
        Update: {
          c_amountallopportunity?: number | null
          c_amountwonopportunity?: number | null
          c_id?: string | null
          c_name?: string | null
          c_numboardconverted?: number | null
          c_numboardfsaid?: number | null
          c_numboardwonopp?: number | null
          l_broker__c?: string | null
          l_calidad_de_lead__c?: string | null
          l_ciudad_de_inmarsu__c?: string | null
          l_createddate?: string | null
          l_cuota_inicial__c?: number | null
          l_estado_no_califica__c?: string | null
          l_firstname?: string | null
          l_id?: string | null
          l_ingreso_familiar__c?: string | null
          l_ingresos_totales__c?: number | null
          l_lastname?: string | null
          l_motive_de_no_c__c?: string | null
          l_presupuesto_inmu__c?: number | null
          l_recordtypeid?: string | null
          o_asistencia_tldyc__c?: string | null
          o_campaignid?: string | null
          o_closedate?: string | null
          o_createddate?: string | null
          o_desembolso?: number | null
          o_id?: string | null
          o_lastmodifieddate?: string | null
          o_loss_reason__c?: string | null
          o_name?: string | null
          o_ownerid?: string | null
          o_razon_perdida__c?: string | null
          o_recordtypeid?: string | null
          o_signdays?: number | null
          o_stagename?: string | null
          st_id?: string | null
        }
        Relationships: []
      }
      ops_cac: {
        Row: {
          asistio_reunion: boolean | null
          busqueda_inmueble: boolean | null
          canal_de_venta_incoming: string | null
          codigo_inmueble: string | null
          dias_abierta: number | null
          etapa_comercial: string | null
          fecha_cierre_oportunidad: string | null
          fecha_creacion_lead: string | null
          fecha_creacion_oportunidad: string | null
          fecha_inicio_mes: string | null
          fecha_llamada_propuesta: string | null
          fecha_reunion: string | null
          fecha_ultimo_cambio_stage: string | null
          id_lead: string | null
          id_oportunidad: string | null
          inmueble_lead: string | null
          inmueble_oportunidad: string | null
          lead_convertido: boolean | null
          loss_reason_oportunidad: string | null
          mes_creacion_oportunidad: number | null
          nombre_campaign: string | null
          nombre_oportunidad: string | null
          opp_viva: string | null
          piso_o_techo: string | null
          prioridad_oportunidad: string | null
          probabilidad_cierre: number | null
          propietario_oportunidad: string | null
          rango_desembolso: string | null
          siguiente_paso: string | null
          tiempo_de_vida: number | null
          tipo_inmueble: string | null
          trimestre_creacion_oportunidad: number | null
          valor_desembolso: number | null
          year_creacion_oportunidad: number | null
        }
        Insert: {
          asistio_reunion?: boolean | null
          busqueda_inmueble?: boolean | null
          canal_de_venta_incoming?: string | null
          codigo_inmueble?: string | null
          dias_abierta?: number | null
          etapa_comercial?: string | null
          fecha_cierre_oportunidad?: string | null
          fecha_creacion_lead?: string | null
          fecha_creacion_oportunidad?: string | null
          fecha_inicio_mes?: string | null
          fecha_llamada_propuesta?: string | null
          fecha_reunion?: string | null
          fecha_ultimo_cambio_stage?: string | null
          id_lead?: string | null
          id_oportunidad?: string | null
          inmueble_lead?: string | null
          inmueble_oportunidad?: string | null
          lead_convertido?: boolean | null
          loss_reason_oportunidad?: string | null
          mes_creacion_oportunidad?: number | null
          nombre_campaign?: string | null
          nombre_oportunidad?: string | null
          opp_viva?: string | null
          piso_o_techo?: string | null
          prioridad_oportunidad?: string | null
          probabilidad_cierre?: number | null
          propietario_oportunidad?: string | null
          rango_desembolso?: string | null
          siguiente_paso?: string | null
          tiempo_de_vida?: number | null
          tipo_inmueble?: string | null
          trimestre_creacion_oportunidad?: number | null
          valor_desembolso?: number | null
          year_creacion_oportunidad?: number | null
        }
        Update: {
          asistio_reunion?: boolean | null
          busqueda_inmueble?: boolean | null
          canal_de_venta_incoming?: string | null
          codigo_inmueble?: string | null
          dias_abierta?: number | null
          etapa_comercial?: string | null
          fecha_cierre_oportunidad?: string | null
          fecha_creacion_lead?: string | null
          fecha_creacion_oportunidad?: string | null
          fecha_inicio_mes?: string | null
          fecha_llamada_propuesta?: string | null
          fecha_reunion?: string | null
          fecha_ultimo_cambio_stage?: string | null
          id_lead?: string | null
          id_oportunidad?: string | null
          inmueble_lead?: string | null
          inmueble_oportunidad?: string | null
          lead_convertido?: boolean | null
          loss_reason_oportunidad?: string | null
          mes_creacion_oportunidad?: number | null
          nombre_campaign?: string | null
          nombre_oportunidad?: string | null
          opp_viva?: string | null
          piso_o_techo?: string | null
          prioridad_oportunidad?: string | null
          probabilidad_cierre?: number | null
          propietario_oportunidad?: string | null
          rango_desembolso?: string | null
          siguiente_paso?: string | null
          tiempo_de_vida?: number | null
          tipo_inmueble?: string | null
          trimestre_creacion_oportunidad?: number | null
          valor_desembolso?: number | null
          year_creacion_oportunidad?: number | null
        }
        Relationships: []
      }
      organization_allowed_domains: {
        Row: {
          domain: string
          id: string
          organization_id: string
        }
        Insert: {
          domain: string
          id?: string
          organization_id: string
        }
        Update: {
          domain?: string
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_allowed_domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          gestor_value: string
          id: string
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string
          gestor_value: string
          id?: string
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string
          gestor_value?: string
          id?: string
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      owner_mapping: {
        Row: {
          email: string
          owner_id: string
        }
        Insert: {
          email: string
          owner_id: string
        }
        Update: {
          email?: string
          owner_id?: string
        }
        Relationships: []
      }
      phase_definitions: {
        Row: {
          code: string
          created_at: string | null
          depends_on_phases: string[] | null
          id: string
          max_duration: number | null
          min_duration: number | null
          name: string
          order_index: number
          process_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          depends_on_phases?: string[] | null
          id?: string
          max_duration?: number | null
          min_duration?: number | null
          name: string
          order_index: number
          process_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          depends_on_phases?: string[] | null
          id?: string
          max_duration?: number | null
          min_duration?: number | null
          name?: string
          order_index?: number
          process_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phase_definitions_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "process_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          account_id: string | null
          caption: string | null
          created_at: string | null
          media_url: string | null
          post_id_bd: string
          post_id_meta: string
          post_url: string | null
          published_at: string | null
          Tipo: string | null
        }
        Insert: {
          account_id?: string | null
          caption?: string | null
          created_at?: string | null
          media_url?: string | null
          post_id_bd?: string
          post_id_meta: string
          post_url?: string | null
          published_at?: string | null
          Tipo?: string | null
        }
        Update: {
          account_id?: string | null
          caption?: string | null
          created_at?: string | null
          media_url?: string | null
          post_id_bd?: string
          post_id_meta?: string
          post_url?: string | null
          published_at?: string | null
          Tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id_db"]
          },
        ]
      }
      process_definitions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          version: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          version?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          version?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      proyecciones_comerciales: {
        Row: {
          id: number
          mes: string
          meta_comercial: number
          porcentaje_brokers: number
          porcentaje_marketing: number
        }
        Insert: {
          id?: number
          mes: string
          meta_comercial: number
          porcentaje_brokers: number
          porcentaje_marketing: number
        }
        Update: {
          id?: number
          mes?: string
          meta_comercial?: number
          porcentaje_brokers?: number
          porcentaje_marketing?: number
        }
        Relationships: []
      }
      razones_no_pago: {
        Row: {
          balance: number | null
          cedula: string | null
          codigo_inmueble: string | null
          created_at: string | null
          factura: string | null
          fecha_registro: string | null
          id: string
          nombre_cliente: string | null
          razon_categoria: string
          razon_detalle: string | null
          razon_subcategoria: string
          telefono: string | null
        }
        Insert: {
          balance?: number | null
          cedula?: string | null
          codigo_inmueble?: string | null
          created_at?: string | null
          factura?: string | null
          fecha_registro?: string | null
          id?: string
          nombre_cliente?: string | null
          razon_categoria: string
          razon_detalle?: string | null
          razon_subcategoria: string
          telefono?: string | null
        }
        Update: {
          balance?: number | null
          cedula?: string | null
          codigo_inmueble?: string | null
          created_at?: string | null
          factura?: string | null
          fecha_registro?: string | null
          id?: string
          nombre_cliente?: string | null
          razon_categoria?: string
          razon_detalle?: string | null
          razon_subcategoria?: string
          telefono?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          angry: number | null
          blue_reels_play_count: number | null
          comments: number | null
          created_at: string | null
          fb_reels_replay_count: number | null
          fb_reels_total_plays: number | null
          follows: number | null
          haha: number | null
          impressions: number | null
          like: number | null
          love: number | null
          post_clicks: number | null
          post_id_bd: string | null
          post_video_avg_time_watched: number | null
          post_video_followers: number | null
          post_video_view_time: number | null
          post_view_total_time: number | null
          pride: number | null
          profile_visits: number | null
          reach: number | null
          reactions_id_bd: string
          sad: number | null
          saved: number | null
          shares: number | null
          sorry: number | null
          thankful: number | null
          wow: number | null
        }
        Insert: {
          angry?: number | null
          blue_reels_play_count?: number | null
          comments?: number | null
          created_at?: string | null
          fb_reels_replay_count?: number | null
          fb_reels_total_plays?: number | null
          follows?: number | null
          haha?: number | null
          impressions?: number | null
          like?: number | null
          love?: number | null
          post_clicks?: number | null
          post_id_bd?: string | null
          post_video_avg_time_watched?: number | null
          post_video_followers?: number | null
          post_video_view_time?: number | null
          post_view_total_time?: number | null
          pride?: number | null
          profile_visits?: number | null
          reach?: number | null
          reactions_id_bd?: string
          sad?: number | null
          saved?: number | null
          shares?: number | null
          sorry?: number | null
          thankful?: number | null
          wow?: number | null
        }
        Update: {
          angry?: number | null
          blue_reels_play_count?: number | null
          comments?: number | null
          created_at?: string | null
          fb_reels_replay_count?: number | null
          fb_reels_total_plays?: number | null
          follows?: number | null
          haha?: number | null
          impressions?: number | null
          like?: number | null
          love?: number | null
          post_clicks?: number | null
          post_id_bd?: string | null
          post_video_avg_time_watched?: number | null
          post_video_followers?: number | null
          post_video_view_time?: number | null
          post_view_total_time?: number | null
          pride?: number | null
          profile_visits?: number | null
          reach?: number | null
          reactions_id_bd?: string
          sad?: number | null
          saved?: number | null
          shares?: number | null
          sorry?: number | null
          thankful?: number | null
          wow?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id_bd"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id_bd"]
          },
        ]
      }
      recibos_predial: {
        Row: {
          anio_vigencia: number | null
          created_at: string | null
          id: string
          nombre_inmueble: string | null
          notas: string | null
          salesforce_id: string
          tipo_predio: string
          url_recibo: string | null
        }
        Insert: {
          anio_vigencia?: number | null
          created_at?: string | null
          id?: string
          nombre_inmueble?: string | null
          notas?: string | null
          salesforce_id: string
          tipo_predio?: string
          url_recibo?: string | null
        }
        Update: {
          anio_vigencia?: number | null
          created_at?: string | null
          id?: string
          nombre_inmueble?: string | null
          notas?: string | null
          salesforce_id?: string
          tipo_predio?: string
          url_recibo?: string | null
        }
        Relationships: []
      }
      resumen_inmuebles_mensual: {
        Row: {
          anio: number
          created_at: string | null
          id: number
          inmuebles: number | null
          inmuebles_con_desembolso: number | null
          mes: string
          suma_valor_compra: number | null
          suma_valor_con_desembolso: number | null
          updated_at: string | null
        }
        Insert: {
          anio: number
          created_at?: string | null
          id?: number
          inmuebles?: number | null
          inmuebles_con_desembolso?: number | null
          mes: string
          suma_valor_compra?: number | null
          suma_valor_con_desembolso?: number | null
          updated_at?: string | null
        }
        Update: {
          anio?: number
          created_at?: string | null
          id?: number
          inmuebles?: number | null
          inmuebles_con_desembolso?: number | null
          mes?: string
          suma_valor_compra?: number | null
          suma_valor_con_desembolso?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seguimiento_acuerdos: {
        Row: {
          cedula: string | null
          enviado_at: string | null
          factura: string | null
          id: string
          id_acuerdo: string
          nivel: string
          nombre_cliente: string | null
          telefono: string | null
        }
        Insert: {
          cedula?: string | null
          enviado_at?: string | null
          factura?: string | null
          id?: string
          id_acuerdo: string
          nivel: string
          nombre_cliente?: string | null
          telefono?: string | null
        }
        Update: {
          cedula?: string | null
          enviado_at?: string | null
          factura?: string | null
          id?: string
          id_acuerdo?: string
          nivel?: string
          nombre_cliente?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
      step_definitions: {
        Row: {
          branch_rule: Json | null
          code: string
          created_at: string | null
          decision_options: Json | null
          dependencies: string[] | null
          description: string | null
          id: string
          input_type: string | null
          is_blocking: boolean | null
          name: string
          order_index: number
          owner: string | null
          phase_id: string | null
          requires_input: boolean | null
          step_type: string | null
        }
        Insert: {
          branch_rule?: Json | null
          code: string
          created_at?: string | null
          decision_options?: Json | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          input_type?: string | null
          is_blocking?: boolean | null
          name: string
          order_index: number
          owner?: string | null
          phase_id?: string | null
          requires_input?: boolean | null
          step_type?: string | null
        }
        Update: {
          branch_rule?: Json | null
          code?: string
          created_at?: string | null
          decision_options?: Json | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          input_type?: string | null
          is_blocking?: boolean | null
          name?: string
          order_index?: number
          owner?: string | null
          phase_id?: string | null
          requires_input?: boolean | null
          step_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "step_definitions_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phase_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      step_states: {
        Row: {
          actual_date: string | null
          asset_id: string | null
          blocker_reason: string | null
          blocker_set_at: string | null
          blocker_set_by: string | null
          completed_at: string | null
          completed_by: string | null
          completion_count: number | null
          created_at: string | null
          cycle_count: number | null
          hidden_by_decision: string | null
          history: Json | null
          id: string
          input_value: Json | null
          selected_decision: string | null
          started_at: string | null
          status: string | null
          step_code: string
          updated_at: string | null
        }
        Insert: {
          actual_date?: string | null
          asset_id?: string | null
          blocker_reason?: string | null
          blocker_set_at?: string | null
          blocker_set_by?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_count?: number | null
          created_at?: string | null
          cycle_count?: number | null
          hidden_by_decision?: string | null
          history?: Json | null
          id?: string
          input_value?: Json | null
          selected_decision?: string | null
          started_at?: string | null
          status?: string | null
          step_code: string
          updated_at?: string | null
        }
        Update: {
          actual_date?: string | null
          asset_id?: string | null
          blocker_reason?: string | null
          blocker_set_at?: string | null
          blocker_set_by?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_count?: number | null
          created_at?: string | null
          cycle_count?: number | null
          hidden_by_decision?: string | null
          history?: Json | null
          id?: string
          input_value?: Json | null
          selected_decision?: string | null
          started_at?: string | null
          status?: string | null
          step_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "step_states_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      team_performance: {
        Row: {
          comments: string | null
          comportamientos_cultura: boolean | null
          comprende_entregables: boolean | null
          evaluado: string
          evaluador: string | null
          fecha_evaluacion: string | null
          habilidades_observadas: boolean | null
          id: number
          luchar_por_mantenerlo: number | null
          modelo_canal: string | null
          nivel: string | null
          performance: number | null
          potencial_crecimiento: number | null
          quarter: string | null
        }
        Insert: {
          comments?: string | null
          comportamientos_cultura?: boolean | null
          comprende_entregables?: boolean | null
          evaluado: string
          evaluador?: string | null
          fecha_evaluacion?: string | null
          habilidades_observadas?: boolean | null
          id?: number
          luchar_por_mantenerlo?: number | null
          modelo_canal?: string | null
          nivel?: string | null
          performance?: number | null
          potencial_crecimiento?: number | null
          quarter?: string | null
        }
        Update: {
          comments?: string | null
          comportamientos_cultura?: boolean | null
          comprende_entregables?: boolean | null
          evaluado?: string
          evaluador?: string | null
          fecha_evaluacion?: string | null
          habilidades_observadas?: boolean | null
          id?: number
          luchar_por_mantenerlo?: number | null
          modelo_canal?: string | null
          nivel?: string | null
          performance?: number | null
          potencial_crecimiento?: number | null
          quarter?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          area: string | null
          codigo_de_inmueble: string | null
          comentarios: string | null
          created_at: string | null
          cuenta_contable: string | null
          descripcion: string | null
          estado: string | null
          fecha_de_apertura: string | null
          fecha_de_ultima_modificacion_de_caso: string | null
          gestor: string | null
          id: number
          nombre_de_la_cuenta: string | null
          numero_del_caso: string | null
          origen_del_caso: string | null
          portafolio: string | null
          proceso: string | null
          sub_tipo: string | null
          tiempo: number | null
          tipo: string | null
          tipo1: string | null
          valor: number | null
        }
        Insert: {
          area?: string | null
          codigo_de_inmueble?: string | null
          comentarios?: string | null
          created_at?: string | null
          cuenta_contable?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_de_apertura?: string | null
          fecha_de_ultima_modificacion_de_caso?: string | null
          gestor?: string | null
          id?: number
          nombre_de_la_cuenta?: string | null
          numero_del_caso?: string | null
          origen_del_caso?: string | null
          portafolio?: string | null
          proceso?: string | null
          sub_tipo?: string | null
          tiempo?: number | null
          tipo?: string | null
          tipo1?: string | null
          valor?: number | null
        }
        Update: {
          area?: string | null
          codigo_de_inmueble?: string | null
          comentarios?: string | null
          created_at?: string | null
          cuenta_contable?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_de_apertura?: string | null
          fecha_de_ultima_modificacion_de_caso?: string | null
          gestor?: string | null
          id?: number
          nombre_de_la_cuenta?: string | null
          numero_del_caso?: string | null
          origen_del_caso?: string | null
          portafolio?: string | null
          proceso?: string | null
          sub_tipo?: string | null
          tiempo?: number | null
          tipo?: string | null
          tipo1?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      tldv_meetings: {
        Row: {
          Asistentes: string | null
          cliente_se_conecto: boolean | null
          comercial: string | null
          comprensión: string | null
          cotizacion: string | null
          created_at: string | null
          Duracion: number | null
          financiación: string | null
          happened_at: string | null
          id: string
          id_salesforce: string | null
          invitees: Json | null
          justificacion_p1: string | null
          justificacion_p2: string | null
          justificacion_p3: string | null
          justificacion_p4: string | null
          justificacion_p5: string | null
          name: string | null
          op_id: string | null
          organizer: Json | null
          preguntas_cliente: string | null
          presentación_modelo: string | null
          "Probabilidad de cierre": string | null
          processed: boolean | null
          respaldo_financiero: string | null
          total_puntaje: string | null
          transcription: string | null
          url: string | null
        }
        Insert: {
          Asistentes?: string | null
          cliente_se_conecto?: boolean | null
          comercial?: string | null
          comprensión?: string | null
          cotizacion?: string | null
          created_at?: string | null
          Duracion?: number | null
          financiación?: string | null
          happened_at?: string | null
          id: string
          id_salesforce?: string | null
          invitees?: Json | null
          justificacion_p1?: string | null
          justificacion_p2?: string | null
          justificacion_p3?: string | null
          justificacion_p4?: string | null
          justificacion_p5?: string | null
          name?: string | null
          op_id?: string | null
          organizer?: Json | null
          preguntas_cliente?: string | null
          presentación_modelo?: string | null
          "Probabilidad de cierre"?: string | null
          processed?: boolean | null
          respaldo_financiero?: string | null
          total_puntaje?: string | null
          transcription?: string | null
          url?: string | null
        }
        Update: {
          Asistentes?: string | null
          cliente_se_conecto?: boolean | null
          comercial?: string | null
          comprensión?: string | null
          cotizacion?: string | null
          created_at?: string | null
          Duracion?: number | null
          financiación?: string | null
          happened_at?: string | null
          id?: string
          id_salesforce?: string | null
          invitees?: Json | null
          justificacion_p1?: string | null
          justificacion_p2?: string | null
          justificacion_p3?: string | null
          justificacion_p4?: string | null
          justificacion_p5?: string | null
          name?: string | null
          op_id?: string | null
          organizer?: Json | null
          preguntas_cliente?: string | null
          presentación_modelo?: string | null
          "Probabilidad de cierre"?: string | null
          processed?: boolean | null
          respaldo_financiero?: string | null
          total_puntaje?: string | null
          transcription?: string | null
          url?: string | null
        }
        Relationships: []
      }
      tramites_operaciones_comerciales: {
        Row: {
          celular_cliente: string | null
          codigo_inmueble: string | null
          email_cliente: string | null
          fecha: string | null
          funnel: string | null
          id: number
          link_legal_sf: string | null
          name: string | null
          nombre_vendedor: string | null
          observaciones_cliente: string | null
          portafolio_tentativo: string | null
          responsable: string | null
          tags: string | null
          valor_cuota_inicial: number | null
          valor_desembolso: number | null
          valor_inmueble_sin_fee: number | null
        }
        Insert: {
          celular_cliente?: string | null
          codigo_inmueble?: string | null
          email_cliente?: string | null
          fecha?: string | null
          funnel?: string | null
          id?: number
          link_legal_sf?: string | null
          name?: string | null
          nombre_vendedor?: string | null
          observaciones_cliente?: string | null
          portafolio_tentativo?: string | null
          responsable?: string | null
          tags?: string | null
          valor_cuota_inicial?: number | null
          valor_desembolso?: number | null
          valor_inmueble_sin_fee?: number | null
        }
        Update: {
          celular_cliente?: string | null
          codigo_inmueble?: string | null
          email_cliente?: string | null
          fecha?: string | null
          funnel?: string | null
          id?: number
          link_legal_sf?: string | null
          name?: string | null
          nombre_vendedor?: string | null
          observaciones_cliente?: string | null
          portafolio_tentativo?: string | null
          responsable?: string | null
          tags?: string | null
          valor_cuota_inicial?: number | null
          valor_desembolso?: number | null
          valor_inmueble_sin_fee?: number | null
        }
        Relationships: []
      }
      user_organizations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          invited_at: string | null
          organization_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          invited_at?: string | null
          organization_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          invited_at?: string | null
          organization_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_organizations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_registry: {
        Row: {
          created_at: string
          display_name: string
          email: string
          id: string
          role: string
          ssh_fingerprint: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          email: string
          id?: string
          role?: string
          ssh_fingerprint?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          role?: string
          ssh_fingerprint?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      pyg_activos_materialized: {
        Row: {
          categoria_pyg: string | null
          cuenta_contable: string | null
          inmueble: string | null
          order_group: number | null
          periodo: string | null
          valor_total_movimiento: number | null
        }
        Relationships: []
      }
      user_management_info: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      borrar_todo_por_telefono: {
        Args: { p_phone: string }
        Returns: {
          contactos_borrados: number
          conversaciones_borradas: number
          mensajes_borrados: number
        }[]
      }
      buscar_conversaciones_abiertas_duppla_por_fechas: {
        Args: {
          fecha_creacion_fin: string
          fecha_creacion_inicio: string
          fecha_ultimo_msg_fin: string
          fecha_ultimo_msg_inicio: string
        }
        Returns: {
          contact_id_externo: string
          created_at: string
          estado_finalziacion: string
          id: string
          last_message_time: string
        }[]
      }
      buscar_conversaciones_filtradas: {
        Args: {
          estado: string
          fecha_creacion_fin: string
          fecha_creacion_inicio: string
          fecha_ultimo_msg_fin: string
          fecha_ultimo_msg_inicio: string
        }
        Returns: {
          created_at: string
          estado_finalziacion: string
          id: string
          last_message_time: string
        }[]
      }
      buscar_conversaciones_filtradas_sin_ultimos_del_numero: {
        Args: {
          fecha_creacion_fin: string
          fecha_creacion_inicio: string
          fecha_ultimo_msg_fin: string
          fecha_ultimo_msg_inicio: string
        }
        Returns: {
          contact_id_externo: string
          created_at: string
          estado_finalziacion: string
          id: string
          last_message_time: string
        }[]
      }
      buscar_conversaciones_sin_ultimos_573123285076: {
        Args: {
          fecha_creacion_fin: string
          fecha_creacion_inicio: string
          fecha_ultimo_msg_fin: string
          fecha_ultimo_msg_inicio: string
        }
        Returns: {
          contact_id_externo: string
          created_at: string
          estado_finalziacion: string
          id: string
          last_message_time: string
        }[]
      }
      buscar_conversaciones_sin_ultimos_573150404263: {
        Args: {
          fecha_creacion_fin: string
          fecha_creacion_inicio: string
          fecha_ultimo_msg_fin: string
          fecha_ultimo_msg_inicio: string
        }
        Returns: {
          contact_id_externo: string
          created_at: string
          estado_finalziacion: string
          id: string
          last_message_time: string
        }[]
      }
      cleanup_users_and_profiles: { Args: never; Returns: undefined }
      conteo_conversaciones_rango: {
        Args: { fecha_fin: string; fecha_inicio: string }
        Returns: number
      }
      ejecutar_sql: { Args: { query: string }; Returns: Json }
      ensure_admin_profile: {
        Args: { user_email: string; user_id: string; user_name: string }
        Returns: undefined
      }
      execute_custom_query: { Args: { sql_text: string }; Returns: undefined }
      execute_custom_query2: { Args: { sql_text: string }; Returns: Json }
      get_conversation_filter_options: {
        Args: { p_inbox_id?: string }
        Returns: Json
      }
      get_conversation_metrics: {
        Args: { p_date_from?: string; p_date_to?: string; p_inbox_id?: string }
        Returns: Json
      }
      get_conversations_by_message_content: {
        Args: {
          cursor_timestamp?: string
          filter_acepto_bajar?: boolean
          filter_bajar_precio?: boolean
          filter_campana?: string
          filter_cliente_molesto?: boolean
          filter_comercial?: string
          filter_datacredito?: boolean
          filter_date_from?: string
          filter_date_to?: string
          filter_duppla_rechaza?: boolean
          filter_estado?: string
          filter_estado_quien_responde?: boolean
          filter_humano_necesario?: boolean
          filter_nego_cedula?: boolean
          filter_phone?: string
          filter_pidio_cedula?: boolean
          filter_responde_primera_pregunta?: boolean
          message_pattern: string
          page_limit?: number
        }
        Returns: {
          campana: string
          cliente_acepto_bajar_valor: boolean
          cliente_se_molesto: boolean
          comercial_asignado: string
          contact_externo_name: string
          contact_externo_phone: string
          contact_id_duppla: string
          contact_id_externo: string
          duppla_lo_rechaza: boolean
          estado_finalziacion: string
          humano_necesario: string
          id: string
          inbox_name: string
          last_message: string
          last_message_id: string
          last_message_sender: string
          last_message_time: string
          lo_corrimos_en_datacredito: boolean
          responde_primera_pregunta: string
          se_le_pidio_la_cedula: boolean
          se_nego_a_dar_cedula: boolean
          solicitamos_bajar_precio: boolean
        }[]
      }
      get_conversations_by_message_search: {
        Args: {
          cursor_timestamp?: string
          filter_acepto_bajar?: boolean
          filter_bajar_precio?: boolean
          filter_campana?: string
          filter_cliente_molesto?: boolean
          filter_comercial?: string
          filter_datacredito?: boolean
          filter_date_from?: string
          filter_date_to?: string
          filter_duppla_rechaza?: boolean
          filter_estado?: string
          filter_estado_quien_responde?: boolean
          filter_humano_necesario?: boolean
          filter_nego_cedula?: boolean
          filter_pidio_cedula?: boolean
          filter_responde_primera_pregunta?: boolean
          page_limit?: number
          search_term: string
        }
        Returns: {
          campana: string
          cliente_acepto_bajar_valor: boolean
          cliente_se_molesto: boolean
          comercial_asignado: string
          contact_externo_name: string
          contact_externo_phone: string
          contact_id_duppla: string
          contact_id_externo: string
          duppla_lo_rechaza: boolean
          estado_finalziacion: string
          humano_necesario: string
          id: string
          inbox_name: string
          last_message: string
          last_message_id: string
          last_message_sender: string
          last_message_time: string
          lo_corrimos_en_datacredito: boolean
          responde_primera_pregunta: string
          se_le_pidio_la_cedula: boolean
          se_nego_a_dar_cedula: boolean
          solicitamos_bajar_precio: boolean
        }[]
      }
      get_conversations_humano_necesario: {
        Args: {
          cursor_timestamp?: string
          filter_acepto_bajar?: boolean
          filter_bajar_precio?: boolean
          filter_campana?: string
          filter_cliente_molesto?: boolean
          filter_comercial?: string
          filter_datacredito?: boolean
          filter_date_from?: string
          filter_date_to?: string
          filter_duppla_rechaza?: boolean
          filter_estado?: string
          filter_estado_quien_responde?: boolean
          filter_humano_necesario?: boolean
          filter_nego_cedula?: boolean
          filter_phone?: string
          filter_pidio_cedula?: boolean
          filter_responde_primera_pregunta?: boolean
          page_limit?: number
        }
        Returns: {
          campana: string
          cliente_acepto_bajar_valor: boolean
          cliente_se_molesto: boolean
          comercial_asignado: string
          contact_externo_name: string
          contact_externo_phone: string
          contact_id_duppla: string
          contact_id_externo: string
          duppla_lo_rechaza: boolean
          estado_finalziacion: string
          explicacion_error: string
          humano_necesario: string
          id: string
          inbox_name: string
          last_message: string
          last_message_id: string
          last_message_sender: string
          last_message_time: string
          lo_corrimos_en_datacredito: boolean
          responde_primera_pregunta: string
          se_le_pidio_la_cedula: boolean
          se_nego_a_dar_cedula: boolean
          solicitamos_bajar_precio: boolean
        }[]
      }
      get_conversations_with_last_message: {
        Args: {
          cursor_timestamp?: string
          filter_acepto_bajar?: boolean
          filter_bajar_precio?: boolean
          filter_campana?: string
          filter_cliente_molesto?: boolean
          filter_comercial?: string
          filter_datacredito?: boolean
          filter_date_from?: string
          filter_date_to?: string
          filter_duppla_rechaza?: boolean
          filter_estado?: string
          filter_estado_quien_responde?: boolean
          filter_humano_necesario?: boolean
          filter_nego_cedula?: boolean
          filter_phone?: string
          filter_pidio_cedula?: boolean
          filter_responde_primera_pregunta?: boolean
          inbox_id: string
          page_limit?: number
        }
        Returns: {
          campana: string
          cliente_acepto_bajar_valor: boolean
          cliente_se_molesto: boolean
          comercial_asignado: string
          contact_externo_name: string
          contact_externo_phone: string
          contact_id_duppla: string
          contact_id_externo: string
          duppla_lo_rechaza: boolean
          estado_finalziacion: string
          humano_necesario: string
          id: string
          inbox_name: string
          last_message: string
          last_message_id: string
          last_message_sender: string
          last_message_time: string
          lo_corrimos_en_datacredito: boolean
          responde_primera_pregunta: string
          se_le_pidio_la_cedula: boolean
          se_nego_a_dar_cedula: boolean
          solicitamos_bajar_precio: boolean
        }[]
      }
      get_datos_basicos: {
        Args: { p_opp_id: string }
        Returns: {
          actividad_economica: string
          calidad: string
          estado_civil: string
          fecha_entrevista: string
          fecha_nacimiento: string
          genero: string
          nivel_educativo: string
          nombre: string
          num_id: string
          opp_id: string
          vive_en_extranjero: boolean
        }[]
      }
      get_datos_cliente_en_extranjero: {
        Args: { p_opp_id: string }
        Returns: {
          calidad: string
          fecha_migracion: string
          num_id: string
          num_trabajos_extranjero: number
          status_migratorio: string
        }[]
      }
      get_datos_cotizacion: {
        Args: { p_opp_id: string }
        Returns: {
          ahorro_sugerido: number
          canon_cotizacion: number
          canon_mas_ahorro_sugerido: number
          cuota_inicial: number
          meta: number
          opp_id: string
          porcentaje_cuota_inicial: number
          presupuesto_inmueble: number
        }[]
      }
      get_datos_deudas: {
        Args: { p_opp_id: string }
        Returns: {
          cuota_deuda_consumo: number
          cuota_deuda_educativa: number
          cuota_deuda_vehicular: number
          cuota_deuda_vivienda: number
          opp_id: string
        }[]
      }
      get_datos_empleo: {
        Args: { p_opp_id: string }
        Returns: {
          calidad: string
          empleo_extranjero: boolean
          moneda_salario: string
          nombre: string
          num_id: string
          salario: number
          tipo_contrato: string
          total_bonificaciones: number
          total_deducciones: number
        }[]
      }
      get_datos_gastos: {
        Args: { p_opp_id: string }
        Returns: {
          gastos_vacaciones_mes: number
          opp_id: string
          valor_gastos_colegios: number
          valor_gastos_entretenimiento: number
          valor_gastos_importantes: number
          valor_gastos_impuesto_vehicular: number
          valor_gastos_mantenimiento_hogar: number
          valor_gastos_materiales_escolares: number
          valor_gastos_mercado: number
          valor_gastos_seguro_salud: number
          valor_gastos_seguro_vehicular: number
          valor_gastos_servicios_publicos: number
          valor_gastos_soat: number
          valor_gastos_transporte: number
        }[]
      }
      get_datos_hijos: {
        Args: { p_opp_id: string }
        Returns: {
          edad_hijo: string
          hijo_menor_edad: string
          hijo_num: number
          opp_id: string
        }[]
      }
      get_datos_independientes: {
        Args: { p_opp_id: string }
        Returns: {
          calidad: string
          cuota_deudas_negocio: number
          gasto_arriendos: number
          gasto_comisiones: number
          gasto_empleados: number
          gasto_importante_negocio: number
          gasto_logistica: number
          gasto_publicidad: number
          gasto_servicios: number
          gasto_servicios_terceros: number
          ingreso_importante_negocio: number
          nombre: string
          num_empleados: number
          num_id: string
          porcentaje_ventas_efectivo: number
          reinversion_negocio: number
          saldo_deudas_negocio: number
          unidades_vendidas_mes_bueno: number
          unidades_vendidas_mes_malo: number
          utilidad_mes_1: number
          utilidad_mes_2: number
          utilidad_mes_3: number
          ventas_mes_1: number
          ventas_mes_2: number
          ventas_mes_3: number
          ventas_mes_bueno: number
          ventas_mes_malo: number
        }[]
      }
      get_datos_informacion_adicional: {
        Args: { p_opp_id: string }
        Returns: {
          ahorro_periodico: number
          habitara_vivienda: boolean
          opp_id: string
          proposito_vivienda: string
          valor_arriendo_esperado: number
          valor_ayuda_prom_mensual: number
          valor_impuesto_predial: number
          valor_pago_admon: number
          valor_pago_arriendo: number
          valor_subsidio_hijos: number
        }[]
      }
      get_datos_semaforo: {
        Args: { p_opp_id: string }
        Returns: {
          calidad: string
          exceso_de_confianza: string
          honestidad: string
          inteligencia_fluida: string
          nivel_psicometrico: string
          opp_id: string
          saldo_mora: number
          score_crediticio: number
        }[]
      }
      get_empleo_prestacion_servicios: {
        Args: { p_opp_id: string }
        Returns: {
          num_id: string
          ps_meses_sin_contrato: string
        }[]
      }
      get_estacionalidad_independientes: {
        Args: { p_opp_id: string }
        Returns: {
          meses_buenos: string
          meses_malos: string
          porcentaje_ownership_negocio: number
        }[]
      }
      get_ingresos_adicionales: {
        Args: { p_opp_id: string }
        Returns: {
          calidad: string
          nombre: string
          num_id: string
          tipo_ingreso_adicional: string
          total_ingreso_adicional: number
        }[]
      }
      get_messages_with_contacts: {
        Args: { p_conversation_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          msg_conversation_id: string
          msg_id: string
          msg_media_type: string
          msg_media_url: string
          msg_message: string
          msg_sender: string
          msg_timestamp: string
          sender_contact_id: string
          sender_contact_is_internal: boolean
          sender_contact_name: string
          sender_contact_phone: string
        }[]
      }
      get_org_users_with_email: {
        Args: { org_id_param: string }
        Returns: {
          created_at: string
          email: string
          last_sign_in_at: string
          user_id: string
        }[]
      }
      get_resolutions_with_agent: {
        Args: {
          p_agent_email?: string
          p_end_date?: string
          p_problem_type?: string
          p_start_date?: string
        }
        Returns: {
          agent_email: string
          client_lost_due_to_error: boolean
          context_explanation: string
          conversation_id: string
          converted_to_opportunity: boolean
          created_at: string
          had_real_problem: boolean
          id: string
          problem_type: string
          resolved_by: string
          technical_category: string
        }[]
      }
      get_user_name_by_email: { Args: { user_email: string }; Returns: string }
      get_user_role:
        | { Args: never; Returns: Database["public"]["Enums"]["app_role"] }
        | {
            Args: { _user_id: string }
            Returns: Database["public"]["Enums"]["app_role"]
          }
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
      insert_ad_metrics_v3: {
        Args: {
          p_account_id: string
          p_account_name: string
          p_ad_name: string
          p_adset_id: string
          p_adset_name: string
          p_campaign_id: string
          p_campaign_name: string
          p_captura_video: number
          p_clicks: number
          p_comment: number
          p_conversions: number
          p_date: string
          p_id_meta_ads: string
          p_id_meta_adsets: string
          p_id_meta_campaigns: string
          p_impressions: number
          p_landing_page_view: number
          p_like: number
          p_link_click: number
          p_omni_landing_page_view: number
          p_page_engagement: number
          p_pixel_custom_conversion: number
          p_post_engagement: number
          p_post_reaction: number
          p_retencion_video: number
          p_spend: number
          p_video_thruplays: number
          p_video_view: number
          p_video_watched_pct_100: number
          p_video_watched_pct_25: number
          p_video_watched_pct_50: number
          p_video_watched_pct_75: number
        }
        Returns: undefined
      }
      insert_opportunity_lead_campaign: {
        Args: {
          p_c_name: string
          p_l_createddate: string
          p_l_id: string
          p_l_recordtypeid: string
          p_o_closedate: string
          p_o_createddate: string
          p_o_desembolso: number
          p_o_id: string
          p_o_name: string
          p_o_stagename: string
        }
        Returns: undefined
      }
      is_duppla_email: { Args: never; Returns: boolean }
      list_conversations: {
        Args: {
          p_agent_ids: string[]
          p_date_from?: string
          p_date_to?: string
          p_estado_quien_responde?: string
          p_limit?: number
          p_offset?: number
          p_pending?: boolean
        }
        Returns: {
          campana: string
          cliente_acepto_bajar_valor: boolean
          cliente_se_molesto: boolean
          comercial_asignado: string
          contact_id_duppla: string
          contact_id_externo: string
          contact_is_internal: boolean
          contact_name: string
          contact_phone: string
          created_at: string
          duppla_lo_rechaza: boolean
          estado_finalizacion: string
          estado_quien_responde: string
          id: string
          is_pending: boolean
          last_message_sender: string
          last_message_text: string
          last_message_timestamp: string
          lo_corrimos_en_datacredito: boolean
          metadata: Json
          paso_muere_conversacion: number
          se_le_pidio_la_cedula: boolean
          se_nego_a_dar_cedula: boolean
          solicitamos_bajar_precio: boolean
          total_count: number
        }[]
      }
      normalize_phone: { Args: { p_num: string }; Returns: string }
      por_dia_inbox_funnel_conversaciones: {
        Args: {
          end_date_supabase_conversaciones_exclusive: string
          start_date_supabase_conversaciones: string
        }
        Returns: {
          asignado_comercial: number
          fecha: string
          inbox_id: string
          inbox_nombre: string
          leads_evaluados: number
          no_acepta_bajar_valor: number
          rechazados: number
          respondieron_primera_pregunta: number
          se_nego_dar_cedula: number
          tasa_asignado_comercial: number
          tasa_lead_evaluado: number
          tasa_rechazado: number
          tasa_respondio_primera_pregunta: number
          total_conversaciones: number
        }[]
      }
      rpc_ads_spend_diario_por_campana: {
        Args: { p_from: string; p_to: string }
        Returns: {
          fecha: string
          is_consolidado: number
          p_campaign_name: string
          p_spend: number
        }[]
      }
      rpc_backfill_responde_primera_pregunta: {
        Args: { p_limit?: number }
        Returns: {
          updated_count: number
        }[]
      }
      rpc_conversaciones_abiertas_pendientes_revision: {
        Args: {
          fecha_creacion_fin: string
          fecha_creacion_inicio: string
          fecha_ultimo_msg_fin: string
          fecha_ultimo_msg_inicio: string
        }
        Returns: {
          contact_id_duppla: string
          contact_id_externo: string
          created_at: string
          estado_finalziacion: string
          id: string
          last_message_time: string
          ultima_revision: string
        }[]
      }
      rpc_conversaciones_diarias_avance: {
        Args: { p_from: string; p_to: string }
        Returns: {
          conversaciones_avanzaron: number
          dia: string
          fecha: string
          hora: number
          internal_contact_id: string
          internal_contact_name: string
          is_consolidado: number
          pct_avanzaron: number
          total_conversaciones: number
        }[]
      }
      rpc_conversaciones_por_dia_por_inbox: {
        Args: { p_from: string; p_to: string }
        Returns: {
          conversaciones_avanzaron: number
          fecha: string
          internal_contact_id: string
          internal_contact_name: string
          is_consolidado: number
          pct_avanzaron: number
          total_conversaciones: number
        }[]
      }
      rpc_distribucion_ultimo_paso_por_di: {
        Args: {
          end_date_supabase_conversaciones_exclusive: string
          start_date_supabase_conversaciones: string
        }
        Returns: {
          conteo: number
          fecha_co: string
          pct_del_dia: number
          ultimo_paso_finalizado: string
        }[]
      }
      rpc_distribucion_ultimo_paso_por_dia: {
        Args: {
          end_date_supabase_conversaciones_exclusive: string
          start_date_supabase_conversaciones: string
        }
        Returns: {
          conteo: number
          fecha_co: string
          pct_del_dia: number
          ultimo_paso_finalizado: string
        }[]
      }
      rpc_funnel_conversaciones_por_dia: {
        Args: { fecha_fin: string; fecha_inicio: string }
        Returns: {
          asignado_comercial: number
          fecha: string
          leads_evaluados: number
          no_acepta_bajar_valor: number
          nombre_contacto_duppla: string
          pct_asignado_total: number
          pct_evaluados_a_asignado: number
          pct_evaluados_total: number
          pct_no_acepta_bajar_total: number
          pct_rechazados_total: number
          pct_respondieron_a_evaluados: number
          pct_respondieron_total: number
          pct_se_nego_cedula_total: number
          rechazados: number
          respondieron_primera_pregunta: number
          se_nego_dar_cedula: number
          total_conversaciones: number
        }[]
      }
      rpc_heatmap_conversaciones_por_hora: {
        Args: { p_enddate: string; p_startdate: string }
        Returns: {
          conversaciones_iniciadas: number
          conversaciones_respondieron: number
          fecha: string
          hora: number
          pct_respondieron: number
        }[]
      }
      rpc_pct_primera_pregunta_por_dia: {
        Args: {
          end_date_supabase_conversaciones_exclusive: string
          start_date_supabase_conversaciones: string
        }
        Returns: {
          fecha: string
          pct_respondieron: number
          respondieron_primera_pregunta: number
          total_conversaciones: number
        }[]
      }
      rpc_tasa_cierre_conversacion_por_dia: {
        Args: {
          end_date_supabase_conversaciones_exclusive: string
          start_date_supabase_conversaciones: string
        }
        Returns: {
          cerradas: number
          fecha: string
          pct_cierre: number
          total_conversaciones: number
        }[]
      }
      rpc_tasa_rechazo_por_dia: {
        Args: {
          end_date_supabase_conversaciones_exclusive: string
          start_date_supabase_conversaciones: string
        }
        Returns: {
          fecha: string
          pct_rechazo: number
          rechazados: number
          total_conversaciones: number
        }[]
      }
      search_conversations: {
        Args: {
          agent_ids: string[]
          date_from?: string
          date_to?: string
          fallback_all?: boolean
          p_filters?: Json
          p_limit?: number
          p_offset?: number
          p_pending?: boolean
          term: string
        }
        Returns: {
          cliente_acepto_bajar_valor: boolean
          cliente_se_molesto: boolean
          contact_id_duppla: string
          contact_id_externo: string
          contact_is_internal: boolean
          contact_name: string
          contact_phone: string
          conversation_id: string
          created_at: string
          estado_quien_responde: string
          is_pending: boolean
          last_message_sender: string
          last_message_text: string
          last_message_timestamp: string
          lo_corrimos_en_datacredito: boolean
          matched_message_snippet: string
          paso_muere_conversacion: number
          se_le_pidio_la_cedula: boolean
          se_nego_a_dar_cedula: boolean
          solicitamos_bajar_precio: boolean
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      tu_funcion_inversiones: {
        Args: {
          p_account_id: string
          p_account_name: string
          p_ad_name: string
          p_adset_id: string
          p_adset_name: string
          p_campaign_id: string
          p_campaign_name: string
          p_captura_video: number
          p_clicks: number
          p_comment: number
          p_conversions: number
          p_date: string
          p_id_meta_ads: string
          p_id_meta_adsets: string
          p_id_meta_campaigns: string
          p_impressions: number
          p_landing_page_view: number
          p_like: number
          p_link_click: number
          p_omni_landing_page_view: number
          p_page_engagement: number
          p_pixel_custom_conversion: number
          p_post_engagement: number
          p_post_reaction: number
          p_retencion_video: number
          p_spend: number
          p_video_thruplays: number
          p_video_view: number
          p_video_watched_pct_100: number
          p_video_watched_pct_25: number
          p_video_watched_pct_50: number
          p_video_watched_pct_75: number
        }
        Returns: undefined
      }
      user_is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "viewer" | "editor"
      canal_type: "Inbound" | "Outbound"
      estado_balance_admon:
        | "al_dia"
        | "en_reclamacion"
        | "proceso_legal"
        | "sin_informacion"
      liquidation_status: "calculada" | "aprobada" | "pagada" | "rechazada"
      transaction_type:
        | "nueva"
        | "renovacion"
        | "prepago_reinversion"
        | "referido"
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
      app_role: ["admin", "user", "viewer", "editor"],
      canal_type: ["Inbound", "Outbound"],
      estado_balance_admon: [
        "al_dia",
        "en_reclamacion",
        "proceso_legal",
        "sin_informacion",
      ],
      liquidation_status: ["calculada", "aprobada", "pagada", "rechazada"],
      transaction_type: [
        "nueva",
        "renovacion",
        "prepago_reinversion",
        "referido",
      ],
    },
  },
} as const
