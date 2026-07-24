import { Project, Skill, Experience, ContactMessage } from "@/types";
import { INITIAL_PROJECTS, INITIAL_SKILLS, INITIAL_EXPERIENCES } from "./initialData";
import { createClient } from "@/lib/supabase/client";

// Storage Keys
const SKILLS_KEY = "portfolio_skills_v2";
const PROJECTS_KEY = "portfolio_projects_v2";
const EXPERIENCES_KEY = "portfolio_experiences_v2";
const MESSAGES_KEY = "portfolio_messages_v2";

const DELETED_SKILLS_KEY = "portfolio_deleted_skills_v2";
const DELETED_PROJECTS_KEY = "portfolio_deleted_projects_v2";
const DELETED_EXPERIENCES_KEY = "portfolio_deleted_experiences_v2";

// Helper for local deletion overrides
function getDeletedIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function addDeletedId(key: string, id: string): void {
  if (typeof window === "undefined") return;
  const current = getDeletedIds(key);
  if (!current.includes(id)) {
    current.push(id);
    localStorage.setItem(key, JSON.stringify(current));
  }
}

// --- SKILLS ---
export async function fetchSkills(): Promise<Skill[]> {
  const deletedIds = getDeletedIds(DELETED_SKILLS_KEY);
  let skills: Skill[] = [];

  // 1. Check local cache first if modified
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(SKILLS_KEY);
    if (cached) {
      try {
        skills = JSON.parse(cached);
      } catch (e) {}
    }
  }

  // 2. Try fetching from Supabase if local cache empty
  if (skills.length === 0) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.from("skills").select("*").order("category");
        if (!error && data && data.length > 0) {
          skills = data as Skill[];
        }
      }
    } catch (err) {
      console.error("Supabase skills fetch notice:", err);
    }
  }

  // 3. Fallback to initial seed if still empty
  if (skills.length === 0) {
    skills = INITIAL_SKILLS;
  }

  // 4. Apply deletion filter and save clean state
  const cleanSkills = skills.filter((s) => !deletedIds.includes(s.id));
  if (typeof window !== "undefined") {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(cleanSkills));
  }

  return cleanSkills;
}

export async function persistSkills(skills: Skill[]): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
  }
}

export async function removeSkillFromDB(id: string): Promise<void> {
  // Track local deletion override
  addDeletedId(DELETED_SKILLS_KEY, id);

  // Update local cache
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(SKILLS_KEY);
    if (cached) {
      try {
        const list: Skill[] = JSON.parse(cached);
        const updated = list.filter((s) => s.id !== id);
        localStorage.setItem(SKILLS_KEY, JSON.stringify(updated));
      } catch (e) {}
    }
  }

  // Attempt Supabase deletion
  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("skills").delete().eq("id", id);
    }
  } catch (err) {
    console.error("Supabase skill delete notice:", err);
  }
}

export async function upsertSkillToDB(skill: Skill): Promise<void> {
  // Update local cache
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(SKILLS_KEY);
    let list: Skill[] = cached ? JSON.parse(cached) : INITIAL_SKILLS;
    const index = list.findIndex((s) => s.id === skill.id);
    if (index >= 0) {
      list[index] = skill;
    } else {
      list.push(skill);
    }
    localStorage.setItem(SKILLS_KEY, JSON.stringify(list));
  }

  // Attempt Supabase upsert
  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("skills").upsert([skill]);
    }
  } catch (err) {
    console.error("Supabase skill upsert notice:", err);
  }
}

// --- PROJECTS ---
export async function fetchProjects(): Promise<Project[]> {
  const deletedIds = getDeletedIds(DELETED_PROJECTS_KEY);
  let projects: Project[] = [];

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(PROJECTS_KEY);
    if (cached) {
      try {
        projects = JSON.parse(cached);
      } catch (e) {}
    }
  }

  if (projects.length === 0) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          projects = data as Project[];
        }
      }
    } catch (err) {
      console.error("Supabase projects fetch notice:", err);
    }
  }

  if (projects.length === 0) {
    projects = INITIAL_PROJECTS;
  }

  const cleanProjects = projects.filter((p) => !deletedIds.includes(p.id));
  if (typeof window !== "undefined") {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(cleanProjects));
  }

  return cleanProjects;
}

export async function persistProjects(projects: Project[]): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }
}

export async function removeProjectFromDB(id: string): Promise<void> {
  addDeletedId(DELETED_PROJECTS_KEY, id);

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(PROJECTS_KEY);
    if (cached) {
      try {
        const list: Project[] = JSON.parse(cached);
        const updated = list.filter((p) => p.id !== id);
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
      } catch (e) {}
    }
  }

  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("projects").delete().eq("id", id);
    }
  } catch (err) {
    console.error("Supabase project delete notice:", err);
  }
}

