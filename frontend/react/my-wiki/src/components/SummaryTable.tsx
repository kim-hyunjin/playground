import { SummaryItem } from '../data/wikiContent';

interface SummaryTableProps {
  title: string;
  subtitle?: string;
  image?: string;
  summaryData: SummaryItem[];
}

export default function SummaryTable({ title, subtitle, image, summaryData }: SummaryTableProps) {
  const accentCell = 'text-center bg-minju text-white font-bold';
  const td = 'px-2.5 py-1.5 border border-gray-200';

  return (
    <table className="w-[500px] mobile:w-full border-2 border-minju border-collapse">
      <tbody>
        <tr>
          <td colSpan={2} className={`${td} ${accentCell}`}>
            <strong>
              <span>{title}</span>
              {subtitle && (
                <>
                  <br />
                  <span>{subtitle}</span>
                </>
              )}
            </strong>
          </td>
        </tr>
        {image && (
          <tr>
            <td colSpan={2} className={td}>
              <img src={image} alt={title} className="w-full" />
            </td>
          </tr>
        )}
        {summaryData.map((item, i) => (
          <tr key={i}>
            <td className={`${td} ${accentCell}`}>{item.label}</td>
            <td className={td} rowSpan={item.rowSpan}>
              {item.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
