'use client';

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Attestation, EAS, EIP712AttestationParams, NO_EXPIRATION, SchemaEncoder, ZERO_ADDRESS } from '@ethereum-attestation-service/eas-sdk';
import { AttestationNetworkType, Contribution, ContributionAttestation, ContributionAttestationWithUsername, Project } from '@/src/types'; 
import { NEXT_PUBLIC_URL, WHITELISTED_USERS } from '@/src/config/config'; 
import { useGlobalState } from '@/src/config/config'; 
import { LuArrowUpRight } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import { FaCopy } from 'react-icons/fa';
import Link from 'next/link';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import { easScanEndpoints } from '../../src/utils/easScan';
import AttestationCreationModal from '../components/attestationCreationModal';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Import hooks from next/navigation
import AttestationConfirmationModal from '../components/attestationConfirmationModal';
import { useSigner, useEAS   } from '../../src/hooks/useEAS';
import { isMobile } from 'react-device-detect';
import { isAddress } from 'ethers';
import { zeroAddress } from 'viem';
import { Alchemy, Network } from 'alchemy-sdk';


interface AttestationModalProps {
    isOpen: boolean;
    onClose: () => void;
    contribution: Contribution;
    project: Project;
    attestationCount: number;
}

type ImprovementAreaKey = 'participation' | 'understanding' | 'collaboration' | 'information' | 'models';

