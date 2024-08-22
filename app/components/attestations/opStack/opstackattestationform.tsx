import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import SmileyRatingScale from '@/app/components/ui/SmileyRatingScale';


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

    const handleSubmit= () => {
        const formData = {
            feeling_if_didnt_exist: localSmileyRating.toString(),
            explanation: localFeedback,
        };
        onSubmit(formData);
    };

    return(
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={onClose}>
            <div
                className="relative m-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-2/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
                onClick={(e) => e.stopPropagation()}
            >
                <>
                    <h2 className="text-xl font-bold mb-4 text-center">Attest to Contribution</h2>

                    {/* Q1 */}
                    <div className="mb-6">
                        <h3 className='font-semibold text-center'>How would you feel if this contribution did not exist?</h3>
                        <SmileyRatingScale rating={localSmileyRating} handleRating={setLocalSmileyRating} />
                        <p className='text-sm mt-2'><span className='font-semibold' >Extremely Upset:</span>  The absence of this tool would have little to no impact on my work. </p>
                        <p className='text-sm mt-2'><span className='font-semibold' >Somewhat Upset:</span>  The absence of this tool would cause me considerable inconvience.</p>
                        <p className='text-sm mt-2'><span className='font-semibold' >Neutral:</span>  The absence of this tool would cause me considerable inconvience.</p>

                    </div>
                    <hr className="my-4" />

                    {/* Q2 */}
                    <div className="mb-8">
                        <h3 className='font-semibold text-center'>Tell me more about why you chose this answer.</h3>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                            value={localFeedback}
                            onChange={(e) => setLocalFeedback(e.target.value)}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
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