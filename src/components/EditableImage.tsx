import { useEdit } from '../contexts/EditContext';
import { ImagePlus } from 'lucide-react';

interface Props {
  src: string;
  onChange: (val: string) => void;
  className?: string;
  alt?: string;
}

export function EditableImage({ src, onChange, className = '', alt = '' }: Props) {
  const { isEditing } = useEdit();

  return (
    <div className={`relative group ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      {isEditing && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white p-3 rounded-lg shadow-xl w-64">
            <div className="text-xs font-semibold mb-2 flex items-center gap-2">
              <ImagePlus className="w-4 h-4 text-blue-600" />
              Change Image URL
            </div>
            <input
              type="text"
              placeholder="Paste image URL here..."
              className="w-full text-xs p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={src}
              onChange={(e) => onChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-2 text-[10px] text-gray-500 leading-tight">
              Paste a direct image link (e.g., from Unsplash or your own assets).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
