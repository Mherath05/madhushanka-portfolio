import { Project, Skill, Experience, ContactMessage } from "@/types";
import { INITIAL_PROJECTS, INITIAL_SKILLS, INITIAL_EXPERIENCES } from "./initialData";
import { createClient } from "@/lib/supabase/client";

// Storage Keys
const SKILLS_KEY = "portfolio_skills_v4";
const PROJECTS_KEY = "portfolio_projects_v4";
const EXPERIENCES_KEY = "portfolio_experiences_v4";
const MESSAGES_KEY = "portfolio_messages_v4";

const DELETED_SKILLS_KEY = "portfolio_deleted_skills_v4";
const DELETED_PROJECTS_KEY = "portfolio_deleted_projects_v4";
const DELETED_EXPERIENCES_KEY = "portfolio_deleted_experiences_v4";

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
  let cachedSkills: Skill[] = [];
  let dbSkills: Skill[] = [];

  // Read local cache first
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(SKILLS_KEY);
    if (raw) {
      try {
        cachedSkills = JSON.parse(raw);
      } catch (e) {}
    }
  }

  // Fetch Supabase live data
  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("skills").select("*").order("category");
      if (!error && data && data.length > 0) {
        dbSkills = data as Skill[];
      }
    }
  } catch (err) {
    console.error("Supabase skills fetch notice:", err);
  }

  // Merge logic: start with dbSkills, overlay cached edits/additions
  let merged: Skill[] = [];
  if (dbSkills.length > 0) {
    const map = new Map<string, Skill>();
    dbSkills.forEach((s) => map.set(s.id, s));
    cachedSkills.forEach((s) => map.set(s.id, s)); // Local edits take priority
    merged = Array.from(map.values());
  } else if (cachedSkills.length > 0) {
    merged = cachedSkills;
  } else {
    merged = INITIAL_SKILLS;
  }

  const clean = merged.filter((s) => !deletedIds.includes(s.id));
  if (typeof window !== "undefined") {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(clean));
  }
  return clean;
}

export async function persistSkills(skills: Skill[]): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
  }
}

export async function removeSkillFromDB(id: string): Promise<void> {
  addDeletedId(DELETED_SKILLS_KEY, id);

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
  // Update local cache IMMEDIATELY so refresh never loses it
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(SKILLS_KEY);
    let list: Skill[] = cached ? JSON.parse(cached) : INITIAL_SKILLS;
    const index = list.findIndex((s) => s.id === skill.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...skill };
    } else {
      list.push(skill);
    }
    localStorage.setItem(SKILLS_KEY, JSON.stringify(list));
  }

  // Supabase Cloud Upsert
  try {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("skills").upsert([skill]);
      if (error) console.error("Supabase skill upsert warning:", error);
    }
  } catch (err) {
    console.error("Supabase skill upsert notice:", err);
  }
}

