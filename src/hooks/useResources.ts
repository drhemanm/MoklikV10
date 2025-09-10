import { useState, useCallback } from 'react';
import { ref, getDownloadURL, listAll, getMetadata, StorageReference } from 'firebase/storage';
import { storage } from '../config/firebase.js';
import type { Resource } from '../types/resource.js';

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResources = useCallback(async (folderPath: string) => {
    if (!folderPath) {
      setError('Invalid folder path');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use just the folder path without gs:// prefix
      const fullPath = folderPath;
      console.log('Loading resources from path:', fullPath);
      const folderRef = ref(storage, fullPath);
      const result = await listAll(folderRef);

      if (!result.items.length) {
        console.log('No items found in folder:', folderPath);
        setResources([]);
        return;
      }

      const resourcePromises = result.items.map(async (item: StorageReference) => {
        try {
          const metadata = await getMetadata(item);
          const type: Resource['type'] = folderPath.includes('Ebook') ? 'ebook' :
                      folderPath.includes('Syllabus') ? 'syllabus' : 'exam';

          const resource: Resource = {
            id: item.name,
            title: metadata.customMetadata?.title || item.name,
            description: metadata.customMetadata?.description || '',
            url: await getDownloadURL(item),
            path: item.fullPath,
            type,
            format: metadata.contentType || 'application/pdf',
            size: metadata.size,
            downloads: parseInt(metadata.customMetadata?.downloads || '0'),
            updatedAt: new Date(metadata.updated).getTime(),
            category: metadata.customMetadata?.category || '',
            level: (metadata.customMetadata?.level as Resource['level']) || 'both'
          };
          return resource;
        } catch (error) {
          console.error('Error processing resource:', item.name, error);
          return null;
        }
      });

      const resourcesData = (await Promise.all(resourcePromises)).filter((r): r is Resource => r !== null);
      console.log('Loaded resources:', resourcesData.length);
      setResources(resourcesData);
    } catch (error) {
      console.error('Error loading resources:', error);
      setError('Failed to load resources. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadResource = async (resource: Resource) => {
    try {
      const url = await getDownloadURL(ref(storage, resource.path));

      const a = document.createElement('a');
      a.href = url;
      a.download = resource.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return url;
    } catch (error) {
      console.error('Error downloading resource:', error);
      setError('Failed to download resource. Please try again.');
      throw new Error('Failed to download resource');
    }
  };

  return {
    resources,
    isLoading,
    error,
    loadResources,
    downloadResource
  };
}