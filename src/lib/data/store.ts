import { Project, Skill, Experience, ContactMessage } from "@/types";
import { INITIAL_PROJECTS, INITIAL_SKILLS, INITIAL_EXPERIENCES } from "./initialData";
import { createClient } from "@/lib/supabase/client";

// Storage Keys
const SKILLS_KEY = "portfolio_skills_v3";
const PROJECTS_KEY = "portfolio_projects_v3";
const EXPERIENCES_KEY = "portfolio_experiences_v3";
const MESSAGES_KEY = "portfolio_messages_v3";

const DELETED_SKILLS_KEY = "portfolio_deleted_skills_v3";
const DELETED_PROJECTS_KEY = "portfolio_deleted_projects_v3";
const DELETED_EXPERIENCES_KEY = "portfolio_deleted_experiences_v3";

// Helper for local deletion overrides (used when offline)
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

  // 1. Prioritize Live Supabase Fetch (so all browsers sync live)
  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("skills").select("*").order("category");
      if (!error && data && data.length > 0) {
        skills = data as Skill[];
        if (typeof window !== "undefined") {
          localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
        }
      }
    }
  } catch (err) {
    console.error("Supabase skills fetch notice:", err);
  }

  // 2. Fallback to LocalStorage cache if Supabase is offline or empty
  if (skills.length === 0 && typeof window !== "undefined") {
    const cached = localStorage.getItem(SKILLS_KEY);
    if (cached) {
      try {
        skills = JSON.parse(cached);
      } catch (e) {}
    }
  }

  // 3. Fallback to Initial Seed Data
  if (skills.length === 0) {
    skills = INITIAL_SKILLS;
  }

  // Filter out any locally deleted IDs and return
  const cleanSkills = skills.filter((s) => !deletedIds.includes(s.id));
  return cleanSkills;
}

export async function persistSkills(skills: Skill[]): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
  }
}

export async function removeSkillFromDB(id: string): Promise<void> {
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

  // Supabase Cloud Deletion
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
  // 1. Supabase Cloud Upsert (Syncs globally across all browsers)
  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("skills").upsert([skill]);
    }
  } catch (err) {
    console.error("Supabase skill upsert notice:", err);
  }

  // 2. Update local cache
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
}

// --- PROJECTS ---
export async function fetchProjects(): Promise<Project[]> {
  const deletedIds = getDeletedIds(DELETED_PROJECTS_KEY);
  let projects: Project[] = [];

  // 1. Prioritize Live Supabase Fetch (Syncs globally across all devices & browsers)
  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        projects = (data as Project[]).map((p) => {
          const initialMatch = INITIAL_PROJECTS.find(
            (ip) => ip.id === p.id || ip.title.toLowerCase() === p.title.toLowerCase()
          );
          const validImages =
            p.images && Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : initialMatch?.images && initialMatch.images.length > 0
              ? initialMatch.images
              : ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"];

          return {
            ...p,
            images: validImages,
          };
        });

        if (typeof window !== "undefined") {
          localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
        }
      }
    }
  } catch (err) {
    console.error("Supabase projects fetch notice:", err);
  }

  // 2. Fallback to local cache if Supabase query returned no data
  if (projects.length === 0 && typeof window !== "undefined") {
    const cached = localStorage.getItem(PROJECTS_KEY);
    if (cached) {
      try {
        projects = JSON.parse(cached);
      } catch (e) {}
    }
  }

  // 3. Fallback to initial seed projects
  if (projects.length === 0) {
    projects = INITIAL_PROJECTS;
  }

  const cleanProjects = projects.filter((p) => !deletedIds.includes(p.id));
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
  const payload = {
    id: project.id,
    title: project.title,
    category: project.category,
    description: project.description,
    technologies: project.technologies || [],
    live_url: project.live_url || null,
    github_url: project.github_url || null,
    youtube_url: project.youtube_url || null,
    is_featured: Boolean(project.is_featured),
    images: project.images || [],
    updated_at: new Date().toISOString(),
  };

  // 1. Supabase Cloud Upsert (Global multi-browser sync)
  try {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("projects").upsert([payload]);
      if (error) {
        console.error("Supabase project upsert error:", error);
      }
    }
  } catch (err) {
    console.error("Supabase project upsert notice:", err);
  }

  // 2. Update local cache
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(PROJECTS_KEY);
    let list: Project[] = cached ? JSON.parse(cached) : INITIAL_PROJECTS;
    const index = list.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...project };
    } else {
      list.unshift(project);
    }
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
  }
}

// --- EXPERIENCES ---
export async function fetchExperiences(): Promise<Experience[]> {
  const deletedIds = getDeletedIds(DELETED_EXPERIENCES_KEY);
  let experiences: Experience[] = [];

  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("experiences").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        experiences = data as Experience[];
        if (typeof window !== "undefined") {
          localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(experiences));
        }
      }
    }
  } catch (err) {
    console.error("Supabase experiences fetch notice:", err);
  }

  if (experiences.length === 0 && typeof window !== "undefined") {
    const cached = localStorage.getItem(EXPERIENCES_KEY);
    if (cached) {
      try {
        experiences = JSON.parse(cached);
      } catch (e) {}
    }
  }

  if (experiences.length === 0) {
    experiences = INITIAL_EXPERIENCES;
  }

  const cleanExperiences = experiences.filter((ex) => !deletedIds.includes(ex.id));
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
  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("experiences").upsert([experience]);
    }
  } catch (err) {
    console.error("Supabase experience upsert notice:", err);
  }

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

  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        messages = data as ContactMessage[];
        if (typeof window !== "undefined") {
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
        }
      }
    }
  } catch (err) {
    console.error("Supabase messages fetch notice:", err);
  }

  if (messages.length === 0 && typeof window !== "undefined") {
    const cached = localStorage.getItem(MESSAGES_KEY);
    if (cached) {
      try {
        messages = JSON.parse(cached);
      } catch (e) {}
    }
  }

  if (messages.length === 0) {
    messages = INITIAL_MESSAGES;
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

  // 1. Supabase Cloud Insert (Global multi-browser sync)
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

  // 2. Save to local storage cache
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(MESSAGES_KEY);
    let list: ContactMessage[] = cached ? JSON.parse(cached) : INITIAL_MESSAGES;
    list = [newMsg, ...list];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(list));
  }
}

export async function removeContactMessageFromDB(id?: string): Promise<void> {
  if (!id) return;

  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("contacts").delete().eq("id", id);
    }
  } catch (err) {
    console.error("Supabase message delete notice:", err);
  }

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
}