// --- PROJECTS ---
export async function fetchProjects(): Promise<Project[]> {
  const deletedIds = getDeletedIds(DELETED_PROJECTS_KEY);
  let cachedProjects: Project[] = [];
  let dbProjects: Project[] = [];

  // 1. Read local storage cache first
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) {
      try {
        cachedProjects = JSON.parse(raw);
      } catch (e) {}
    }
  }

  // 2. Fetch live data from Supabase DB
  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        dbProjects = data as Project[];
      }
    }
  } catch (err) {
    console.error("Supabase projects fetch notice:", err);
  }

  // 3. Intelligent Merge Algorithm
  let finalProjects: Project[] = [];

  if (dbProjects.length > 0) {
    // Map DB projects & preserve user images from cache if DB image array was empty
    const dbMapped = dbProjects.map((p) => {
      const cachedMatch = cachedProjects.find((cp) => cp.id === p.id || cp.title.toLowerCase() === p.title.toLowerCase());
      const initialMatch = INITIAL_PROJECTS.find((ip) => ip.id === p.id || ip.title.toLowerCase() === p.title.toLowerCase());

      const validImages =
        p.images && Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : cachedMatch?.images && cachedMatch.images.length > 0
          ? cachedMatch.images
          : initialMatch?.images && initialMatch.images.length > 0
          ? initialMatch.images
          : ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"];

      return {
        ...p,
        images: validImages,
      };
    });

    const map = new Map<string, Project>();
    // First insert dbMapped
    dbMapped.forEach((p) => map.set(p.id, p));
    // Overlay local additions/edits from cachedProjects (so locally added/edited projects never vanish)
    cachedProjects.forEach((cp) => {
      const existing = map.get(cp.id);
      if (existing) {
        map.set(cp.id, { ...existing, ...cp });
      } else {
        map.set(cp.id, cp);
      }
    });

    finalProjects = Array.from(map.values());
  } else if (cachedProjects.length > 0) {
    finalProjects = cachedProjects;
  } else {
    finalProjects = INITIAL_PROJECTS;
  }

  const cleanProjects = finalProjects.filter((p) => !deletedIds.includes(p.id));

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
  // 1. Update local storage IMMEDIATELY so refresh NEVER resets user edits
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

  // 2. Explicit payload for Supabase Cloud Database
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

  try {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("projects").upsert([payload]);
      if (error) {
        console.error("Supabase project upsert warning:", error);
      }
    }
  } catch (err) {
    console.error("Supabase project upsert notice:", err);
  }
}

// --- EXPERIENCES ---
export async function fetchExperiences(): Promise<Experience[]> {
  const deletedIds = getDeletedIds(DELETED_EXPERIENCES_KEY);
  let cachedExps: Experience[] = [];
  let dbExps: Experience[] = [];

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(EXPERIENCES_KEY);
    if (raw) {
      try {
        cachedExps = JSON.parse(raw);
      } catch (e) {}
    }
  }

  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("experiences").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        dbExps = data as Experience[];
      }
    }
  } catch (err) {
    console.error("Supabase experiences fetch notice:", err);
  }

  let merged: Experience[] = [];
  if (dbExps.length > 0) {
    const map = new Map<string, Experience>();
    dbExps.forEach((ex) => map.set(ex.id, ex));
    cachedExps.forEach((ex) => map.set(ex.id, ex));
    merged = Array.from(map.values());
  } else if (cachedExps.length > 0) {
    merged = cachedExps;
  } else {
    merged = INITIAL_EXPERIENCES;
  }

  const clean = merged.filter((ex) => !deletedIds.includes(ex.id));
  if (typeof window !== "undefined") {
    localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(clean));
  }
  return clean;
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
      list[index] = { ...list[index], ...experience };
    } else {
      list.unshift(experience);
    }
    localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(list));
  }

  try {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("experiences").upsert([experience]);
      if (error) console.error("Supabase experience upsert warning:", error);
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
  let cachedMessages: ContactMessage[] = [];
  let dbMessages: ContactMessage[] = [];

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (raw) {
      try {
        cachedMessages = JSON.parse(raw);
      } catch (e) {}
    }
  }

  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        dbMessages = data as ContactMessage[];
      }
    }
  } catch (err) {
    console.error("Supabase messages fetch notice:", err);
  }

  let merged: ContactMessage[] = [];
  if (dbMessages.length > 0) {
    const map = new Map<string, ContactMessage>();
    dbMessages.forEach((m) => { if (m.id) map.set(m.id, m); });
    cachedMessages.forEach((m) => { if (m.id) map.set(m.id, m); });
    merged = Array.from(map.values());
  } else if (cachedMessages.length > 0) {
    merged = cachedMessages;
  } else {
    merged = INITIAL_MESSAGES;
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(merged));
  }

  return merged;
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

  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(MESSAGES_KEY);
    let list: ContactMessage[] = cached ? JSON.parse(cached) : INITIAL_MESSAGES;
    list = [newMsg, ...list];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(list));
  }

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
