/**
 * Django REST API Client Configuration
 * This file provides authentication and data access functions for the Django + MongoDB backend
 */

// Get environment variables for Django backend
const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api';
const apiKey = import.meta.env?.VITE_API_KEY || '';

// Check if we're in production mode with Django API configured
export const isApiConfigured = !!(apiBaseUrl && apiBaseUrl !== 'http://localhost:8000/api');

// Also export with the old name for backward compatibility
export const isSupabaseConfigured = isApiConfigured;

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(apiKey && { 'X-API-Key': apiKey }),
    ...options.headers,
  };

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for session management
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
};

// Type definitions for database models (matching MongoDB schemas)
export interface UserProfile {
  _id: string;
  id: string; // Alias for _id for backward compatibility
  email: string;
  name: string;
  role: 'student' | 'teacher';
  grade: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentProgress {
  _id: string;
  user_id: string;
  subject: 'math' | 'science' | 'technology' | 'engineering';
  activities_completed: number;
  total_activities: number;
  points: number;
  badges: string[];
  current_level: number;
  created_at: string;
  updated_at: string;
}

export interface Class {
  _id: string;
  teacher_id: string;
  class_name: string;
  grade: string;
  subject: string | null;
  description: string | null;
  student_count: number;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  _id: string;
  subject: 'math' | 'science' | 'technology' | 'engineering';
  title: string;
  description: string | null;
  grade_level: string;
  activity_type: 'quiz' | 'game' | 'challenge' | 'experiment';
  difficulty: 'easy' | 'medium' | 'hard';
  points_reward: number;
  estimated_time_minutes: number | null;
  content: any;
  created_at: string;
  updated_at: string;
}

export interface QuizResult {
  _id: string;
  user_id: string;
  activity_id: string;
  score: number;
  max_score: number;
  time_taken_seconds: number | null;
  answers: any;
  points_earned: number;
  completed_at: string;
}

export interface Achievement {
  _id: string;
  user_id: string;
  achievement_type: 'badge' | 'trophy' | 'certificate' | 'streak';
  achievement_name: string;
  achievement_icon: string | null;
  subject: string | null;
  earned_at: string;
}

// Authentication helper functions
export const authHelpers = {
  /**
   * Sign up a new user
   */
  signUp: async (email: string, password: string, userData: { name: string; role: 'student' | 'teacher'; grade?: string }) => {
    // DEMO MODE: If API not configured, use mock authentication
    if (!isApiConfigured) {
      console.info('ℹ️ Running in DEMO MODE - All data is temporary and stored locally.');
      // Mock successful signup
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        created_at: new Date().toISOString(),
      };
      return { user: mockUser, error: null };
    }

    try {
      const response = await apiCall('/auth/signup/', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          name: userData.name,
          role: userData.role,
          grade: userData.grade || null,
        }),
      });

      return { user: response.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  /**
   * Sign in existing user
   */
  signIn: async (email: string, password: string, selectedRole?: 'student' | 'teacher', selectedGrade?: string) => {
    // DEMO MODE: If API not configured, use mock authentication
    if (!isApiConfigured) {
      // Only log on first use to avoid console spam
      if (!sessionStorage.getItem('demoModeLogged')) {
        console.info('ℹ️ Running in DEMO MODE - All data is temporary and stored locally.');
        sessionStorage.setItem('demoModeLogged', 'true');
      }
      // Mock successful login (accept any email with @ and password length >= 4)
      if (email.includes('@') && password.length >= 4) {
        const mockProfile = {
          id: Math.random().toString(36).substr(2, 9),
          _id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          role: (selectedRole || 'student') as 'student' | 'teacher', // Use selected role instead of hardcoded
          grade: selectedRole === 'student' ? (selectedGrade || '8') : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return { user: { id: mockProfile.id, email }, profile: mockProfile, error: null };
      } else {
        return { user: null, profile: null, error: 'Invalid credentials' };
      }
    }

    try {
      const response = await apiCall('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Django response should include user and profile
      return { 
        user: { id: response.user._id, email: response.user.email }, 
        profile: { ...response.user, id: response.user._id }, 
        error: null 
      };
    } catch (error: any) {
      return { user: null, profile: null, error: error.message };
    }
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    if (!isApiConfigured) {
      return { error: null };
    }
    try {
      await apiCall('/auth/logout/', { method: 'POST' });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  /**
   * Get current session
   */
  getSession: async () => {
    if (!isApiConfigured) {
      return { session: null, error: null };
    }
    try {
      const response = await apiCall('/auth/session/');
      return { session: response.session, error: null };
    } catch (error: any) {
      return { session: null, error: error.message };
    }
  },

  /**
   * Get current user profile
   */
  getUserProfile: async (userId: string) => {
    if (!isApiConfigured) {
      return { profile: null, error: null };
    }
    try {
      const response = await apiCall(`/users/${userId}/`);
      return { profile: { ...response, id: response._id }, error: null };
    } catch (error: any) {
      return { profile: null, error: error.message };
    }
  },
};

// Student data helper functions
export const studentHelpers = {
  /**
   * Get student progress for all subjects
   */
  getProgress: async (userId: string) => {
    if (!isApiConfigured) {
      return { progress: [], error: null };
    }
    try {
      const response = await apiCall(`/students/${userId}/progress/`);
      return { progress: response.progress, error: null };
    } catch (error: any) {
      return { progress: [], error: error.message };
    }
  },

  /**
   * Update student progress
   */
  updateProgress: async (userId: string, subject: string, updates: any) => {
    if (!isApiConfigured) {
      return { progress: null, error: null };
    }
    try {
      const response = await apiCall(`/students/${userId}/progress/${subject}/`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return { progress: response, error: null };
    } catch (error: any) {
      return { progress: null, error: error.message };
    }
  },

  /**
   * Get available activities for student's grade
   */
  getActivities: async (grade: string, subject?: string) => {
    if (!isApiConfigured) {
      return { activities: [], error: null };
    }
    try {
      const params = new URLSearchParams({ grade });
      if (subject) params.append('subject', subject);
      
      const response = await apiCall(`/activities/?${params.toString()}`);
      return { activities: response.activities, error: null };
    } catch (error: any) {
      return { activities: [], error: error.message };
    }
  },

  /**
   * Submit quiz result
   */
  submitQuizResult: async (result: {
    user_id: string;
    activity_id: string;
    score: number;
    max_score: number;
    time_taken_seconds?: number;
    answers?: any;
    points_earned: number;
  }) => {
    if (!isApiConfigured) {
      return { result: null, error: null };
    }
    try {
      const response = await apiCall('/quiz-results/', {
        method: 'POST',
        body: JSON.stringify(result),
      });
      return { result: response, error: null };
    } catch (error: any) {
      return { result: null, error: error.message };
    }
  },

  /**
   * Get student achievements
   */
  getAchievements: async (userId: string) => {
    if (!isApiConfigured) {
      return { achievements: [], error: null };
    }
    try {
      const response = await apiCall(`/students/${userId}/achievements/`);
      return { achievements: response.achievements, error: null };
    } catch (error: any) {
      return { achievements: [], error: error.message };
    }
  },
};

// Teacher data helper functions
export const teacherHelpers = {
  /**
   * Get all classes for a teacher
   */
  getClasses: async (teacherId: string) => {
    if (!isApiConfigured) {
      return { classes: [], error: null };
    }
    try {
      const response = await apiCall(`/teachers/${teacherId}/classes/`);
      return { classes: response.classes, error: null };
    } catch (error: any) {
      return { classes: [], error: error.message };
    }
  },

  /**
   * Create a new class
   */
  createClass: async (classData: {
    teacher_id: string;
    class_name: string;
    grade: string;
    subject?: string;
    description?: string;
  }) => {
    if (!isApiConfigured) {
      return { class: null, error: null };
    }
    try {
      const response = await apiCall('/classes/', {
        method: 'POST',
        body: JSON.stringify(classData),
      });
      return { class: response, error: null };
    } catch (error: any) {
      return { class: null, error: error.message };
    }
  },

  /**
   * Get students in a class
   */
  getClassStudents: async (classId: string) => {
    if (!isApiConfigured) {
      return { students: [], error: null };
    }
    try {
      const response = await apiCall(`/classes/${classId}/students/`);
      return { students: response.students, error: null };
    } catch (error: any) {
      return { students: [], error: error.message };
    }
  },

  /**
   * Get analytics for all students in teacher's classes
   */
  getClassAnalytics: async (teacherId: string) => {
    if (!isApiConfigured) {
      return { analytics: null, error: null };
    }
    try {
      const response = await apiCall(`/teachers/${teacherId}/analytics/`);
      return { analytics: response.analytics, error: null };
    } catch (error: any) {
      return { analytics: null, error: error.message };
    }
  },

  /**
   * Create assignment or notice for students
   */
  createAssignment: async (assignmentData: {
    teacher_id: string;
    title: string;
    type: 'assignment' | 'notice';
    subject: string;
    target_grade: string;
    content: string;
    attachment?: {
      name: string;
      type: string;
      data: string; // Base64 encoded file data
    };
  }) => {
    if (!isApiConfigured) {
      // DEMO MODE: Store in localStorage
      const stored = localStorage.getItem('teacherAssignments');
      const assignments = stored ? JSON.parse(stored) : [];
      const newAssignment = {
        id: Math.random().toString(36).substr(2, 9),
        _id: Math.random().toString(36).substr(2, 9),
        ...assignmentData,
        teacherName: 'Demo Teacher', // In real app, get from session
        createdAt: new Date().toISOString(),
      };
      assignments.push(newAssignment);
      localStorage.setItem('teacherAssignments', JSON.stringify(assignments));
      return { assignment: newAssignment, error: null };
    }
    
    try {
      const response = await apiCall('/assignments/', {
        method: 'POST',
        body: JSON.stringify(assignmentData),
      });
      return { assignment: response, error: null };
    } catch (error: any) {
      return { assignment: null, error: error.message };
    }
  },

  /**
   * Get all assignments created by teacher
   */
  getTeacherAssignments: async (teacherId: string) => {
    if (!isApiConfigured) {
      // DEMO MODE: Get from localStorage
      const stored = localStorage.getItem('teacherAssignments');
      const assignments = stored ? JSON.parse(stored) : [];
      return { assignments, error: null };
    }
    
    try {
      const response = await apiCall(`/teachers/${teacherId}/assignments/`);
      return { assignments: response.assignments, error: null };
    } catch (error: any) {
      return { assignments: [], error: error.message };
    }
  },

  /**
   * Delete an assignment
   */
  deleteAssignment: async (assignmentId: string, teacherId: string) => {
    if (!isApiConfigured) {
      // DEMO MODE: Delete from localStorage
      const stored = localStorage.getItem('teacherAssignments');
      const assignments = stored ? JSON.parse(stored) : [];
      const filtered = assignments.filter((a: any) => a.id !== assignmentId && a._id !== assignmentId);
      localStorage.setItem('teacherAssignments', JSON.stringify(filtered));
      return { error: null };
    }
    
    try {
      await apiCall(`/assignments/${assignmentId}/`, {
        method: 'DELETE',
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

// Assignment/Notice helper functions
export const assignmentHelpers = {
  /**
   * Get assignments for a specific grade (student view)
   */
  getAssignmentsForGrade: async (grade: string) => {
    if (!isApiConfigured) {
      // DEMO MODE: Get from localStorage and filter by grade
      const stored = localStorage.getItem('teacherAssignments');
      const allAssignments = stored ? JSON.parse(stored) : [];
      const filtered = allAssignments.filter((a: any) => a.target_grade === grade || a.targetGrade === grade);
      return { assignments: filtered, error: null };
    }
    
    try {
      const response = await apiCall(`/assignments/?grade=${grade}`);
      return { assignments: response.assignments, error: null };
    } catch (error: any) {
      return { assignments: [], error: error.message };
    }
  },

  /**
   * Mark assignment as viewed by student
   */
  markAsViewed: async (assignmentId: string, studentId: string) => {
    if (!isApiConfigured) {
      return { error: null };
    }
    
    try {
      await apiCall(`/assignments/${assignmentId}/view/`, {
        method: 'POST',
        body: JSON.stringify({ student_id: studentId }),
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

export default { authHelpers, studentHelpers, teacherHelpers, assignmentHelpers };