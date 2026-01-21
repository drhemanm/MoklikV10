import { useState } from 'react';
import { Plus, Save, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { resourceService } from '../../services/firebase/resources.js';
import type { Resource } from '../../types/resource.js';

export function AdminResourcePanel() {
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    title: '',
    description: '',
    url: '',
    type: 'ebook',
    category: '',
    level: 'both'
  });

  const handleAddResource = async () => {
    if (!newResource.title || !newResource.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await resourceService.addResource(newResource as Omit<Resource, 'id' | 'updatedAt'>);
      setIsAddingResource(false);
      setNewResource({
        title: '',
        description: '',
        url: '',
        type: 'ebook',
        category: '',
        level: 'both'
      });
    } catch (error) {
      console.error('Error adding resource:', error);
      toast.error('Failed to add resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Manage Resources</h2>
        <button
          onClick={() => setIsAddingResource(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {isAddingResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Resource</h3>
              <button
                onClick={() => setIsAddingResource(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newResource.title}
                 onChange={(e) => setNewResource((prev: any) => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newResource.description}
                 onChange={(e) => setNewResource((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={newResource.url}
                 onChange={(e) => setNewResource((prev: any) => ({ ...prev, url: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={newResource.type}
                 onChange={(e) => setNewResource((prev: any) => ({ ...prev, type: e.target.value as Resource['type'] }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  value={newResource.level}
                 onChange={(e) => setNewResource((prev: any) => ({ ...prev, level: e.target.value as Resource['level'] }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="o-level">O-Level</option>
                  <option value="a-level">A-Level</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={newResource.category}
                 onChange={(e) => setNewResource((prev: any) => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddingResource(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResource}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}