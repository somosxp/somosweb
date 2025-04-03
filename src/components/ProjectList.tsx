import type { Project } from "@lib/types";
import { useEffect, useRef, useState } from "react";
import { mapProject } from "@lib/api";
import ProjectCard from "./ProjectCard.tsx";

const LIMIT = 10;

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const sentinelRef = useRef(null);

  const getColumnClass = (index: number) => {
    const pattern = [6, 6, 4, 4, 4];
    return `md:col-span-${pattern[index % pattern.length]}`;
  }

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects?page=${Math.floor(offset / LIMIT) + 1}&limit=${LIMIT}`);
      const items = await response.json();
      const newProjects = items.map(mapProject);

      setProjects((prev) => [...prev, ...newProjects]);
      setHasMore(newProjects.length === LIMIT);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [offset])

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
    <div className="p-4 grid grid-cols-12 gap-4 gap-y-12 text-white">
      {
        projects.length > 0 && projects.map((project: Project, index: number) => (
          <ProjectCard
            index={index}
            id={project.id}
            tags={project.tags}
            title={project.title}
            description={project.description}
            shortDescription={project.shortDescription}
            image={project.image}
            link={project.link}
            key={project.id}
            className={`col-span-12 ${getColumnClass(index)}`}
          />
        ))
      }

      <div ref={sentinelRef} className="h-10"></div>

      {loading && <p className="text-center py-4 col-span-12">Cargando más proyectos...</p>}
    </div>
  )
}