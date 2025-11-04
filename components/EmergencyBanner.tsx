import React from 'react';

interface EmergencyBannerProps {
  reason: string;
}

const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ reason }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
      <div className="flex">
        <div className="py-1">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <div>
          <p className="font-bold">⚠️ Emergency Symptom Flagged</p>
          <p className="text-sm">{reason}</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
