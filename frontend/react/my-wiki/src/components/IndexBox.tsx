import { Section } from '../data/wikiContent';

interface IndexBoxProps {
  sections: Section[];
}

export default function IndexBox({ sections }: IndexBoxProps) {
  return (
    <div className="border border-gray-300 inline-block ml-1 pt-3 pr-5 pb-4 h-fit min-w-[200px]">
      <div className="text-xl ml-3.5">목차</div>
      <ul className="list-none pl-4">
        {sections.map((section, i) => (
          <li key={section.id}>
            <a href={`#s-${section.id}`} className="text-blue-800 no-underline cursor-pointer">
              {i + 1}
            </a>
            <span>. {section.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
