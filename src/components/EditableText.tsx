import { useEdit } from '../contexts/EditContext';
import { Pencil } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  multiline?: boolean;
}

export function EditableText({ value, onChange, className = '', multiline = false }: Props) {
  const { isEditing } = useEdit();

  if (!isEditing) {
    return <div className={className}>{value}</div>;
  }

  return (
    <div className={`relative group ${className}`}>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-blue-50/50 border border-blue-200 rounded p-1 outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-blue-50/50 border border-blue-200 rounded p-1 outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
      <div className="absolute -top-6 right-0 hidden group-hover:flex items-center text-[10px] text-blue-600 font-medium">
        <Pencil className="w-3 h-3 mr-1" /> Edit Mode
      </div>
    </div>
  );
}
