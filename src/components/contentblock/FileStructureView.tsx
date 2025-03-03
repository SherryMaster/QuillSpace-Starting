import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FolderOpen,
  FileText,
  FileJson,
  FileCode,
  FileArchive,
  Image,
  File
} from 'lucide-react';

interface FileStructureViewProps {
  structure: Record<string, any>;
  level?: number;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="w-4 h-4 text-blue-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-yellow-400" />;
    case 'jpg':
    case 'png':
    case 'gif':
    case 'ico':
      return <Image className="w-4 h-4 text-green-400" />;
    case 'zip':
    case '7z':
    case 'tar':
    case 'rar':
    case 'gz':
    case 'tgz':
      return <FileArchive className="w-4 h-4 text-red-400" />;
    case'html':
      return <FileText className="w-4 h-4 text-orange-400" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
};

const getAllFolderKeys = (obj: Record<string, any>, prefix = ''): string[] => {
  return Object.entries(obj).reduce((acc: string[], [key, value]) => {
    const currentPath = prefix ? `${prefix}/${key}` : key;
    if (typeof value === 'object') {
      return [...acc, currentPath, ...getAllFolderKeys(value, currentPath)];
    }
    return acc;
  }, []);
};

export function FileStructureView({ structure, level = 0 }: FileStructureViewProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // Initialize with all folder keys
    return new Set(getAllFolderKeys(structure));
  });

  const toggleItem = (key: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const renderItem = (key: string, value: any) => {
    const isFolder = typeof value === 'object';
    const isExpanded = expandedItems.has(key);
    const paddingLeft = `${level * 1.5}rem`;

    if (isFolder) {
      return (
        <div key={key}>
          <button
            onClick={() => toggleItem(key)}
            className="flex items-center gap-2 w-full hover:bg-gray-700/50 rounded px-2 py-1"
            style={{ paddingLeft }}
          >
            <span className="text-yellow-500">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-yellow-500" />
            ) : (
              <Folder className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-sm text-white">{key}</span>
          </button>
          
          {isExpanded && (
            <div className=" border-gray-700 ml-2">
              <FileStructureView structure={value} level={level + 1} />
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={key}
        className="flex items-center gap-2 hover:bg-gray-700/50 rounded px-2 py-1"
        style={{ paddingLeft }}
      >
        {getFileIcon(key)}
        <span className="text-sm text-white">{key}</span>
        {value && (
          <span className="text-xs text-gray-400 italic">
            {value}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-black rounded-lg border border-gray-800 p-2">
      {Object.entries(structure).map(([key, value]) => renderItem(key, value))}
    </div>
  );
}
