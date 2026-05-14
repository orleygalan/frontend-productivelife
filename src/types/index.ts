// Auth 
export interface User {
    id: string;
    name: string;
    email: string;
    mode: 'work' | 'life';
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

// Modo Work
export interface Organization {
    id: string;
    name: string;
    description?: string;
    owner_id: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    pivot: {
        role: 'admin' | 'editor' | 'viewer';
        joined_at: string;
    };
}

export interface Team {
    id: string;
    name: string;
    organization_id: string;
    members?: TeamMember[];
}

export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    team_id: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    project_id: string;
    assigned_to?: string;
    due_date?: string;
}

// Modo Life
// export interface DailyTask {
//     id: string;
//     title: string;
//     xp_reward: number;
//     completed: boolean;
//     task_date: string;
//     completed_at?: string;
// }

// export interface Reward {
//     id: string;
//     name: string;
//     points_cost: number;
//     user_id: string;
// }

// export interface UserPoints {
//     id: string;
//     user_id: string;
//     total_points: number;
//     level: number;
//     streak_days: number;
//     last_active?: string;
// }

// export interface WeeklyPointsSummary {
//     id: string;
//     total_points: number;
//     week_start: string;
//     week_end: string;
//     redeemed: boolean;
// }
export type GoalTerm = 'short' | 'medium' | 'long';
export type GoalStatus = 'active' | 'completed' | 'failed';

export interface GoalTask {
    id: string;
    goal_id: string;
    title: string;
    xp_per_day: number;
    created_at: string;
}

export interface Goal {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    term: GoalTerm;
    status: GoalStatus;
    current_streak: number;
    max_streak: number;
    missed_days: number;
    bonus_granted: boolean;
    tasks: GoalTask[];
}

export interface TodayTask {
    id: string;
    title: string;
    xp_per_day: number;
    is_editable: boolean;
    completed: boolean;
    completed_at?: string;
}

export interface UserPoints {
    id: string;
    user_id: string;
    balance: number;
    total_earned: number;
    total_spent: number;
}

export interface PointLog {
    id: string;
    user_id: string;
    goal_id?: string;
    goal_task_id?: string;
    amount: number;
    type: 'daily_task' | 'streak_bonus' | 'reward_redeem';
    description: string;
    created_at: string;
    goal?: Goal;
}

export interface Reward {
    id: string;
    user_id: string;
    name: string;
    points_cost: number;
}