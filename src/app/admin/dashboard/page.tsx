"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderGit2,
  Cpu,
  Briefcase,
  Mail,
  Plus,
  Trash2,
  Edit,
  LogOut,
} from "lucide-react";
import { Project, Skill, Experience, ContactMessage } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatImageUrl } from "@/lib/utils";
import {
  fetchProjects,
  persistProjects,
  removeProjectFromDB,
  upsertProjectToDB,
  fetchSkills,
  persistSkills,
  removeSkillFromDB,
  upsertSkillToDB,
  fetchExperiences,
  persistExperiences,
  removeExperienceFromDB,
  upsertExperienceToDB,
  fetchContactMessages,
  removeContactMessageFromDB,
} from "@/lib/data/store";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "skills" | "experiences" | "messages">("projects");
  const [loading, setLoading] = useState(true);

  // Local state for full interactive CRUD
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [experiencesList, setExperiencesList] = useState<Experience[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Web Applications" as Project["category"],
    description: "",
    technologies: "",
    live_url: "",
    github_url: "",
    youtube_url: "",
    is_featured: false,
    images: "",
  });

  // Skill Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "Languages" as Skill["category"],
    proficiency: 90,
  });

  // Experience Modal State
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    period: "",
    description: "",
    is_current: false,
  });

  // Fetch initial stored state on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [projs, skls, exps, msgs] = await Promise.all([
        fetchProjects(),
        fetchSkills(),
        fetchExperiences(),
        fetchContactMessages(),
      ]);
      setProjectsList(projs);
      setSkillsList(skls);
      setExperiencesList(exps);
      setMessagesList(msgs);
      setLoading(false);
    }
    loadData();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("admin_auth_demo");
    router.push("/admin/login");
  };

  // PROJECT CRUD HANDLERS
  const handleOpenProjectModal = (proj?: Project) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        title: proj.title,
        category: proj.category,
        description: proj.description,
        technologies: proj.technologies.join(", "),
        live_url: proj.live_url || "",
        github_url: proj.github_url || "",
        youtube_url: proj.youtube_url || "",
        is_featured: Boolean(proj.is_featured),
        images: proj.images ? proj.images.join("\n") : "",
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: "",
        category: "Web Applications",
        description: "",
        technologies: "",
        live_url: "",
        github_url: "",
        youtube_url: "",
        is_featured: false,
        images: "",
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = projectForm.technologies.split(",").map((t) => t.trim()).filter(Boolean);
    const imagesArray = projectForm.images
      .split("\n")
      .map((i) => formatImageUrl(i.trim()))
      .filter(Boolean);

    let updatedProj: Project;

    if (editingProject) {
      updatedProj = {
        ...editingProject,
        title: projectForm.title,
        category: projectForm.category,
        description: projectForm.description,
        technologies: techArray,
        live_url: projectForm.live_url || null,
        github_url: projectForm.github_url || null,
        youtube_url: projectForm.youtube_url || null,
        is_featured: projectForm.is_featured,
        images: imagesArray.length > 0 ? imagesArray : editingProject.images,
      };
      const updatedList = projectsList.map((p) => (p.id === editingProject.id ? updatedProj : p));
      setProjectsList(updatedList);
      await persistProjects(updatedList);
    } else {
      updatedProj = {
        id: `p-${Date.now()}`,
        title: projectForm.title,
        category: projectForm.category,
        description: projectForm.description,
        technologies: techArray,
        live_url: projectForm.live_url || null,
        github_url: projectForm.github_url || null,
        youtube_url: projectForm.youtube_url || null,
        is_featured: projectForm.is_featured,
        images: imagesArray.length > 0 ? imagesArray : ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"],
      };
      const updatedList = [updatedProj, ...projectsList];
      setProjectsList(updatedList);
      await persistProjects(updatedList);
    }

    await upsertProjectToDB(updatedProj);
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const updatedList = projectsList.filter((p) => p.id !== id);
      setProjectsList(updatedList);
      await persistProjects(updatedList);
      await removeProjectFromDB(id);
    }
  };

  // SKILL CRUD HANDLERS
  const handleOpenSkillModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency || 90,
      });
    } else {
      setEditingSkill(null);
      setSkillForm({
        name: "",
        category: "Languages",
        proficiency: 90,
      });
    }
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedSkill: Skill;

    if (editingSkill) {
      updatedSkill = { ...editingSkill, ...skillForm };
      const updatedList = skillsList.map((s) => (s.id === editingSkill.id ? updatedSkill : s));
      setSkillsList(updatedList);
      await persistSkills(updatedList);
    } else {
      updatedSkill = {
        id: `s-${Date.now()}`,
        ...skillForm,
      };
      const updatedList = [...skillsList, updatedSkill];
      setSkillsList(updatedList);
      await persistSkills(updatedList);
    }

    await upsertSkillToDB(updatedSkill);
    setIsSkillModalOpen(false);
  };

  const handleDeleteSkill = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      const updatedList = skillsList.filter((s) => s.id !== id);
      setSkillsList(updatedList);
      await persistSkills(updatedList);
      await removeSkillFromDB(id);
    }
  };

  // EXPERIENCE CRUD HANDLERS
  const handleOpenExpModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setExpForm({
        company: exp.company,
        role: exp.role,
        period: exp.period,
        description: exp.description,
        is_current: Boolean(exp.is_current),
      });
    } else {
      setEditingExp(null);
      setExpForm({
        company: "",
        role: "",
        period: "",
        description: "",
        is_current: false,
      });
    }
    setIsExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedExp: Experience;

    if (editingExp) {
      updatedExp = { ...editingExp, ...expForm };
      const updatedList = experiencesList.map((ex) => (ex.id === editingExp.id ? updatedExp : ex));
      setExperiencesList(updatedList);
      await persistExperiences(updatedList);
    } else {
      updatedExp = {
        id: `exp-${Date.now()}`,
        ...expForm,
      };
      const updatedList = [updatedExp, ...experiencesList];
      setExperiencesList(updatedList);
      await persistExperiences(updatedList);
    }

    await upsertExperienceToDB(updatedExp);
    setIsExpModalOpen(false);
  };

  const handleDeleteExp = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience entry?")) {
      const updatedList = experiencesList.filter((ex) => ex.id !== id);
      setExperiencesList(updatedList);
      await persistExperiences(updatedList);
      await removeExperienceFromDB(id);
    }
  };

  const handleDeleteMessage = async (id?: string) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this message inquiry?")) {
      const updatedList = messagesList.filter((m) => m.id !== id);
      setMessagesList(updatedList);
      await removeContactMessageFromDB(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col md:flex-row transition-colors duration-300">

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 glass-panel border-r border-slate-200/60 dark:border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo, Title & Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                M
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-white">Madhushanka H.</h2>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider block">
                  CMS Admin
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${activeTab === "projects"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
                }`}
            >
              <FolderGit2 className="w-4 h-4" /> Projects Management ({projectsList.length})
            </button>

            <button
              onClick={() => setActiveTab("skills")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${activeTab === "skills"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
                }`}
            >
              <Cpu className="w-4 h-4" /> Skills Management ({skillsList.length})
            </button>

            <button
              onClick={() => setActiveTab("experiences")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${activeTab === "experiences"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
                }`}
            >
              <Briefcase className="w-4 h-4" /> Experience Timeline ({experiencesList.length})
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${activeTab === "messages"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
                }`}
            >
              <Mail className="w-4 h-4" /> Visitor Messages ({messagesList.length})
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-white/10 space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            ← View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Project Management</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add, update, or remove portfolio projects & images</p>
              </div>
              <button
                onClick={() => handleOpenProjectModal()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                <Plus className="w-4 h-4" /> Add New Project
              </button>
            </div>

            {/* Projects Table / List */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/10 shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">Project</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Technologies</th>
                      <th className="p-4">Links</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
                    {projectsList.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative shrink-0">
                            {project.images?.[0] && (
                              <img src={project.images[0]} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            {project.title}
                            {project.is_featured && (
                              <span className="ml-2 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-300 text-[10px] font-semibold border border-amber-500/20">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">{project.category}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">
                          {project.technologies.slice(0, 3).join(", ")}
                        </td>
                        <td className="p-4 space-x-2">
                          {project.live_url && <a href={project.live_url} target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline">Live</a>}
                          {project.github_url && <a href={project.github_url} target="_blank" className="text-purple-600 dark:text-purple-400 hover:underline">GitHub</a>}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenProjectModal(project)}
                            className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Skills Management</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage programming languages and tech stacks</p>
              </div>
              <button
                onClick={() => handleOpenSkillModal()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                <Plus className="w-4 h-4" /> Add New Skill
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {skillsList.map((skill) => (
                <div key={skill.id} className="glass-card p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{skill.name}</h4>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{skill.category} • {skill.proficiency}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenSkillModal(skill)}
                      className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCES TAB */}
        {activeTab === "experiences" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Experience Management</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage career history and work timeline</p>
              </div>
              <button
                onClick={() => handleOpenExpModal()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                <Plus className="w-4 h-4" /> Add Experience Entry
              </button>
            </div>

            <div className="space-y-4">
              {experiencesList.map((exp) => (
                <div key={exp.id} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{exp.role}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-semibold">{exp.company}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">{exp.period}</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenExpModal(exp)}
                      className="p-2 rounded-lg bg-slate-200/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExp(exp.id)}
                      className="p-2 rounded-lg bg-slate-200/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Visitor Inquiries</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Messages submitted through your portfolio contact form</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500">
                {messagesList.length} Inquiry{messagesList.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-4">
              {messagesList.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-2xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">No contact messages received yet.</p>
                </div>
              ) : (
                messagesList.map((msg) => (
                  <div key={msg.id} className="glass-card p-6 rounded-2xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/10 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{msg.name}</h4>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{msg.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400">{msg.created_at}</span>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block mb-1">Subject: {msg.subject}</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-white/10 space-y-4 my-8 text-slate-900 dark:text-white">
            <h2 className="text-lg font-bold">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h2>
            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    <option value="Web Applications">Web Applications</option>
                    <option value="Mobile Applications">Mobile Applications</option>
                    <option value="Desktop Applications">Desktop Applications</option>
                    <option value="Live Projects">Live Projects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Featured Project?</label>
                  <input
                    type="checkbox"
                    checked={projectForm.is_featured}
                    onChange={(e) => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                    className="mt-3 w-5 h-5 accent-indigo-600 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  placeholder="React, Next.js, TypeScript, Tailwind CSS"
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Live URL</label>
                  <input
                    type="text"
                    value={projectForm.live_url}
                    onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">GitHub URL</label>
                  <input
                    type="text"
                    value={projectForm.github_url}
                    onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">YouTube URL</label>
                  <input
                    type="text"
                    value={projectForm.youtube_url}
                    onChange={(e) => setProjectForm({ ...projectForm, youtube_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Image URLs (one per line)</label>
                <textarea
                  rows={2}
                  value={projectForm.images}
                  onChange={(e) => setProjectForm({ ...projectForm, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-md border border-slate-200 dark:border-white/10 space-y-4 text-slate-900 dark:text-white">
            <h2 className="text-lg font-bold">{editingSkill ? "Edit Skill" : "Add Skill"}</h2>
            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="Languages">Languages</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Frameworks">Frameworks</option>
                  <option value="Tools">Tools</option>
                  <option value="AI Tools">AI Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Proficiency %</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value, 10) })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-md border border-slate-200 dark:border-white/10 space-y-4 text-slate-900 dark:text-white">
            <h2 className="text-lg font-bold">{editingExp ? "Edit Experience" : "Add Experience"}</h2>
            <form onSubmit={handleSaveExp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Company</label>
                <input
                  type="text"
                  required
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Role Title</label>
                <input
                  type="text"
                  required
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Period (e.g. Jan 2026 - Present)</label>
                <input
                  type="text"
                  required
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  required
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
