export default function ProjectSmallCard({ id, title, image, tags, link, index }: { id: string, title: string, image: string, tags: string[], link: string, index: number }) {
  return (
    <a
      href={link}
      className="relative group"
    >
      <article
        className="flex rounded-[1.75rem] bg-[#F2F2F2] p-2 transition-all ease-out duration-300"
        key={id}
      >
        <img
          src={image}
          alt={title}
          className="w-28 h-28 md:w-32 md:h-32 aspect-square object-cover rounded-[1.25rem]"
          fetchPriority={index > 5 ? "low" : "high"}
        />
        <div className="flex flex-col gap-y-2 ml-4 overflow-hidden">
          <h3
            className="font-semibold text-gray-900 truncate"
          >
            {title}
          </h3>
          <ul className="flex flex-col text-sm text-[#808080] uppercase">
            {tags.map((tag: string) => <li key={tag}>#{tag}</li>)}
          </ul>
        </div>
      </article>
    </a>
  )
}