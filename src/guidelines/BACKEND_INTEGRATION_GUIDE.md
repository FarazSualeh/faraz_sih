# Backend Integration Guide

## Overview
This guide explains how to connect the frontend to your Django + MongoDB backend. All data currently stored in localStorage is **backend-ready** and starts from zero by default.

---

## 🎯 Current State: Frontend-Only with localStorage

### What's Implemented
✅ All features work without a backend using localStorage  
✅ Data starts from **0** (zero) by default for new users  
✅ Progress is saved locally and persists across sessions  
✅ All components are structured to easily swap localStorage for API calls  

### Data Storage Locations

#### 1. **Student Progress** (`StudentDashboard.tsx`)
```javascript
// LocalStorage Key: userProgress_${userId}
{
  level: 0,           // Overall user level (starts at 0)
  points: 0,          // Total points earned (starts at 0)
  streak: 0,          // Days streak (starts at 0)
  subjects: {
    mathematics: { level: 0, progress: 0 },
    science: { level: 0, progress: 0 },
    technology: { level: 0, progress: 0 },
    engineering: { level: 0, progress: 0 }
  }
}
```

**Location in code:** Line 303-313 in `StudentDashboard.tsx`

#### 2. **Teacher Classes** (`TeacherDashboard.tsx`)
```javascript
// LocalStorage Key: teacherClasses
[
  {
    id: timestamp,
    name: "Class Name",
    subject: "Any Subject",  // Not limited to STEM
    grade: "6-12",
    students: 0,
    avgScore: 0,
    description: "Optional description"
  }
]
```

**Location in code:** Line 414-418 in `TeacherDashboard.tsx`

#### 3. **Assignments & Notices**
Already integrated with API - see `lib/api.ts` → `assignmentHelpers`

#### 4. **Class Notifications** (NEW - Oct 28, 2025)
```javascript
// LocalStorage Key: classNotifications
[
  {
    id: "class_${timestamp}",
    title: "New Physics Class Available!",
    type: "notice",
    subject: "Physics",
    targetGrade: "10",
    content: "Teacher Name has created a new class...",
    createdAt: "2025-10-28T...",
    teacherName: "Teacher Name",
    isClassNotification: true,
    classId: 12345
  }
]
```

**Location in code:** 
- TeacherDashboard.tsx: lines 508-528 (creation)
- StudentDashboard.tsx: lines 373-390 (fetching)

**Purpose:** When teachers create classes, students in that grade receive notifications in their inbox.

---

## 🔌 Backend Integration Steps

### Step 1: Create Student Progress API Endpoints

Add these endpoints to your Django backend:

#### **GET** `/api/student/progress/<user_id>/`
Get user's current progress

**Response:**
```json
{
  "level": 0,
  "points": 0,
  "streak": 0,
  "subjects": {
    "mathematics": { "level": 0, "progress": 0 },
    "science": { "level": 0, "progress": 0 },
    "technology": { "level": 0, "progress": 0 },
    "engineering": { "level": 0, "progress": 0 }
  }
}
```

#### **POST** `/api/student/progress/<user_id>/`
Update user's progress

**Request Body:**
```json
{
  "level": 5,
  "points": 450,
  "streak": 7,
  "subjects": {
    "mathematics": { "level": 3, "progress": 65 }
  }
}
```

---

### Step 2: Create Teacher Class Management Endpoints

#### **GET** `/api/teacher/classes/`
Get all classes for logged-in teacher

**Response:**
```json
{
  "classes": [
    {
      "id": "class_id_123",
      "name": "Advanced Physics",
      "subject": "Physics",
      "grade": "11",
      "students": 25,
      "avgScore": 82,
      "description": "Advanced concepts"
    }
  ]
}
```

#### **POST** `/api/teacher/classes/`
Create a new class

**Request Body:**
```json
{
  "name": "History 101",
  "subject": "History",
  "grade": "9",
  "description": "World History"
}
```

**Response:**
```json
{
  "id": "new_class_id",
  "name": "History 101",
  "subject": "History",
  "grade": "9",
  "students": 0,
  "avgScore": 0,
  "description": "World History"
}
```

#### **DELETE** `/api/teacher/classes/<class_id>/`
Delete a class

---

### Step 2b: Create Notification Endpoints (NEW)

#### **POST** `/api/notifications/send-to-grade/`
Send notification to all students in a specific grade (used when creating classes)

