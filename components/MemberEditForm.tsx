
import React, { useState, useEffect, useRef } from 'react';
import { FamilyMember, Role } from '../types';

interface MemberEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: Omit<FamilyMember, 'id'> | FamilyMember) => void;
  memberToEdit?: FamilyMember | null;
}

const ROLES: Role[] = ['Admin', 'Editor', 'Viewer'];

const MemberEditForm: React.FC<MemberEditFormProps> = ({ isOpen, onClose, onSubmit, memberToEdit }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('Viewer');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        if (memberToEdit) {
          setName(memberToEdit.name);
          setRole(memberToEdit.role);
          setAvatarPreview(memberToEdit.avatarUrl);
          setAvatarFile(memberToEdit.avatarUrl);
        } else {
          // Reset form for new member
          setName('');
          setRole('Viewer');
          const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=`;
          setAvatarPreview(defaultAvatar);
          setAvatarFile(defaultAvatar);
        }
    }
  }, [memberToEdit, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setAvatarFile(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const memberData = {
      name,
      role,
      avatarUrl: avatarFile || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };

    if (memberToEdit) {
      onSubmit({ ...memberData, id: memberToEdit.id });
    } else {
      onSubmit(memberData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6">{memberToEdit ? 'Edit Member' : 'Add New Member'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
             <img src={avatarPreview || ''} alt="Avatar preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 mb-4" />
             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
             <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Upload Photo
             </button>
          </div>

          <div>
            <label htmlFor="memberName" className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              id="memberName" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
              required 
            />
          </div>
          <div>
            <label htmlFor="memberRole" className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              id="memberRole" 
              value={role} 
              onChange={e => setRole(e.target.value as Role)} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={memberToEdit?.role === 'Admin'}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {memberToEdit?.role === 'Admin' && (
                <p className="text-xs text-gray-500 mt-1">The Admin role cannot be changed.</p>
            )}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{memberToEdit ? 'Save Changes' : 'Add Member'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberEditForm;