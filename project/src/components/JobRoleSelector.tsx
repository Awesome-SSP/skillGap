import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Briefcase } from 'lucide-react';
import { JobRole } from '../types';
import { jobRoles } from '../data/jobRoles';

interface JobRoleSelectorProps {
  selectedRole: JobRole | null;
  onRoleSelect: (role: JobRole) => void;
}

const JobRoleSelector: React.FC<JobRoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredRoles = jobRoles.filter(role =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(jobRoles.map(role => role.category)));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role: JobRole) => {
    onRoleSelect(role);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`
          w-full p-4 border-2 rounded-xl cursor-pointer transition-all duration-300
          hover:border-blue-400 hover:shadow-md transform hover:scale-[1.01]
          ${isOpen 
            ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
            : selectedRole 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 bg-gray-50'
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Briefcase className={`h-5 w-5 ${selectedRole ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              {selectedRole ? (
                <div>
                  <p className="font-semibold text-green-800">{selectedRole.title}</p>
                  <p className="text-sm text-green-600">{selectedRole.category}</p>
                </div>
              ) : (
                <p className="text-gray-500">Select your target job role</p>
              )}
            </div>
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search job roles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {categories.map(category => {
              const categoryRoles = filteredRoles.filter(role => role.category === category);
              
              if (categoryRoles.length === 0) return null;
              
              return (
                <div key={category} className="p-2">
                  <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category}
                  </h4>
                  {categoryRoles.map(role => (
                    <div
                      key={role.id}
                      className="px-3 py-3 cursor-pointer rounded-lg hover:bg-blue-50 transition-colors duration-150 group"
                      onClick={() => handleRoleSelect(role)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-800">
                            {role.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {role.requiredSkills.length} skills required
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            
            {filteredRoles.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <p>No job roles found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRoleSelector;