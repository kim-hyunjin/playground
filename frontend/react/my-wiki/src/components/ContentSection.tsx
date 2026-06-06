import { useState } from 'react';
import { Section } from '../data/wikiContent';
import chevronImg from '../assets/chevron.png';

interface SectionItemProps {
  section: Section;
  index: number;
}

function SectionItem({ section, index }: SectionItemProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const lines = section.content.split('\n');

  return (
    <section id={`s-${section.id}`}>
      <h2
        className={`border-b border-gray-300 my-5 pb-2 ${!isOpen ? 'opacity-50' : ''}`}
      >
        <img
          src={chevronImg}
          alt="chevron"
          className={`inline-block mr-2 w-[0.9em] h-[0.9em] cursor-pointer transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'
            }`}
          onClick={toggleOpen}
        />
        <a href={`#s-${section.id}`} className="text-blue-800 no-underline cursor-pointer">
          {index + 1}.{' '}
        </a>
        <span>{section.title}</span>
      </h2>
      {isOpen && (
        <div className="pl-4">
          {lines.some((l) => !l.startsWith('-')) &&
            lines
              .filter((l) => !l.startsWith('-') && l.trim().length > 0)
              .map((line, i) => <p key={i} className="my-2">{line}</p>)}
          {lines.some((l) => l.startsWith('-')) && (
            <ul className='list-disc pl-5'>
              {lines
                .filter((l) => l.startsWith('-'))
                .map((line, i) => (
                  <li key={i} className="my-1.5">
                    {line.replace(/^- /, '')}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

interface ContentSectionProps {
  sections: Section[];
}

export default function ContentSection({ sections }: ContentSectionProps) {
  return (
    <>
      {sections.map((section, i) => (
        <SectionItem key={section.id} section={section} index={i} />
      ))}
    </>
  );
}
