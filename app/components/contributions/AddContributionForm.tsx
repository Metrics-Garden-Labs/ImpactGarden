import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
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
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20" onClick={(e) => e.stopPropagation()}>
        <form className="bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="text-center pt-8 p-2">
            <h2 className="text-xl font-bold mb-4">Add New Contribution</h2>
          </div>

          <div className="mb-4 items-center py-3 max-h-96 ">
            <h3 className="font-semibold text-center mb-2">Type of Contribution</h3>

            <div>
              <h2 className="font-semibold mt-4">Category *</h2>
              <div className="flex flex-wrap mt-2">
                {Object.keys(higherCategories).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleHigherCategoryChange(key as higherCategoryKey)}
                    className={`mb-2 mr-2 px-4 py-2 rounded-lg text-sm ${selectedHigherCategory === key ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {higherCategories[key as higherCategoryKey]}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-8">
              <h2 className="text-center">What is the subcategory?</h2>
              <div className="flex flex-wrap justify-center mt-4 h-48 overflow-y-auto p-2">
                {getSubcategories(selectedHigherCategory as Category).map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => handleSubcategorySelect(subcategory)}
                    className={`mb-2 mr-2 px-4 py-2 rounded-lg text-sm ${formData.subcategory === subcategory ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <TextAreaField
            label="Title"
            value={formData.contribution}
            onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
            placeholder="Contribution Title"
            required
            maxLength={100}
          />

          <TextAreaField
            label="Description"
            value={formData.desc ?? ''}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="Description"
            required
            maxLength={200}
          />

          <TextAreaField
            label="Link/Evidence"
            value={formData.link ?? ''}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="Link/Evidence"
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
