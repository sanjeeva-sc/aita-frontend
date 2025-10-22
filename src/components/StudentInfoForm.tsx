import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, IdCard } from 'lucide-react';

interface StudentInfo {
  name: string;
  uid: string;
}

interface StudentInfoFormProps {
  onSubmit: (studentInfo: StudentInfo) => void;
  quizTitle?: string;
}

const StudentInfoForm: React.FC<StudentInfoFormProps> = ({ onSubmit, quizTitle }) => {
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const [errors, setErrors] = useState<{ name?: string; uid?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; uid?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Student name is required';
    }

    if (!uid.trim()) {
      newErrors.uid = 'Student UID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        name: name.trim(),
        uid: uid.trim()
      });
    } catch (error) {
      console.error('Error submitting student info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUid(e.target.value);
    if (errors.uid) {
      setErrors(prev => ({ ...prev, uid: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Student Information
          </CardTitle>
          <CardDescription className="text-gray-600">
            {quizTitle ? (
              <>Please enter your information to take: <span className="font-medium">{quizTitle}</span></>
            ) : (
              'Please enter your information before starting the quiz'
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Student Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={handleNameChange}
                  className={`pl-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.name}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Student UID Field */}
            <div className="space-y-2">
              <Label htmlFor="uid" className="text-sm font-medium text-gray-700">
                Student UID
              </Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="uid"
                  type="text"
                  placeholder="Enter your student ID"
                  value={uid}
                  onChange={handleUidChange}
                  className={`pl-10 ${errors.uid ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.uid && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.uid}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Starting Quiz...
                </>
              ) : (
                'Start Quiz'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentInfoForm;