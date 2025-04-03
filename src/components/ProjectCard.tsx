import { useEffect, useState } from "react";

function getCurrentLocale() {
  const pathname = window.location.pathname;
  const segments = pathname.split('/');
  const localeFromPath = segments[1];
  return localeFromPath === 'es' ? 'es' : 'en';
}

export default function ProjectCard({ id, title, image, tags, index, className = "", link, description, shortDescription }) {
  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale());

  const defaultLocale = "en";

  useEffect(() => {
    setCurrentLocale(getCurrentLocale());
  }, []);

  const getProjectUrl = () => {
    const url = []
    if (currentLocale !== defaultLocale) {
      url.push(currentLocale)
    }

    url.push("project")
    url.push(link)

    return "/" + url.join("/");
  }

  return (
    <a href={getProjectUrl()} className={`group ${className}`}>
      <article>
        <figure className="overflow-hidden aspect-video rounded-lg lg:rounded-4xl">
          <img
            src={image}
            className="aspect-video object-cover transition-all ease-out duration-500 group-hover:scale-120"
          />
          <figcaption className="sr-only">{shortDescription}</figcaption>
        </figure>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">
                {title}
              </h3>
              { tags && tags.length && 
                <ul
                  className="flex flex-col xl:flex-row gap-2 text-sm text-gray-500 mt-1 tags"
                >
                  {tags.map((tag: string) => <li className="uppercase" key={tag}>{tag}</li>)}
                </ul>
              }
            </div>
            <div>
              <button className="rounded-full w-11 h-11 flex items-center justify-center bg-gray-50 uppercase gap-x-1 hover:bg-primary transition-all ease-out duration-500 cursor-pointer group-hover:bg-primary text-black">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.2857 4.52218L2.88844 13.9194L2.0802 13.1112L11.4774 3.71394L4.30043 3.83696L4.31589 2.65054L13.4683 2.53132L13.3491 11.6837L12.1627 11.6992L12.2857 4.52218Z" fill="black"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </a>
  )
}