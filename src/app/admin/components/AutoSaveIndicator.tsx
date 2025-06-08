import { FaSpinner } from 'react-icons/fa';

interface AutoSaveIndicatorProps {
  isDirty: boolean;
  lastSaved: Date | null;
}

export default function AutoSaveIndicator({ isDirty, lastSaved }: AutoSaveIndicatorProps) {
  return (
    <div className="text-sm text-gray-500">
      {isDirty ? (
        <span className="flex items-center">
          <FaSpinner className="animate-spin mr-2" />
          Saving...
        </span>
      ) : lastSaved ? (
        <span>Last saved {lastSaved.toLocaleTimeString()}</span>
      ) : null}
    </div>
  );
} 