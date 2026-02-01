import type { MDXComponents } from "mdx/types";

export const blogMdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="text-3xl font-black text-slate-900 mt-10 mb-4" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-3" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2" {...props} />
  ),
  p: (props) => (
    <p className="text-slate-600 leading-relaxed mb-4" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal list-inside text-slate-600 mb-4 space-y-1" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: (props) => (
    <a
      className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-slate-300 pl-4 italic text-slate-500 my-6"
      {...props}
    />
  ),
  code: (props) => (
    <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  ),
  pre: (props) => (
    <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto mb-4 text-sm" {...props} />
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-xl my-6 w-full" alt={props.alt ?? ""} {...props} />
  ),
  hr: () => <hr className="border-slate-200 my-8" />,
  table: (props) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm text-slate-600 border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="text-left font-bold text-slate-800 border-b border-slate-200 pb-2 pr-4" {...props} />
  ),
  td: (props) => (
    <td className="border-b border-slate-100 py-2 pr-4" {...props} />
  ),
};
