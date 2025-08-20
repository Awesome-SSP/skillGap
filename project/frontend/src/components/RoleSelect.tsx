import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, Briefcase } from 'lucide-react'
import { apiService } from '../services/api'

interface RoleSelectProps {
  selectedRole: string | null
  onRoleSelect: (role: string) => void
  error?: string | null
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
  selectedRole,
  onRoleSelect,
  error = null
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const fetchedRoles = await apiService.getRoles()
        setRoles(fetchedRoles)
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load roles')
        console.error('Error fetching roles:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredRoles = roles.filter(role =>
    role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRoleSelect = (role: string) => {
    onRoleSelect(role)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Target Job Role
      </label>
      
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 
          rounded-lg text-left focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          transition-colors duration-200 hover:border-primary-300
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
        `}
      >
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-gray-400" />
          <span className={selectedRole ? 'text-gray-900' : 'text-gray-500'}>
            {isLoading 
              ? 'Loading roles...' 
              : selectedRole || 'Select a target role'
            }
          </span>
        </div>
        
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                autoFocus
              />
            </div>
          </div>

          {/* Role Options */}
          <div className="max-h-60 overflow-y-auto">
            {loadError ? (
              <div className="p-3 text-center text-red-600">
                <p className="font-medium">Error loading roles</p>
                <p className="text-sm">{loadError}</p>
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                {searchTerm ? 'No roles match your search' : 'No roles available'}
              </div>
            ) : (
              filteredRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`
                    w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors duration-150
                    ${selectedRole === role ? 'bg-primary-100 text-primary-700' : 'text-gray-900'}
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span>{role}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}