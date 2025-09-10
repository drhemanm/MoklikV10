import React from 'react';
import { Book, Users, GraduationCap, User } from 'lucide-react';
import { userService } from '../../services/firebase/user';

interface RoleSelectionProps {
  userId: string;
  onComplete: () => void;
}

export function RoleSelection({ userId, onComplete }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const roles = [
    { id: 'student', label: 'Student', icon: Book, description: 'I am a student looking to improve my math skills' },
    { id: 'parent', label: 'Parent', icon: Users, description: 'I am a parent supporting my child\'s education' },
    { id: 'teacher', label: 'Teacher', icon: GraduationCap, description: 'I am a teacher guiding students' },
    { id: 'other', label: 'Other', icon: User, description: 'I am interested in learning mathematics' }
  ];

  const handleSubmit = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    try {
      await userService.updateUserRole(userId, selectedRole);
      onComplete();
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Moklik!</h2>
          <p className="mt-2 text-gray-600">Please tell us a bit about yourself</p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedRole === role.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    selectedRole === role.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      selectedRole === role.id ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-medium ${
                      selectedRole === role.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {role.label}
                    </h3>
                    <p className={`text-sm ${
                      selectedRole === role.id ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
          className="mt-8 w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Setting up your account...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}