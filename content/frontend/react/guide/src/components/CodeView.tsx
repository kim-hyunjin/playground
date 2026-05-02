import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/themes/prism-tomorrow.css";

const { highlight, languages } = Prism;

interface CodeViewProps {
	code: string;
}

export const CodeView = ({ code }: CodeViewProps) => {
	return (
		<div className="flex flex-col h-full bg-[#2d2d2d] rounded-lg overflow-hidden border border-gray-700 shadow-xl">
			<div className="flex items-center px-4 py-2 bg-[#1e1e1e] border-b border-gray-800">
				<span className="text-xs font-mono text-gray-400">Preview.jsx</span>
			</div>

			<div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed">
				<pre className="m-0">
					<code
						dangerouslySetInnerHTML={{
							__html: highlight(code, languages.jsx || languages.js, "jsx"),
						}}
					/>
				</pre>
			</div>
		</div>
	);
};
