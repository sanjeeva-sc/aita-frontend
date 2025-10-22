import React, { useState, useEffect } from 'react';
import { Search, Plus, X, BookOpen, Target } from 'lucide-react';

interface Competency {
  id: string;
  name: string;
  description: string;
  subject: string;
  category: string;
}

interface CompetencySelectorProps {
  selectedCompetencies: Competency[];
  onCompetenciesChange: (competencies: Competency[]) => void;
  subject?: string;
}

export const CompetencySelector: React.FC<CompetencySelectorProps> = ({
  selectedCompetencies,
  onCompetenciesChange,
  subject
}) => {
  const [availableCompetencies, setAvailableCompetencies] = useState<Competency[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompetency, setNewCompetency] = useState({
    name: '',
    description: '',
    subject: subject || '',
    category: 'Custom'
  });

  useEffect(() => {
    fetchCompetencies();
  }, [subject]);

  const fetchCompetencies = async () => {
    setIsLoading(true);
    try {
      const url = subject 
        ? `/api/competencies?subject=${encodeURIComponent(subject)}`
        : '/api/competencies';
      
      const response = await fetch(url);
      if (response.ok) {
        const competencies = await response.json();
        setAvailableCompetencies(competencies);
      }
    } catch (error) {
      console.error('Error fetching competencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompetencies = availableCompetencies.filter(comp =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompetencyToggle = (competency: Competency) => {
    const isSelected = selectedCompetencies.some(c => c.id === competency.id);
    
    if (isSelected) {
      onCompetenciesChange(selectedCompetencies.filter(c => c.id !== competency.id));
    } else {
      onCompetenciesChange([...selectedCompetencies, competency]);
    }
  };

  const handleAddCompetency = async () => {
    if (!newCompetency.name || !newCompetency.description || !newCompetency.subject) {
      return;
    }

    try {
      const response = await fetch('/api/competencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCompetency),
      });

      if (response.ok) {
        const createdCompetency = await response.json();
        setAvailableCompetencies([...availableCompetencies, createdCompetency]);
        onCompetenciesChange([...selectedCompetencies, createdCompetency]);
        setNewCompetency({
          name: '',
          description: '',
          subject: subject || '',
          category: 'Custom'
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error creating competency:', error);
    }
  };

  const groupedCompetencies = filteredCompetencies.reduce((groups, comp) => {
    const key = `${comp.subject} - ${comp.category}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(comp);
    return groups;
  }, {} as Record<string, Competency[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Curriculum Standards</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Custom
        </button>
      </div>

      {/* Selected Competencies */}
      {selectedCompetencies.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Standards:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCompetencies.map((comp) => (
              <div
                key={comp.id}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <span>{comp.name}</span>
                <button
                  onClick={() => handleCompetencyToggle(comp)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Competency Form */}
      {showAddForm && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium mb-3">Add Custom Standard</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Standard name"
              value={newCompetency.name}
              onChange={(e) => setNewCompetency({ ...newCompetency, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <textarea
              placeholder="Description"
              value={newCompetency.description}
              onChange={(e) => setNewCompetency({ ...newCompetency, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20 resize-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Subject"
                value={newCompetency.subject}
                onChange={(e) => setNewCompetency({ ...newCompetency, subject: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                placeholder="Category"
                value={newCompetency.category}
                onChange={(e) => setNewCompetency({ ...newCompetency, category: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddCompetency}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Add Standard
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search standards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Available Competencies */}
      <div className="max-h-64 overflow-y-auto space-y-4">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading standards...</div>
        ) : (
          Object.entries(groupedCompetencies).map(([groupName, competencies]) => (
            <div key={groupName} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {groupName}
              </h4>
              <div className="space-y-1 ml-6">
                {competencies.map((comp) => {
                  const isSelected = selectedCompetencies.some(c => c.id === comp.id);
                  return (
                    <div
                      key={comp.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleCompetencyToggle(comp)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{comp.name}</h5>
                          <p className="text-xs text-gray-600 mt-1">{comp.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};