**Request Body:**
```json
{
  "grade": "10",
  "title": "New Physics Class Available!",
  "content": "Teacher has created a new class: 'Advanced Physics' for Grade 10.",
  "type": "class_created",
  "metadata": {
    "classId": "class_id_123",
    "className": "Advanced Physics",
    "subject": "Physics",
    "teacherName": "Mr. Smith"
  }
}
```

**Response:**
```json
{
  "success": true,
  "notificationId": "notif_id_456",
  "recipientCount": 25
}
```

#### **GET** `/api/notifications/student/<user_id>/`
Get all notifications for a student (combines assignments and class notifications)

**Response:**
```json
{
  "notifications": [
    {
      "id": "notif_id_456",
      "type": "class_created",
      "title": "New Physics Class Available!",
      "content": "...",
      "createdAt": "2025-10-28T...",
      "isRead": false,
      "metadata": {
        "classId": "class_id_123",
        "subject": "Physics"
      }
    }
  ]
}
```

#### **PUT** `/api/notifications/<id>/mark-read/`
Mark a notification as read

**Response:**
```json
{
  "success": true
}
```

---

### Step 3: Update Frontend API Helper

Update `/lib/api.ts` to add student progress and teacher class helpers:

```typescript
// Add to lib/api.ts

export const studentHelpers = {
  // Get user progress
  async getUserProgress(userId: string) {
    try {
      const response = await fetch(`${API_URL}/student/progress/${userId}/`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }
      
      const progress = await response.json();
      return { progress, error: null };
    } catch (error) {
      return { progress: null, error: error.message };
    }
  },

  // Update user progress
  async updateUserProgress(userId: string, progressData: any) {
    try {
      const response = await fetch(`${API_URL}/student/progress/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      
      const progress = await response.json();
      return { progress, error: null };
    } catch (error) {
      return { progress: null, error: error.message };
    }
  },
};

export const teacherClassHelpers = {
  // Get all classes for teacher
  async getClasses() {
    try {
      const response = await fetch(`${API_URL}/teacher/classes/`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      
      const data = await response.json();
      return { classes: data.classes, error: null };
    } catch (error) {
      return { classes: [], error: error.message };
    }
  },

  // Create a new class
  async createClass(classData: any) {
    try {
      const response = await fetch(`${API_URL}/teacher/classes/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create class');
      }
      
      const newClass = await response.json();
      return { class: newClass, error: null };
    } catch (error) {
      return { class: null, error: error.message };
    }
  },

  // Delete a class
  async deleteClass(classId: string) {
    try {
      const response = await fetch(`${API_URL}/teacher/classes/${classId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete class');
      }
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export const notificationHelpers = {
  // Send notification to all students in a grade
  async sendToGrade(notificationData: any) {
    try {
      const response = await fetch(`${API_URL}/notifications/send-to-grade/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
      
      const result = await response.json();
      return { notification: result, error: null };
    } catch (error) {
      return { notification: null, error: error.message };
    }
  },

  // Get all notifications for a student
  async getForStudent(userId: string) {
    try {
      const response = await fetch(`${API_URL}/notifications/student/${userId}/`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      return { notifications: data.notifications, error: null };
    } catch (error) {
      return { notifications: [], error: error.message };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/mark-read/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
```

---

### Step 4: Update StudentDashboard.tsx

Replace localStorage with API calls:

**Find this code (around line 333-348):**
```typescript
// Fetch user progress from API when component mounts
useEffect(() => {
  const fetchUserProgress = async () => {
    // TODO: Replace with actual API call when backend is ready
    // const { progress, error } = await studentHelpers.getUserProgress(userData.id);
    
    // For now, check localStorage for saved progress or start from 0
    const savedProgress = localStorage.getItem(`userProgress_${userData.id}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    // When backend is connected, the above will be replaced with:
    // if (progress) setUserProgress(progress);
  };

  fetchUserProgress();
}, [userData.id]);
```

**Replace with:**
```typescript
// Fetch user progress from API when component mounts
useEffect(() => {
  const fetchUserProgress = async () => {
    const { progress, error } = await studentHelpers.getUserProgress(userData.id);
    
    if (error) {
      console.error('Error fetching progress:', error);
      return;
    }
    
    if (progress) {
      setUserProgress(progress);
    }
  };

  fetchUserProgress();
}, [userData.id]);
```

**Also update the save effect (around line 332-338):**
```typescript
// Save progress to localStorage whenever it changes
useEffect(() => {
  const saveProgress = async () => {
    // Save to API
    const { error } = await studentHelpers.updateUserProgress(userData.id, userProgress);
    
    if (error) {
      console.error('Error saving progress:', error);
    }
  };
  
  saveProgress();
}, [userProgress, userData.id]);
```

---

### Step 5: Update TeacherDashboard.tsx

Replace localStorage with API calls:

**Find this code (around line 414-418):**
```typescript
const [classes, setClasses] = useState<any[]>(() => {
  const stored = localStorage.getItem("teacherClasses");
  return stored ? JSON.parse(stored) : classData;
});
```

**Replace with:**
```typescript
const [classes, setClasses] = useState<any[]>([]);

// Fetch classes on mount
useEffect(() => {
  const fetchClasses = async () => {
    const { classes: fetchedClasses, error } = await teacherClassHelpers.getClasses();
    
    if (error) {
      console.error('Error fetching classes:', error);
      // Fall back to default data if API fails
      setClasses(classData);
      return;
    }
    
    setClasses(fetchedClasses);
  };
  
  fetchClasses();
}, []);
```

**Update handleCreateClass (around line 478-509):**
```typescript
const handleCreateClass = async () => {
  // Validation
  if (!newClass.name || !newClass.subject || !newClass.grade) {
    alert("Please fill in all required fields");
    return;
  }

  // Create via API
  const { class: createdClass, error } = await teacherClassHelpers.createClass({
    name: newClass.name,
    subject: newClass.subject,
    grade: newClass.grade,
    description: newClass.description,
  });

  if (error) {
    console.error('Error creating class:', error);
    alert('Failed to create class. Please try again.');
    return;
  }

  // Update local state
  setClasses([...classes, createdClass]);

  // Reset form and close dialog
  setShowCreateClass(false);
  setNewClass({
    name: "",
    subject: "",
    grade: "",
    description: "",
  });
};
```

---

## 📊 Database Schema

### MongoDB Collections

#### **users** Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,  // Hashed
  role: String,      // 'student', 'teacher', or 'superadmin'
  grade: String,     // For students only
  progress: {
    level: Number,
    points: Number,
    streak: Number,
    subjects: {
      mathematics: { level: Number, progress: Number },
      science: { level: Number, progress: Number },
      technology: { level: Number, progress: Number },
      engineering: { level: Number, progress: Number }
    }
  },
  created_at: Date,
  updated_at: Date
}
```

#### **classes** Collection
```javascript
{
  _id: ObjectId,
  teacher_id: ObjectId,        // Reference to users collection
  name: String,
  subject: String,              // Any subject (not limited to STEM)
  grade: String,
  description: String,
  students: [ObjectId],         // Array of student user IDs
  created_at: Date,
  updated_at: Date
}
```

#### **assignments** Collection (Already implemented)
See `API_SETUP.md` for details

---

## 🧪 Testing

### Test with Mock Data First
1. Keep localStorage implementation
2. Add console.log in API functions
3. Verify data flow

### Test with Real Backend
1. Start Django server
2. Update API_URL in `/lib/api.ts`
3. Test each feature:
   - Login/Signup
   - Student progress tracking
   - Teacher class creation
   - Assignment submission

---

## ✅ Checklist

### Student Dashboard
- [ ] Connect getUserProgress API
- [ ] Connect updateUserProgress API
- [ ] Test progress starts at 0 for new users
- [ ] Test progress persists after logout/login
- [ ] Test subject-specific progress updates

### Teacher Dashboard
- [ ] Connect getClasses API
- [ ] Connect createClass API
- [ ] Test class creation with any subject
- [ ] Test class list updates in real-time
- [ ] Connect deleteClass API (optional)

### General
- [ ] Update API_URL in lib/api.ts
- [ ] Add error handling for all API calls
- [ ] Add loading states during API calls
- [ ] Test offline functionality
- [ ] Add retry logic for failed requests

---

## 🔒 Security Notes

1. **Always use HTTPS** in production
2. **Validate JWT tokens** on every backend request
3. **Sanitize user input** before storing in database
4. **Use bcrypt** for password hashing
5. **Implement rate limiting** to prevent abuse
6. **Never expose sensitive data** in frontend code

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify API endpoint URLs
3. Check Django logs for backend errors
4. Ensure CORS is configured correctly
5. Verify JWT token is being sent in headers

---

## 🎉 Summary

Your frontend is **100% backend-ready**! All you need to do is:

1. ✅ Implement the API endpoints in Django
2. ✅ Update the TODO comments in the code with actual API calls
3. ✅ Test thoroughly
4. ✅ Deploy!

The default state for all new users is **0** (zero progress, zero points, zero streak), which will be populated as they interact with the platform.
