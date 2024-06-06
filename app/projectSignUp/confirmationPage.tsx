import Image from 'next/image';
import { AttestationData, AttestationNetworkType, Project } from '@/src/types';
import { BsGlobe2 } from 'react-icons/bs';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import { easScanEndpoints } from '../components/easScan';

//--------------------------------------------------------------------------------------------
//Logic for conditionally rendering the confirmation page
interface ConfirmationSectionProps {
    attestationUID: string;
    attestationData: AttestationData;
    imageUrl: string;
    ecosystem: string;
    selectedProject: Project | null;
    selectedNetwork: AttestationNetworkType;
  }
  
  // ConfirmationSection Component Implementation
  const ConfirmationSection: React.FC<ConfirmationSectionProps> = ({
    attestationUID,
    attestationData,
    imageUrl,
    ecosystem,
    selectedProject,
    selectedNetwork
  }) => {
    const user = {
      fid: '',
      username: '',
      ethAddress: '',
    };
    if (!attestationUID) {
      return null; // If no attestationUID, don't show this section
    }
  
    return (
      <div className="w-full bg-white p-8 shadow-lg flex flex-col items-center mx-auto my-10 rounded-lg">
        <Image
          src="/star.png"
          alt="Attestation Created"
          width={75}
          height={75}
          className="object-contain mb-10 mt-10"
        />
        <h2 className="text-4xl font-bold mb-10">Attestation Created</h2>
        <p className="text-lg mb-10">Your project has been successfully created.</p>

          <div className="w-full md:w-2/3 lg:w-1/3 flex flex-col items-center shadow-2xl rounded p-8 mb-8">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Project Logo"
            width={400}
            height={400}
            className="object-contain mt-15"
          />
        ) : (
          <div className="w-48 h-48 bg-gray-300 rounded-md flex items-center justify-center">
            {/* Optional placeholder content */}
          </div>
        )}
        <h3 className="text-center mt-6 mb-6 font-semibold text-gray-500 text-xl sm:text-2xl">
          {attestationData.projectName || 'Project Name'}
        </h3>
        <div className="flex justify-center py-4 items-center">
          <Link href={attestationData.websiteUrl || '#'}>
            <BsGlobe2 className="text-black mx-2 text-xl sm:text-2xl" />
          </Link>
          <Link href={attestationData.twitterUrl || '#'}>
            <FaXTwitter className="text-black mx-2 text-xl sm:text-2xl" />
          </Link>
          <Link href={attestationData.githubURL || '#'}>
            <FaGithub className="text-black mx-2 text-xl sm:text-2xl" />
          </Link>
        </div>
      </div>
  
        <Link href={`/projects/${attestationData.projectName}`} passHref className="pt-6">
          <button className="mt-4 px-6 py-3 bg-black text-white rounded-md text-lg">
            Visit Your Project to Create Your First Contribution!
          </button>
        </Link>
  
        <p className="text-lg mt-8">Attestation UID:</p>
        <Link href={`${easScanEndpoints[selectedNetwork]}${attestationUID}`} passHref>
          <p className="text-lg p-2 underline">{attestationUID}</p>
        </Link> 
        
  
        {/* comment this back in when i have the eas scan link for each project */}
       
        
      </div>
  
    );
  };
  
export default ConfirmationSection;
  
  