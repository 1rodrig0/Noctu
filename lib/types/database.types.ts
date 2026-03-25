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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'student' | 'lab_manager'
          student_code: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'student' | 'lab_manager'
          student_code?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'student' | 'lab_manager'
          student_code?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      equipment: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          category_id: string | null
          brand: string | null
          model: string | null
          serial_number: string | null
          status: 'available' | 'on_loan' | 'maintenance' | 'retired'
          condition: 'excellent' | 'good' | 'fair' | 'poor' | null
          purchase_date: string | null
          location: string | null
          image_url: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          category_id?: string | null
          brand?: string | null
          model?: string | null
          serial_number?: string | null
          status?: 'available' | 'on_loan' | 'maintenance' | 'retired'
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | null
          purchase_date?: string | null
          location?: string | null
          image_url?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          category_id?: string | null
          brand?: string | null
          model?: string | null
          serial_number?: string | null
          status?: 'available' | 'on_loan' | 'maintenance' | 'retired'
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | null
          purchase_date?: string | null
          location?: string | null
          image_url?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loans: {
        Row: {
          id: string
          equipment_id: string
          student_id: string
          status: 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue'
          requested_at: string
          approved_at: string | null
          rejected_at: string | null
          loan_start_date: string | null
          loan_end_date: string | null
          expected_return_date: string
          actual_return_date: string | null
          approved_by: string | null
          rejected_by: string | null
          returned_to: string | null
          purpose: string
          rejection_reason: string | null
          return_notes: string | null
          return_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          student_id: string
          status?: 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue'
          requested_at?: string
          approved_at?: string | null
          rejected_at?: string | null
          loan_start_date?: string | null
          loan_end_date?: string | null
          expected_return_date: string
          actual_return_date?: string | null
          approved_by?: string | null
          rejected_by?: string | null
          returned_to?: string | null
          purpose: string
          rejection_reason?: string | null
          return_notes?: string | null
          return_condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          student_id?: string
          status?: 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue'
          requested_at?: string
          approved_at?: string | null
          rejected_at?: string | null
          loan_start_date?: string | null
          loan_end_date?: string | null
          expected_return_date?: string
          actual_return_date?: string | null
          approved_by?: string | null
          rejected_by?: string | null
          returned_to?: string | null
          purpose?: string
          rejection_reason?: string | null
          return_notes?: string | null
          return_condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_lab_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_student: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}