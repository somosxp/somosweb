import { useState, useEffect, useRef } from "react";
import type { Category, Project } from "@lib/types";
import { mapProject, mapCategory } from "@lib/api";
import { getLangFromUrl, useTranslations } from "../i18n/utils";
import ProjectSmallCard from "@components/ProjectSmallCard.tsx";

const lang = "es";
const t = useTranslations(lang);
const LIMIT = 10;
const DEFAULT_CATEGORY = 1;

export default function ProjectsSidebar({ currentProject} : { currentProject: Project }) {
  const [categoryFilter, setCategoryFilter] = useState(DEFAULT_CATEGORY);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const resizeProjectsSection = () => {
      const projectsSection = document.getElementById("projects");
      if (!projectsSection) return;

      if (window.innerWidth > 768) {
        projectsSection.style.setProperty("--projects-width", "100%");
      }

      const totalProjects =
        projectsSection.querySelectorAll("article").length ?? 0;

      const projectWidth = 320 + 16;

      projectsSection.style.setProperty(
        "--projects-width",
        `${totalProjects * projectWidth}px`
      );
    };

    window.addEventListener("resize", resizeProjectsSection);
    resizeProjectsSection();

    return () => {
      window.removeEventListener("resize", resizeProjectsSection);
    };
  }, [projects])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/category?filter_parent_id=${categoryFilter}`);
      const items = await response.json();
      const categoriesMap = items.map(mapCategory);
      setCategories(categoriesMap);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  }

  const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects?page=${Math.floor(offset / LIMIT) + 1}&limit=${LIMIT}&category_id=${categoryFilter}`);
        const items = await response.json();
        const newProjects = items.map(mapProject).filter((project: Project) => project.id !== currentProject.id);
  
        setProjects((prev: Project[]) => [...prev, ...newProjects]);
        setHasMore(newProjects.length === LIMIT);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    if (!firstLoad) return;
    fetchCategories();
    setFirstLoad(false);
  }, [])

  useEffect(() => {
      fetchProjects();
    }, [offset, categoryFilter])
  
    useEffect(() => {
      setOffset(0);
      setProjects([]);
    }, [categoryFilter])
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setOffset((prev) => prev + LIMIT);
          }
        },
        { threshold: 1.0 }
      );
  
      if (sentinelRef.current) observer.observe(sentinelRef.current);
  
      return () => observer.disconnect();
    }, [hasMore])
  
  return (
    <>
      <header>
        <h2 className="text-4xl xl:text-5xl font-semibold mb-6">
          {t("projects.header.title")}
        </h2>
        <ul className="flex flex-wrap gap-2">
          <li>
          <button
              onClick={() => setCategoryFilter(DEFAULT_CATEGORY)}
              className={`bg-[#F2F2F2] cursor-pointer py-2 px-6 rounded-3xl uppercase flex flex-col gap-y-4 text-[#808080] hover:bg-primary hover:text-black transition-all ease-out duration-300 ${DEFAULT_CATEGORY === categoryFilter ? "bg-primary text-black" : ""}`}
            >
              {t("alla")}
            </button>
          </li>
          {
            categories.map((category: Category) => (
              <li key={category.id}>
                <button
                  onClick={() => setCategoryFilter(category.id)}
                  className={`bg-[#F2F2F2] cursor-pointer py-2 px-6 rounded-3xl uppercase flex flex-col gap-y-4 text-[#808080] hover:bg-primary hover:text-black transition-all ease-out duration-300 ${category.id === categoryFilter ? "bg-primary text-black" : ""}`}
                >
                  {category.title}
                </button>
              </li>
            ))
          }
        </ul>
      </header>
      <section
        className="overflow-hidden w-full max-lg:overflow-x-scroll"
      >
        <nav
          id="projects"
          className="flex flex-row lg:flex-col max-lg:gap-x-4 lg:gap-y-4 lg:h-full box-content lg:pr-4 w-[var(--projects-width)] lg:w-full mt-6"
        >
          {
            projects.map((project: Project, index: number) => (
              <div className="w-80 lg:w-full" key={project.id}>
                <ProjectSmallCard
                  id={project.id}
                  tags={project.tags}
                  title={project.title}
                  image={project.image}
                  link={project.link}
                  key={project.id}
                  index={index}
                />
              </div>
            ))
          }
          <div ref={sentinelRef} className="h-10"></div>
          {loading && <p className="text-center py-4">Cargando más proyectos...</p>}
        </nav>
      </section>
    </>
  )
}