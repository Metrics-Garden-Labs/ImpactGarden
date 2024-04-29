// AddContributionModal.tsx
'use client';
import React, { useState } from 'react';
import { useGlobalState } from '@/src/config/config';
import { Contribution } from '@/src/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  addContribution: (contribution: Contribution) => Promise<void>;
}



export default function AddContributionModal({ isOpen, onClose, addContribution }: Props) {

    const [fid] = useGlobalState('fid');
    const [ walletAddress] = useGlobalState('walletAddress');
    const [formData, setFormData] = useState<Contribution>({userFid: fid, projectName: '', contribution: '', desc: '', link: '', ethAddress: walletAddress});

    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await addContribution(formData);
    onClose();
    };

    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <form className="bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
        <h2>Add New Contribution</h2>
        {/* Input fields for contribution details */}
        {/* at some point the projectname will be passed in as a prop, same with eth address */}
        <input
            value={formData.projectName}
            onChange={e => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="Project Name"
            required
        />
        <input
            value={formData.contribution}
            onChange={e => setFormData({ ...formData, contribution: e.target.value })}
            placeholder="Contribution Title"
            required
        />
        <textarea
            value={formData.desc}
            onChange={e => setFormData({ ...formData, desc: e.target.value })}
            placeholder="Description"
        />
        <input
            value={formData.link}
            onChange={e => setFormData({ ...formData, link: e.target.value })}
            placeholder="Link/Evidence"
        />
        <button  className='btn' type="submit">Add Contribution</button>
        <button onClick={onClose}>Cancel</button>
        </form>
    </div>
    );
}
