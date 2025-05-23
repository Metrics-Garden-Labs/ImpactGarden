import React, { useState } from "react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";

interface OnboargingCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  userFid: string;
}

const steps = [
  {
    image: "/onboarding_one_.jpg",
    title: "Welcome to this experiment",
    description: (
      <>
        We{"'"}re interested in understanding which tools have been useful and
        enabled your participation in Optimisms governance.{" "}
        <strong>
          To start, make sure your Badgeholder or Delegate wallet is linked to
          your connected Farcaster account to ensure your ratings are included.
        </strong>
      </>
    ),
  },
  {
    image: "/onboarding_two.jpg",
    title: "Projects to Rate",
    description: (
      <>
        <strong>
          You will be rating projects only in the tooling & infra
          sub-category.
        </strong>{" "}
        Please only rate projects you have used.{" "}
        <strong>Do NOT rate any projects you have COIs with.{""}</strong>
        Try to rate as many projects as you can.
      </>
    ),
  },
  {
    image: `/onboarding_three.jpg`,
    title: `Rate a project by clicking on it`,
    description: (
      <>
        <strong>
          Read through the description of the project and then click on {"“"}
          Rate{"”"} to start your ratings.
        </strong>{" "}
        The rating is made up of 3 questions. That{"'"}s it!
      </>
    ),
  },
  {
    image: `/onboarding_four.jpg`,
    title: `Submit, and... Next!`,
    description: (
      <>
        After completing the rating of a project,{" "}
        <strong>
          it will be marked with a Reviewed stamp. Close the project and select
          another one to rate!
        </strong>
      </>
    ),
  },
];

const OnboargingCarousel: React.FC<OnboargingCarouselProps> = ({
  isOpen,
  onClose,
  userFid,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentStep(index);
  };

  const handleStartReviewing = () => {
    onClose(); // Cierra el modal al hacer clic en "Start Reviewing"
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) =>
      prevStep === 0 ? steps.length - 1 : prevStep - 1
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center text-black justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-2/5 h-4/5 overflow-hidden relative">
        <button
          className="absolute top-4 right-4 text-black hover:text-gray-800"
          onClick={onClose} // Cierra el modal al hacer clic en la cruz
        >
          <RxCross2 className="h-6 w-6" />
        </button>
        <div className="flex flex-col items-center pt-3 justify-center h-full">
          <div className="flex flex-col items-center pt-4 h-[500px]">
            <Image
              src={steps[currentStep].image}
              alt={steps[currentStep].title}
              width={550}
              height={250}
              className="object-cover"
            />
            <h2 className="text-5xl leading-11  px-10  w-full">
              {steps[currentStep].title}
            </h2>
            <p className="px-10 mt-4 text-base">
              {steps[currentStep].description}
            </p>
          </div>
          {currentStep === steps.length - 1 && ( // Solo mostrar el botón en el último paso
            <button
              className=" px-4 py-2 -mt-11 bg-[#424242] text-white rounded-md hover:bg-black"
              onClick={handleStartReviewing}
            >
              Start Rating
            </button>
          )}
          <div className="flex items-center justify-center mt-6 mb-4 w-full px-4">
            <button onClick={handlePrevious} className="text-2xl pb-[3px]">
              {"<"}
            </button>
            <div className="flex items-center p-2 justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    currentStep === index ? "bg-[#424242]" : "bg-gray-400"
                  }`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
            <button onClick={handleNext} className="text-2xl pb-[3px]">
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboargingCarousel;
