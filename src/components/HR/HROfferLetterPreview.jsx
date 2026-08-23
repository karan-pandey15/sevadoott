'use client';
import { Printer, X } from 'lucide-react';

export default function HROfferLetterPreview({ offerLetter, onClose }) {
  const {
    companyName,
    candidateName,
    position,
    salary,
    joiningDate,
    generatedAt,
  } = offerLetter;

  const formattedSalary = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(salary);

  const formattedDate = (() => {
    try {
      return new Date(joiningDate + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return joiningDate;
    }
  })();

  const generatedOn = (() => {
    try {
      return new Date(generatedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return generatedAt;
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 no-print">
          <h3 className="text-base font-semibold text-gray-800">Offer Letter Preview</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition"
              style={{ backgroundColor: '#1898A5' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#147F8A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1898A5'; }}
            >
              <Printer size={16} />
              Print / Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable content */}
        <div className="offer-letter-print-target p-8 font-serif text-gray-800">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: '#1898A5' }}>
            <h1 className="text-2xl font-bold uppercase tracking-wider" style={{ color: '#106670' }}>
              {companyName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Offer of Employment</p>
          </div>

          {/* Date */}
          <p className="text-sm text-gray-500 mb-6">{generatedOn}</p>

          {/* Salutation */}
          <p className="mb-4">Dear <strong>{candidateName}</strong>,</p>

          {/* Body */}
          <p className="mb-4 leading-relaxed">
            We are pleased to offer you the position of <strong>{position}</strong> at{' '}
            <strong>{companyName}</strong>. After a thorough review of your qualifications and
            experience, we are confident that you will be a valuable addition to our team.
          </p>

          <p className="mb-4 leading-relaxed">
            Your offered compensation for this role is <strong>{formattedSalary}</strong> per
            annum. Your expected date of joining is <strong>{formattedDate}</strong>. Please review
            the details below and confirm your acceptance at your earliest convenience.
          </p>

          {/* Details Table */}
          <div className="my-6 border border-gray-200 rounded-lg overflow-hidden text-sm">
            <table className="w-full">
              <tbody>
                {[
                  ['Candidate Name', candidateName],
                  ['Position', position],
                  ['Offered Salary', formattedSalary],
                  ['Date of Joining', formattedDate],
                  ['Company', companyName],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2 font-semibold text-gray-600 bg-gray-50 w-40">{k}</td>
                    <td className="px-4 py-2">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Closing */}
          <p className="mb-4 leading-relaxed">
            We look forward to welcoming you to the team. Please do not hesitate to reach out if
            you have any questions or require any clarifications.
          </p>

          <p className="mb-2">Warm regards,</p>
          <p className="font-bold">{companyName}</p>
          <p className="text-sm text-gray-500">Human Resources Department</p>
        </div>
      </div>
    </div>
  );
}
