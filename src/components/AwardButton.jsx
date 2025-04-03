import { Plus } from "./icons/Icons.tsx";
export default function AwardButton({
  title,
  index,
  image,
  children,
  onClick,
  isActive = false,
}) {
  return (
    <button
      className="circle-btn flex items-center justify-center flex-col relative rounded-full overflow-hidden"
      data-id={`circle-${index}`}
      onClick={onClick}
    >
      {children}
      <Plus />
      <img
        className="absolute top-0 left-0 w-full h-full transition-all rounded-full"
        style={{ transform: isActive ? "scale(1)" : "scale(0)" }}
        src={image}
        alt={title}
      />
    </button>
  );
}