export async function upsertProjectToDB(project: Project): Promise<void> {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(PROJECTS_KEY);
    let list: Project[] = cached ? JSON.parse(cached) : INITIAL_PROJECTS;
    const index = list.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      list[index] = project;
    } else {
      list.unshift(project);
    }
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
  }

  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("projects").upsert([project]);
    }
  } catch (err) {
    console.error("Supabase project upsert notice:", err);
  }
}

// --- EXPERIENCES ---
export async function fetchExperiences(): Promise<Experience[]> {
  const deletedIds = getDeletedIds(DELETED_EXPERIENCES_KEY);
  let experiences: Experience[] = [];

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(EXPERIENCES_KEY);
    if (cached) {
      try {
        experiences = JSON.parse(cached);
      } catch (e) {}
    }
  }

  if (experiences.length === 0) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.from("experiences").select("*").order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          experiences = data as Experience[];
        }
      }
    } catch (err) {
      console.error("Supabase experiences fetch notice:", err);
    }
  }

  if (experiences.length === 0) {
    experiences = INITIAL_EXPERIENCES;
  }

  const cleanExperiences = experiences.filter((ex) => !deletedIds.includes(ex.id));
  if (typeof window !== "undefined") {
    localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(cleanExperiences));
  }

  return cleanExperiences;
}

export async function persistExperiences(experiences: Experience[]): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(experiences));
  }
}

export async function removeExperienceFromDB(id: string): Promise<void> {
  addDeletedId(DELETED_EXPERIENCES_KEY, id);

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(EXPERIENCES_KEY);
    if (cached) {
      try {
        const list: Experience[] = JSON.parse(cached);
        const updated = list.filter((ex) => ex.id !== id);
        localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(updated));
      } catch (e) {}
    }
  }

  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("experiences").delete().eq("id", id);
    }
  } catch (err) {
    console.error("Supabase experience delete notice:", err);
  }
}

export async function upsertExperienceToDB(experience: Experience): Promise<void> {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(EXPERIENCES_KEY);
    let list: Experience[] = cached ? JSON.parse(cached) : INITIAL_EXPERIENCES;
    const index = list.findIndex((ex) => ex.id === experience.id);
    if (index >= 0) {
      list[index] = experience;
    } else {
      list.unshift(experience);
    }
    localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(list));
  }

  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("experiences").upsert([experience]);
    }
  } catch (err) {
    console.error("Supabase experience upsert notice:", err);
  }
}

// --- CONTACT MESSAGES ---
const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: "m1",
    name: "David Smith",
    email: "david@techcorp.com",
    subject: "Full-Stack Software Engineering Opportunity",
    message: "Hi Madhushanka, we were deeply impressed by your LMS platform and mobile projects. We would love to discuss a senior engineering role at TechCorp.",
    created_at: "2026-07-22 14:30",
  },
  {
    id: "m2",
    name: "Sarah Jenkins",
    email: "sarah@innovate.io",
    subject: "Freelance React Native Mobile App Inquiry",
    message: "Hello Madhushanka, looking for a skilled developer to build a mobile marketplace similar to Smart Harvest. Let us know your availability.",
    created_at: "2026-07-21 09:15",
  },
];

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  let messages: ContactMessage[] = [];

  // Check local cache first
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(MESSAGES_KEY);
    if (cached) {
      try {
        messages = JSON.parse(cached);
      } catch (e) {}
    }
  }

  // Try fetching from Supabase if local cache is empty
  if (messages.length === 0) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          messages = data as ContactMessage[];
        }
      }
    } catch (err) {
      console.error("Supabase messages fetch notice:", err);
    }
  }

  if (messages.length === 0) {
    messages = INITIAL_MESSAGES;
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }

  return messages;
}

export async function saveContactMessage(msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const newMsg: ContactMessage = {
    id: "msg_" + Date.now(),
    name: msg.name,
    email: msg.email,
    subject: msg.subject || "Portfolio Contact",
    message: msg.message,
    created_at: new Date().toLocaleString(),
  };

  // 1. Save to local storage cache immediately
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(MESSAGES_KEY);
    let list: ContactMessage[] = cached ? JSON.parse(cached) : INITIAL_MESSAGES;
    list = [newMsg, ...list];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(list));
  }

  // 2. Attempt insert to Supabase contacts table
  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("contacts").insert([
        {
          name: msg.name,
          email: msg.email,
          subject: msg.subject || "Portfolio Contact",
          message: msg.message,
        },
      ]);
    }
  } catch (err) {
    console.error("Supabase message insert notice:", err);
  }
}

export async function removeContactMessageFromDB(id?: string): Promise<void> {
  if (!id) return;
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(MESSAGES_KEY);
    if (cached) {
      try {
        const list: ContactMessage[] = JSON.parse(cached);
        const updated = list.filter((m) => m.id !== id);
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
      } catch (e) {}
    }
  }

  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("contacts").delete().eq("id", id);
    }
  } catch (err) {
    console.error("Supabase message delete notice:", err);
  }
}
