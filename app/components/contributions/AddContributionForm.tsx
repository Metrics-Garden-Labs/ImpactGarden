
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaInfoCircle } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { higherCategoryKey } from '@/src/types';
import TextAreaField from '../ui/TextAreaField'; // Assuming you created this as per the previous refactor.
import { getSubcategories, higherCategories, Subcategory, Category } from '@/src/utils/addContributionModalUtils';

interface AddContributionFormProps {
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (event: React.FormEvent) => void;
  handleHigherCategoryChange: (category: higherCategoryKey) => void;
  handleSubcategorySelect: (subcategory: Subcategory) => void;
  selectedHigherCategory: higherCategoryKey | null;
  isLoading: boolean;
  onClose: () => void;
  renderModal: () => JSX.Element | null;
}


const subcategoriesInfo = {
  Governance: [
    {
      title: "Infra and Tooling",
      description: "Infrastructure and tooling which powers governance and makes governance functionality accessible."
    },
    {
      title: "Governance Research and Analytics",
      description: "Research which provides insights into Optimism governance performance and meta governance design."
    },
    {
      title: "Collaboration and Onboarding",
      description: "Contributions that facilitate governance participants to collaborate with each other and enable the onboarding of newcomers."
    },
    {
      title: "Governance Structures",
      description: "Elected or Appointed contributor structures to the Optimism Collective."
    }
  ],
  'OP Stack': [
    {
      title: "Ethereum Core Contributions",
      description: "Ethereum Core Contributions are infrastructure which supports, or is a dependency, of the OP Stack."
    },
    {
      title: "OP Stack Research & Development",
      description: "Direct research & development contributions to the OP Stack, and contributions that support protocol upgrades."
    },
    {
      title: "OP Stack Tooling",
      description: "Efforts that improve the usability and accessibility of the OP Stack through tooling enhancements."
    }
  ],
  'Onchain Builders': [
    {
      title: "CeFi",
      description: "Centralized finance products including exchanges, trading, market-making platforms and others."
    },
    {
      title: "Cross Chain",
      description: "Projects that facilitate cross chain communication or bridging assets across chains."
    },
    {
      title: "DeFi",
      description: "Decentralized finance products including exchanges, lending, staking, insurance, real-world asset, indexes and others."
    },
    {
      title: "Governance",
      description: "Projects that facilitate decentralized governance with community management, delegation, voting, etc."
    },
    {
      title: "NFT",
      description: "NFT marketplaces, collections, NFT finance and others."
    },
    {
      title: "Social",
      description: "Projects with a social component, including community, gaming, gambling, and media."
    },
    {
      title: "Utility",
      description: "Projects related to tooling including dev tooling, middleware, identity tooling, account abstraction, payments, oracles and others."
    }
  ]
};

const AddContributionForm: React.FC<AddContributionFormProps> = ({
  formData,
  setFormData,
  handleSubmit,
  handleHigherCategoryChange,
  handleSubcategorySelect,
  selectedHigherCategory,
  isLoading,
  onClose,
  renderModal,
}) => {
  const [showSubcategoryInfo, setShowSubcategoryInfo] = useState(false);

  const toggleSubcategoryInfo = () => {
    setShowSubcategoryInfo(!showSubcategoryInfo);
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-2/3 lg:w-2/5 max-h-[90vh] overflow-y-auto mx-4 md:mx-20" onClick={(e) => e.stopPropagation()}>
        <form className="bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="text-left pt-8 p-2">
            <h2 className="text-xl font-bold mb-2">Add New Contribution</h2>
          </div>

          <div className="mb-2 items-center py-3 ">
            <div>
              <h2 className="font-semibold mt-2 mb-1">Category <span className='text-[#24583C]'> * </span></h2>
              <p className='text-sm text-[#B5B5B6] mb-2'>Choose the Optimism RetroRound your project is applying to.</p>
              <div className="flex flex-wrap mt-2">
                {Object.keys(higherCategories).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleHigherCategoryChange(key as higherCategoryKey)}
                    aria-required="true"
                    className={`mb-2 mr-2 px-4 py-2 rounded-lg text-sm ${selectedHigherCategory === key ? 'bg-[#2C3F2D] text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {higherCategories[key as higherCategoryKey]}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-8">
              <h2 className="text-left font-semibold">Subcategory<span className='text-[#E67529]'> * </span> </h2>
              <p className='text-sm text-[#B5B5B6]'>Choose a single subcategory that best applies to this contribution</p>
              <div className="flex flex-wrap justify-center mt-2 max-h-32 md:max-h-64 overflow-y-auto p-2 rounded-lg">
              {getSubcategories(selectedHigherCategory as Category).map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  aria-required="true"
                  className={`mb-2 mr-2 px-4 py-2 rounded-lg text-sm ${formData.subcategory === subcategory ? 'bg-[#2C3F2D] text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {subcategory}
                </button>
              ))}
            </div>

            {selectedHigherCategory && subcategoriesInfo[selectedHigherCategory as keyof typeof subcategoriesInfo] && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={toggleSubcategoryInfo}
                    className="flex items-center text-sm text-[#B5B5B6] hover:text-[#2C3F2D]"
                  >
                    {showSubcategoryInfo ? 'Hide' : 'Show'} {selectedHigherCategory} Subcategories Info
                    {showSubcategoryInfo ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                  </button>
                  {showSubcategoryInfo && (
                    <div className="mt-2 p-4 bg-white rounded-lg ">
                      {subcategoriesInfo[selectedHigherCategory as keyof typeof subcategoriesInfo].map((info, index) => (
                        <div key={index} className="mb-4 last:mb-0">
                          <h3 className="font-semibold text-[#2C3F2D]">{info.title}</h3>
                          <p className="text-sm text-gray-600">{info.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


          <TextAreaField
            label="Name of your Contribution"
            value={formData.contribution}
            onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
            placeholder="Contribution Title"
            required
            maxLength={100}
          />

          <TextAreaField
            label="Description"
            value={formData.desc ?? ''}
            description='Introduce your contribution to the ecosystem. Share what this contribution is about.'
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="Add a description"
            required
            maxLength={200}
          />

          <TextAreaField
            label="Link/Evidence"
            value={formData.link ?? ''}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="Add a link"
            required
          />

          <div className="mb-4 text-center">
            <button className="btn text-sm  items-center font-medium text-white bg-black rounded-md shadow-sm hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Contribution'}
            </button>
          </div>
          <button onClick={onClose} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
            <RxCross2 className="w-5 h-5" />
          </button>
        </form>
        {renderModal()}
      </div>
    </div>
  );
};

export default AddContributionForm;