const AttestationModal: React.FC<AttestationModalProps> = ({
    isOpen,
    onClose,
    contribution,
    project,
    attestationCount,
}) => {
    const [isdelegate, setIsDelegate] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [walletAddress] = useGlobalState('walletAddress');
    const [fid] = useGlobalState('fid');
    const [selectedProject] = useGlobalState('selectedProject');
    const [isLoading, setIsLoading] = useState(false);
    const [attestationUID, setAttestationUID] = useState<string>("");
    const [recentAttestations, setRecentAttestations] = useState<ContributionAttestationWithUsername[]>([]);
    const [recentAttestationsLoading, setRecentAttestationsLoading] = useState(true);
    const [showAttestationForm, setShowAttestationForm] = useState(false);
    const [rating, setRating] = useState(0);
    const NO_EXPIRATION = 0n;
    const zero_uid = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const [user] = useLocalStorage("user", {
        fid: '',
        username: '',
        ethAddress: '',
    });
    const [improvementareas, setImprovementAreas] = useState<{ [key in ImprovementAreaKey]: boolean }>({
        participation: false,
        understanding: false,
        collaboration: false,
        information: false,
        models: false
    });
    const [extrafeedback, setExtraFeedback] = useState('');
    const { eas, currentAddress, address, handleNetworkChange, selectedNetwork } = useEAS();

    const signer = useSigner();

    const labels: { [key in ImprovementAreaKey]: string } = {
        participation: 'Improve my participation in governance',
        understanding: 'Understand how governance works',
        collaboration: 'Collaborate with other governance members',
        information: 'Have more information for decision making',
        models: 'Improve governance models'
    };

    const handleToggle = (area: ImprovementAreaKey) => {
        setImprovementAreas(prev => ({
            ...prev,
            [area]: !prev[area]
        }));
    };

    const isValidKey = (key: any): key is ImprovementAreaKey => {
        return ['participation', 'understanding', 'collaboration', 'information', 'models'].includes(key);
    };

    const handleClick = (key: string) => {
        if (isValidKey(key)) {
            handleToggle(key);
        } else {
            console.error("Invalid key:", key);
        }
    };

    const formatImprovementAreas = (areas: any) => {
        // Extract keys where the value is true
        const activeAreas = Object.keys(areas).filter(key => areas[key]);
        // Join the active areas into a single string separated by commas
        return activeAreas.join(', ');
    };

    const improvementareasstring = formatImprovementAreas(improvementareas);
    console.log('How It Helped:', improvementareasstring);

    const router = useRouter(); // Use useRouter hook
    const pathname = usePathname(); // Use usePathname to get the current path

    useEffect(() => {
        if (isOpen) {
            router.push(`${pathname}?contribution=${contribution.id}`);
        } else {
            router.push(pathname);
        }
    }, [isOpen, contribution.id, router, pathname]);

    useEffect(() => {
        const getContributionAttestations = async () => {
            try {
                console.log('Fetching attestations for contribution:', contribution.contribution);
                const response = await fetch(`${NEXT_PUBLIC_URL}/api/getContributionAttestations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ contribution: contribution.contribution }),
                });
                const responseData = await response.json();
                console.log('Response:', responseData);
                if (responseData && responseData.response) {
                    setRecentAttestations(responseData.response);
                }
            } catch (error) {
                console.error('Error fetching attestations:', error);
            } finally {
                setRecentAttestationsLoading(false);
            }
        };

        if (contribution) {
            getContributionAttestations();
        }
    }, [contribution]);

    const handleRating = (rate: number) => {
        setRating(rate); // Update the rating state
        console.log("Rating set to: ", rate); // Debugging or further use
    };

    const addContributionAttestation = async (attestationUID: string) => {
        try {
            const newAttestation = {
                userFid: user.fid,
                projectName: contribution?.projectName,
                contribution: contribution.contribution,
                ecosystem: contribution?.ecosystem,
                attestationUID: attestationUID,
                attesterAddy: walletAddress,
                rating: rating,
                improvementareas: improvementareasstring,
                feedback: feedback,
                extrafeedback: extrafeedback,
                isdelegate: isdelegate ? true : false, 
            };
            console.log('New Attestation:', newAttestation);

            const response = await fetch(`${NEXT_PUBLIC_URL}/api/addContributionAttestationDb`, {
                method: 'POST',
                body: JSON.stringify(newAttestation),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const dbResponse = await response.json();
            console.log('DB Response, insert attestation success:', dbResponse);
        } catch (error) {
            console.error('Error adding attestation to db:', error);
        }
    };

    const toggleAttestationForm = () => {
        setShowAttestationForm(!showAttestationForm);
    };
    const isValidEthereumAddress = (address : string): boolean => {
        return isAddress(project.ethAddress);
    };


    const createAttestation = async () => {
        console.log('user.fid:', user.fid);
        if (!user.fid) {
            alert('User not logged in');
            return;
        }

        if (!eas || !currentAddress) {
            alert('Please connect your wallet to continue');
            return;
        }

        if (!signer) {
            console.error('Signer not available');
            return;
          }

        const recipientAddress = project.ethAddress && isValidEthereumAddress(project.ethAddress) ? project.ethAddress : zeroAddress;

        
        console.log('contribution:', contribution);
        console.log('projectethAddress:', project.ethAddress);  

        try {
            setIsLoading(true);

            console.log('Faracaster:', user.fid);
            console.log('Contribution:', contribution.contribution);
            console.log('Rating:', rating);
            console.log('HowItHelped:', improvementareasstring);
            console.log('IsDelegate:', isdelegate);
            console.log('Feedback:', feedback);
            console.log('ExtraFeedback:', extrafeedback);

            const attestationSchema = "0x5f5afd9626d9d0cd46c7de120032c2470da00c4be9bcef1dd75fa8c074f17e70";
            const schemaEncoder = new SchemaEncoder('string Farcaster, string Contribution, uint8 Rating, string HowItHelped, bool IsDelegate, string Feedback');
            const encodedData = schemaEncoder.encodeData([
                { name: 'Farcaster', type: 'string', value: user.fid },
                { name: 'Contribution', type: 'string', value: contribution.contribution },
                { name: 'Rating', type: 'uint8', value: rating },
                { name: 'HowItHelped', type: 'string', value: improvementareasstring },
                { name: 'IsDelegate', type: 'bool', value: isdelegate },
                { name: 'Feedback', type: 'string', value: feedback },
            ]);
            console.log("enoceDatainfo:", user.fid, contribution, rating, improvementareasstring, isdelegate, feedback );

            const easop = new EAS('0x4200000000000000000000000000000000000021'); // Ensure you have the correct contract address for your EAS instance
          
            easop.connect(signer);
            const delegatedSigner = await easop.getDelegated();
            const easnonce = await easop.getNonce(currentAddress);
            
            const attestation: EIP712AttestationParams = {
                schema: attestationSchema,
                recipient: project.ethAddress || ZERO_ADDRESS,
                expirationTime: NO_EXPIRATION,
                revocable: true,
                refUID: project.primaryprojectuid || contribution.easUid || zero_uid,
                data: encodedData,
                value: 0n,
                deadline: NO_EXPIRATION,
                nonce: easnonce,
            };
            console.log('Attestationuid reference:', project.primaryprojectuid || contribution.easUid || zero_uid);
            console.log('Attestation:', attestation);

            const signDelegated = await delegatedSigner.signDelegatedAttestation(attestation, signer);
            console.log('Sign Delegated:', signDelegated);
            attestation.data = encodedData;
            const signature = signDelegated.signature;

            const dataToSend = {
                ...attestation,
                signature: signature,
                attester: currentAddress,
            };

            const serializedData = JSON.stringify(dataToSend, (key, value) =>
                typeof value === 'bigint' ? '0x' + value.toString(16) : value
            );

            const response = await fetch(`${NEXT_PUBLIC_URL}/api/delegateAttestation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: serializedData,
            });
            const responseData = await response.json();
            console.log('Response:', responseData);

            if (responseData.success && responseData.attestationUID) {
                console.log('Attestation UID:', responseData.attestationUID);
                setAttestationUID(responseData.attestationUID);
                await addContributionAttestation(responseData.attestationUID);
            } else {
                console.error('Failed to retrieve attestation UID from the API response');
            }
        } catch (error) {
            console.error('Error creating attestation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isWebShareSupported = !!navigator.share;
    const copyToClipboard = () => {
        const shareUrl = `${window.location.origin}${pathname}?contribution=${contribution.id}`;
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            alert('Link copied to clipboard!');
            if (isWebShareSupported) {
              return navigator.share({
                title: 'Share Contribution Link',
                text: 'Check out this contribution:',
                url: shareUrl,
              });
            }
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
          });
      };

    if (!isOpen) return null;

    const renderModal = () => {
        if (isLoading) {
            return (
                AttestationCreationModal()
            );
        } else if (attestationUID) {
            return (
                <AttestationConfirmationModal
                    attestationUID={attestationUID}
                    attestationType={contribution}
                    setAttestationUID={setAttestationUID}
                    easScanEndpoints={easScanEndpoints}
                />
            );
        }
        return null;
    };

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
                onClick={(e) => e.stopPropagation()}
            >
                    <>
                        <h2 className="text-xl font-bold mb-4 text-center">
                            Attest to Contribution
                        </h2>

                        <div className="mb-4">
                            <h3 className="font-semibold text-center">Rate this Contribution</h3>
                            <div className="rating mb-4 flex justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <label key={star}>
                                        <input 
                                            type="radio" 
                                            name="rating" 
                                            className="mask mask-star-2 bg-gray-300 hidden" // Hide default radio button
                                            onChange={() => handleRating(star)}
                                            checked={rating === star}
                                        />
                                        <div
                                            className={`inline-block cursor-pointer p-1 ${rating >= star ? 'text-black' : 'text-gray-300'}`}
                                            onClick={() => handleRating(star)}
                                            style={{ fontSize: "36px" }}
                                        >
                                            &#9733; {/* Star icon */}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <h3 className="font-semibold text-center mt-4">This contribution helped me to:</h3>
                        <div className="flex flex-col items-start mt-2 mb-4 px-4">
                            {Object.entries(improvementareas).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => handleClick(key)}
                                    className={`mb-2 px-4 py-2 rounded-lg w-full text-left text-sm ${value ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                                >
                                    {value ? '✓' : '+'} {labels[key as ImprovementAreaKey]}
                                </button>
                            ))}
                        </div>

                        <div className="mb-4">
                            <label className="flex items-center text-center">
                                <input
                                    type="checkbox"
                                    checked={isdelegate}
                                    onChange={(e) => setIsDelegate(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-indigo-600"
                                />
                                <span className="ml-2 text-gray-700">I am a delegate in this ecosystem</span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                How did it help you improve your participation:
                            </label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                rows={4}
                                maxLength={200}
                            />
                            <div className="text-right mr-2">{feedback.length}/200</div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Anything else you would like to share?
                            </label>
                            <textarea
                                value={extrafeedback}
                                onChange={(e) => setExtraFeedback(e.target.value)}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                rows={4}
                                maxLength={200}  // Set maximum length for additional feedback
                            />
                            <div className="text-right mr-2">{extrafeedback.length}/200</div>
                        </div>
                        <div className="mb-4 text-center py-3 p-3">
                            {/* <button 
                                className='btn text-center bg-headerblack text-white hover:bg-blue-500 mr-4'
                                onClick={toggleAttestationForm}
                            >
                                Back
                            </button> */}
                            <button
                                className="btn text-center bg-headerblack text-white hover:bg-blue-500 "
                                onClick={createAttestation}
                            >
                                Send Review
                            </button>
                        </div>
                    </>
                

                        {/* <div className="mb-4">
                            <h3 className="font-semibold text-center">Insights</h3>
                            <p className="text-center">
                                {attestationCount > 0 ? (
                                    <>This contribution has been attested to {attestationCount} times</>
                                ) : (
                                    <>This contribution has not been attested to yet</>
                                )}
                            </p>
                        </div>

                        {attestationCount > 0 && (
                            <div className="mb-4">
                                {recentAttestationsLoading ? (
                                    <ul>
                                        {[1, 2, 3].map((_, index) => (
                                            <li key={index} className="animate-pulse">
                                                <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
                                                <div className="bg-gray-200 h-4 w-1/2 mb-2 rounded"></div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : recentAttestations.length > 0 ? (
                                    <ul>
                                        {recentAttestations.map((attestation, index) => {
                                            console.log('attestation object:', attestation);
                                            const attestationLink = `${easScanEndpoints[contribution?.ecosystem as AttestationNetworkType]}${attestation.attestationUID}`;
                                            console.log('Attestation Link:', attestationLink);
                                            console.log('attestationuid:', attestation.attestationUID);

                                            return (
                                                <li key={index}>
                                                    <Link href={attestationLink}>
                                                        <p>
                                                            <strong>{attestation.username}</strong> said: {attestation.feedback}
                                                        </p>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                ) : (
                                    <p></p>
                                )}
                            </div> 
                        )}*/}

                <button
                    onClick={onClose}
                    className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4"
                >
                    <RxCross2 className="w-5 h-5" />
                </button>
            </div>
            {renderModal()}
        </div>
    );
};

export default AttestationModal;
