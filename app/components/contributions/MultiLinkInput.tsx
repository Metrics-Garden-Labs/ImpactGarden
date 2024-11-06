import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

interface MultiLinkInputProps {
  links: string[];
  setLinks: (links: string[]) => void;
}

const MultiLinkInput: React.FC<MultiLinkInputProps> = ({ links, setLinks }) => {
  const [currentLink, setCurrentLink] = useState('');

  const addLink = () => {
    if (currentLink && !links.includes(currentLink)) {
      setLinks([...links, currentLink]);
      setCurrentLink('');
    }
  };

  const removeLink = (linkToRemove: string) => {
    setLinks(links.filter(link => link !== linkToRemove));
  };

  return (
    <div className="mb-4">
      <div className="flex mb-2">
        <input
          type="text"
          value={currentLink}
          onChange={(e) => setCurrentLink(e.target.value)}
          placeholder="Add a link"
          className="flex-grow p-2 border border-lime-900/30 rounded-l-md"
        />
        <button
          type="button"
          onClick={addLink}
          className="px-4 py-2 bg-black text-white rounded-r-md hover:bg-gray-800"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex items-center bg-gray-100 p-2 rounded-md">
            <span className="flex-grow truncate">{link}</span>
            <button
              type="button"
              onClick={() => removeLink(link)}
              className="ml-2 text-gray-500 hover:text-red-500"
            >
              <RxCross2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiLinkInput;