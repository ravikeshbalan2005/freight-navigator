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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ports: {
        Row: {
          code: string
          congestion: number
          country: string
          created_at: string
          lat: number
          lng: number
          max_draft: number
          max_loa: number
          name: string
        }
        Insert: {
          code: string
          congestion: number
          country: string
          created_at?: string
          lat: number
          lng: number
          max_draft: number
          max_loa: number
          name: string
        }
        Update: {
          code?: string
          congestion?: number
          country?: string
          created_at?: string
          lat?: number
          lng?: number
          max_draft?: number
          max_loa?: number
          name?: string
        }
        Relationships: []
      }
      repositioning_suggestions: {
        Row: {
          cargo_hint: string
          from_port: string
          id: string
          idle_days_saved: number
          to_port: string
          vessel_id: string
        }
        Insert: {
          cargo_hint: string
          from_port: string
          id?: string
          idle_days_saved: number
          to_port: string
          vessel_id: string
        }
        Update: {
          cargo_hint?: string
          from_port?: string
          id?: string
          idle_days_saved?: number
          to_port?: string
          vessel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repositioning_suggestions_vessel_id_fkey"
            columns: ["vessel_id"]
            isOneToOne: false
            referencedRelation: "vessels"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_alerts: {
        Row: {
          category: string
          detail: string
          id: string
          impact: number
          occurred_at: string
          probability: number
          severity: string
          title: string
        }
        Insert: {
          category: string
          detail: string
          id: string
          impact: number
          occurred_at?: string
          probability: number
          severity: string
          title: string
        }
        Update: {
          category?: string
          detail?: string
          id?: string
          impact?: number
          occurred_at?: string
          probability?: number
          severity?: string
          title?: string
        }
        Relationships: []
      }
      schedule_segments: {
        Row: {
          id: string
          kind: string
          label: string
          start_week: number
          vessel_id: string
          weeks: number
        }
        Insert: {
          id?: string
          kind: string
          label: string
          start_week: number
          vessel_id: string
          weeks: number
        }
        Update: {
          id?: string
          kind?: string
          label?: string
          start_week?: number
          vessel_id?: string
          weeks?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_segments_vessel_id_fkey"
            columns: ["vessel_id"]
            isOneToOne: false
            referencedRelation: "vessels"
            referencedColumns: ["id"]
          },
        ]
      }
      vessel_specs: {
        Row: {
          beam: number
          draft: number
          dwt_max: number
          dwt_min: number
          klass: string
          loa: number
          load_rate: number
          rate_per_tonne: number
          sort_order: number
        }
        Insert: {
          beam: number
          draft: number
          dwt_max: number
          dwt_min: number
          klass: string
          loa: number
          load_rate: number
          rate_per_tonne: number
          sort_order?: number
        }
        Update: {
          beam?: number
          draft?: number
          dwt_max?: number
          dwt_min?: number
          klass?: string
          loa?: number
          load_rate?: number
          rate_per_tonne?: number
          sort_order?: number
        }
        Relationships: []
      }
      vessels: {
        Row: {
          id: string
          idle_days: number
          klass: string
          lat: number
          lng: number
          name: string
          next_free: string
          route: string
          status: string
        }
        Insert: {
          id: string
          idle_days?: number
          klass: string
          lat: number
          lng: number
          name: string
          next_free: string
          route: string
          status: string
        }
        Update: {
          id?: string
          idle_days?: number
          klass?: string
          lat?: number
          lng?: number
          name?: string
          next_free?: string
          route?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
