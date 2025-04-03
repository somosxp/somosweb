import type { Project } from "@lib/types";
import Masonry from 'react-layout-masonry'
import { getRelativeLocaleUrl } from "astro:i18n";
const currentLocale = Astro.currentLocale ?? "en";

export default function ProjectsMasonry({ projects }) {
    return (
      <Masonry
      columns={{ 640: 1, 767: 2, 1023: 3, 1280: 4 }}
      gap={16}
    >
    {projects.map((project: Project) => (
        <article className="page-break-inside-avoid mb-6" key={project.id}>
            <a href={getRelativeLocaleUrl(currentLocale, `/project/${project.id}`)}>
              <div className='overflow-hidden mb-2 relative rounded-lg block w-full'>
                <picture>
                  <img src={project.image} alt={project.title} className='w-full h-full object-cover' />
                </picture>
              </div>
            </a>
            <h3>{project.title}</h3>
            <ul className="flex text-sm text-[#808080] uppercase gap-2">
              {project.tags.map((tag: string) => <li>#{tag}</li>)}
            </ul>
        </article>
    ))}
  </Masonry>
  )
}