import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ClinicalSummary, NlpInsights } from '../types';
import Loader from './Loader';
import EmergencyBanner from './EmergencyBanner';
import CodeBadge from './CodeBadge';

interface SummaryOutputProps {
  summary: ClinicalSummary | null;
  isLoading: boolean;
  error: string | null;
}

const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const SummarySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
    <h3 className="text-md font-bold text-sky-800 mb-2 border-b border-sky-200 pb-2">{title}</h3>
    <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap">{children}</div>
  </div>
);

const InsightList: React.FC<{ items: string[] }> = ({ items }) => {
    if (items.length === 0) {
        return <span className="text-xs text-slate-500 italic">None detected.</span>;
    }
    return (
        <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => (
                <li key={index} className="text-sm text-slate-700">{item}</li>
            ))}
        </ul>
    );
};


const NlpInsightsSection: React.FC<{ insights: NlpInsights }> = ({ insights }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-md font-bold text-sky-800 mb-3 border-b border-sky-200 pb-2">Clinical Insights (NLP)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
              <h4 className="text-sm font-semibold text-slate-600 mb-2">Sentiment</h4>
              <InsightList items={insights.sentiment} />
          </div>
           <div>
              <h4 className="text-sm font-semibold text-slate-600 mb-2">Negations</h4>
              <InsightList items={insights.negations} />
          </div>
           <div>
              <h4 className="text-sm font-semibold text-slate-600 mb-2">Temporal Information</h4>
              <InsightList items={insights.temporalInformation} />
          </div>
      </div>
    </div>
);


const SummaryOutput: React.FC<SummaryOutputProps> = ({ summary, isLoading, error }) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    const input = summaryRef.current;
    if (!input) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = canvasWidth / canvasHeight;
      const widthInPdf = pdfWidth - 20; // with 10mm margin on each side
      const heightInPdf = widthInPdf / ratio;

      if (heightInPdf > pdfHeight - 20) {
          // TODO: Handle content that overflows a single page if necessary
          console.warn("Content might be too long for a single PDF page.");
      }
      
      pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, heightInPdf);
      pdf.save('clinical-summary.pdf');

    } catch (err) {
      console.error("Failed to export PDF:", err);
      // Optionally, set an error state to show the user
    } finally {
      setIsExporting(false);
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-600 bg-red-50 p-6 rounded-lg">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (!summary) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
          <p className="font-semibold">Summary Will Appear Here</p>
          <p className="text-sm">Enter a note and click "Summarize Note" to begin.</p>
        </div>
      );
    }
    return (
      <div ref={summaryRef} className="p-1"> {/* Added padding for canvas capture */}
          <div className="space-y-4">
            {summary.isEmergency && <EmergencyBanner reason={summary.emergencyReason} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummarySection title="Subjective (S)">{summary.subjective}</SummarySection>
                <SummarySection title="Objective (O)">{summary.objective}</SummarySection>
                <SummarySection title="Assessment (A)">{summary.assessment}</SummarySection>
                <SummarySection title="Plan (P)">{summary.plan}</SummarySection>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-md font-bold text-sky-800 mb-2 border-b border-sky-200 pb-2">Suggested Diagnosis</h3>
              <p className="text-slate-600 text-sm">{summary.suggestedDiagnosis}</p>
            </div>

            {summary.nlpInsights && <NlpInsightsSection insights={summary.nlpInsights} />}
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-md font-bold text-sky-800 mb-3 border-b border-sky-200 pb-2">Medical Codes</h3>
                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-600 mb-2">ICD Codes (Diagnosis)</h4>
                        <div className="flex flex-wrap gap-2">
                            {summary.icdCodes.length > 0 ? summary.icdCodes.map(code => <CodeBadge key={code.code} code={code.code} description={code.description} type="icd" />) : <span className="text-xs text-slate-500">No ICD codes detected.</span>}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-sm font-semibold text-slate-600 mb-2">CPT Codes (Procedure)</h4>
                        <div className="flex flex-wrap gap-2">
                            {summary.cptCodes.length > 0 ? summary.cptCodes.map(code => <CodeBadge key={code.code} code={code.code} description={code.description} type="cpt" />) : <span className="text-xs text-slate-500">No CPT codes detected.</span>}
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-inner h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-700">Structured Summary</h2>
            {summary && !isLoading && !error && (
                 <button 
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="flex items-center justify-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors"
                >
                    {isExporting ? 'Exporting...' : <><ExportIcon /> Export as PDF</>}
                </button>
            )}
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
          {renderContent()}
        </div>
    </div>
  );
};

export default SummaryOutput;