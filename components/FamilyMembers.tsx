
import React, { useState } from 'react';
import { FamilyMember, Role } from '../types';
import { EditIcon, TrashIcon, PlusCircleIcon } from './icons';
import MemberEditForm from './MemberEditForm';

interface FamilyMembersProps {
    familyMembers: FamilyMember[];
    onAddOrUpdateMember: (member: Omit<FamilyMember, 'id'> | FamilyMember) => void;
    onDeleteMember: (id: string) => void;
    currentUserRole: Role;
}

const FamilyMembers: React.FC<FamilyMembersProps> = ({ familyMembers, onAddOrUpdateMember, onDeleteMember, currentUserRole }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);
    const canEdit = currentUserRole === 'Admin'; // Only Admins can edit members

    const handleAddMember = () => {
        setMemberToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditMember = (member: FamilyMember) => {
        setMemberToEdit(member);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (member: Omit<FamilyMember, 'id'> | FamilyMember) => {
        onAddOrUpdateMember(member);
        setIsFormOpen(false);
        setMemberToEdit(null);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Family Members</h2>
                {canEdit && (
                    <button
                        onClick={handleAddMember}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        Add Member
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {familyMembers.map(member => (
                    <div key={member.id} className="bg-white p-6 rounded-xl shadow-md text-center group relative">
                        <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200" />
                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                        <p className="text-indigo-600 font-semibold">{member.role}</p>
                        {canEdit && (
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditMember(member)} className="p-2 bg-gray-100 rounded-full text-blue-500 hover:bg-blue-100">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                {member.role !== 'Admin' && (
                                    <button onClick={() => onDeleteMember(member.id)} className="p-2 bg-gray-100 rounded-full text-red-500 hover:bg-red-100">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <MemberEditForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                memberToEdit={memberToEdit}
            />
        </div>
    );
};

export default FamilyMembers;