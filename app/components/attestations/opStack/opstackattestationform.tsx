import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import SmileyRatingScale from '@/app/components/ui/SmileyRatingScale';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getSmileyRatingLabel } from '@/src/utils/helpers';

interface OPStackAttestationFormProps {
    smileyRating: number;
    feedback: string;
    setFeedback: (feedback: string) => void;
    onSubmit: (formData: any) => void;
    onClose: () => void;
}


const OPStackAttestationForm: React.FC<OPStackAttestationFormProps> = ({
    smileyRating,
    feedback,
    setFeedback,
    onSubmit,
    onClose,
}) => {
    const [localSmileyRating, setLocalSmileyRating] = useState(smileyRating);
    const [localFeedback, setLocalFeedback] = useState(feedback);

    const additionalInfo = [
        "The absence of this tool would have little to no impact on my work.",
        "The absence of this tool would cause considerable inconvenience.",
        "The absence of this tool would significantly disrupt my work."
      ];

    const handleSubmit= () => {

        if (localSmileyRating === 0 || undefined ) {
            alert("Please leave rating, Neutral, Slighly Upset or Extremely Upset.");
            return; // Prevent form submission
          }
        //convert smiley rating to label
        const smileyRatingLabel = getSmileyRatingLabel(localSmileyRating);
          
        const formData = {
            feeling_if_didnt_exist: smileyRatingLabel,
            feeling_if_didnt_exist_number: localSmileyRating,
            explanation: localFeedback,
        };
        onSubmit(formData);
    };

    return(
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center text-black" onClick={onClose}>
            <div
                className="relative m-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-2/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
                onClick={(e) => e.stopPropagation()}
            >
                <>
                {/* Close Button */}
                <button 
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" 
                    onClick={onClose}
                >
                    <RxCross2 className="h-6 w-6" />
                </button>
                    <h2 className="text-xl font-bold mb-4 text-center">Attest to Contribution</h2>

                    {/* Q1 */}
                    <div className="mb-6">
                        <h3 className='font-semibold text-center'>How would you feel if this contribution did not exist?</h3>
                        <SmileyRatingScale 
                            rating={localSmileyRating} 
                            handleRating={setLocalSmileyRating} 
                            additionalInfo={additionalInfo}/>
                    </div>
                    <hr className="my-4" />

                    {/* Q2 */}
                    <div className="mb-8">
                        <h3 className='font-semibold text-center'>Tell us more about why you chose this answer.</h3>
                        <textarea
                            className="w-full p-2 border border-lime-900/30 rounded-md"
                            rows={4}
                            value={localFeedback}
                            onChange={(e) => setLocalFeedback(e.target.value)}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center">
                        <button
                            className="btn text-sm  items-center font-medium text-white bg-black rounded-md shadow-sm hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </>
            </div>
        </div>
    );
}

export default OPStackAttestationForm;