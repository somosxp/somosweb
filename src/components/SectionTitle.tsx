interface Props {
  title: string;
  class?: string;
}

export default function SectionTitle({ title, class: className = "" }: Props) {
  return (
    <h2 className={`text-7xl font-semibold text-black ${className}`}>
      {title}
    </h2>
  );
}
