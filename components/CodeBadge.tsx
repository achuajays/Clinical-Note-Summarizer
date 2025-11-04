import React from 'react';

interface CodeBadgeProps {
  code: string;
  description: string;
  type: 'icd' | 'cpt';
}

const CodeBadge: React.FC<CodeBadgeProps> = ({ code, description, type }) => {
  const bgColor = type === 'icd' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800';
  const ringColor = type === 'icd' ? 'ring-emerald-200' : 'ring-blue-200';

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${bgColor} ring-1 ring-inset ${ringColor}`}>
      <span className="font-bold">{code}</span>: {description}
    </span>
  );
};

export default CodeBadge;
