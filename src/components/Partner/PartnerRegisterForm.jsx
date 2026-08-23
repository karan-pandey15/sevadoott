'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PARTNER_CATEGORIES } from '@/lib/categories';

const INITIAL_FORM = {
  name: '',
  fatherName: '',
  motherName: '',
  spouseName: '',
  gender: '',
  religion: '',
  country: 'India',
  mobile: '',
  aadharNo: '',
  panNo: '',
  personalEmail: '',
  officialEmail: '',
  currentAddress: '',
  currentCity: '',
  currentState: '',
  currentPincode: '',
  sameAsCurrent: false,
  permanentAddress: '',
  permanentCity: '',
  permanentState: '',
  permanentPincode: '',
  category: '',
  bankName: '',
  bankAccountNo: '',
  ifscCode: '',
  ref1Name: '',
  ref1Mobile: '',
  ref1Address: '',
  ref1City: '',
  ref1State: '',
  ref1Pincode: '',
  ref2Name: '',
  ref2Mobile: '',
  ref2Address: '',
  ref2City: '',
  ref2State: '',
  ref2Pincode: '',
  workExperience: '',
  websiteLink: '',
  branchName: '',
  agreeTerms: false,
};

function Field({ label, required, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1898A5] focus:border-[#1898A5] transition-all';

export default function PartnerRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState({
    aadharDoc: null,
    panDoc: null,
    photo: null,
    bankPassbook: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'sameAsCurrent' && value) {
        next.permanentAddress = prev.currentAddress;
        next.permanentCity = prev.currentCity;
        next.permanentState = prev.currentState;
        next.permanentPincode = prev.currentPincode;
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  useEffect(() => {
    if (form.sameAsCurrent) {
      setForm((prev) => ({
        ...prev,
        permanentAddress: prev.currentAddress,
        permanentCity: prev.currentCity,
        permanentState: prev.currentState,
        permanentPincode: prev.currentPincode,
      }));
    }
  }, [form.currentAddress, form.currentCity, form.currentState, form.currentPincode, form.sameAsCurrent]);

  const validate = () => {
    const next = {};
    const required = [
      'name', 'fatherName', 'gender', 'country', 'mobile', 'aadharNo', 'panNo',
      'personalEmail', 'currentAddress', 'currentCity', 'currentState', 'currentPincode',
      'permanentAddress', 'permanentCity', 'permanentState', 'permanentPincode',
      'category', 'bankName', 'bankAccountNo', 'ifscCode',
      'ref1Name', 'ref1Mobile', 'ref1Address', 'ref1City', 'ref1State', 'ref1Pincode',
      'ref2Name', 'ref2Mobile', 'ref2Address', 'ref2City', 'ref2State', 'ref2Pincode',
      'workExperience', 'branchName',
    ];
    required.forEach((key) => {
      if (!form[key]?.toString().trim()) next[key] = 'This field is required';
    });
    if (form.mobile && !/^\d{10}$/.test(form.mobile.replace(/\D/g, '').slice(-10))) {
      next.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (form.aadharNo && !/^\d{12}$/.test(form.aadharNo.replace(/\s/g, ''))) {
      next.aadharNo = 'Aadhar must be 12 digits';
    }
    if (form.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(form.panNo.trim())) {
      next.panNo = 'Enter a valid PAN number';
    }
    if (form.personalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalEmail)) {
      next.personalEmail = 'Enter a valid email';
    }
    if (form.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.ifscCode.trim())) {
      next.ifscCode = 'Enter a valid IFSC code';
    }
    if (!files.aadharDoc) next.aadharDoc = 'Aadhar document is required';
    if (!files.panDoc) next.panDoc = 'PAN document is required';
    if (!files.photo) next.photo = 'Passport-size photo is required';
    if (!files.bankPassbook) next.bankPassbook = 'Bank passbook / cancelled cheque is required';
    if (!form.agreeTerms) next.agreeTerms = 'You must agree to Terms & Conditions';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFile = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        files: {
          aadharDoc: files.aadharDoc?.name,
          panDoc: files.panDoc?.name,
          photo: files.photo?.name,
          bankPassbook: files.bankPassbook?.name,
        },
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem('sevadoot_partner_registration', JSON.stringify(payload));
      router.push('/partner/login?tab=know-more&registered=1');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center mb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#106670]">Registration Form</h2>
        <p className="text-sm text-gray-500 mt-1">Complete all sections to register as a Sevadoot partner</p>
      </div>

      {/* Personal Information */}
      <section>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Name" required>
            <input type="text" className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </Field>
          <Field label="Father Name" required>
            <input type="text" className={inputClass} value={form.fatherName} onChange={(e) => update('fatherName', e.target.value)} />
            {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
          </Field>
          <Field label="Mother Name">
            <input type="text" className={inputClass} value={form.motherName} onChange={(e) => update('motherName', e.target.value)} />
          </Field>
          <Field label="Spouse Name">
            <input type="text" className={inputClass} value={form.spouseName} onChange={(e) => update('spouseName', e.target.value)} />
          </Field>
          <Field label="Gender" required>
            <select className={inputClass} value={form.gender} onChange={(e) => update('gender', e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </Field>
          <Field label="Religion">
            <input type="text" className={inputClass} value={form.religion} onChange={(e) => update('religion', e.target.value)} />
          </Field>
          <Field label="Country" required>
            <input type="text" className={inputClass} value={form.country} onChange={(e) => update('country', e.target.value)} />
          </Field>
          <Field label="Mobile No." required>
            <input type="tel" className={inputClass} value={form.mobile} onChange={(e) => update('mobile', e.target.value)} placeholder="10-digit mobile" />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </Field>
          <Field label="Aadhar Card No." required>
            <input type="text" className={inputClass} value={form.aadharNo} onChange={(e) => update('aadharNo', e.target.value)} placeholder="12-digit Aadhar" maxLength={12} />
            {errors.aadharNo && <p className="text-red-500 text-xs mt-1">{errors.aadharNo}</p>}
          </Field>
          <Field label="Pan Card No." required>
            <input type="text" className={inputClass} value={form.panNo} onChange={(e) => update('panNo', e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
            {errors.panNo && <p className="text-red-500 text-xs mt-1">{errors.panNo}</p>}
          </Field>
          <Field label="Personal Email Id" required>
            <input type="email" className={inputClass} value={form.personalEmail} onChange={(e) => update('personalEmail', e.target.value)} />
            {errors.personalEmail && <p className="text-red-500 text-xs mt-1">{errors.personalEmail}</p>}
          </Field>
          <Field label="Official Email Id">
            <input type="email" className={inputClass} value={form.officialEmail} onChange={(e) => update('officialEmail', e.target.value)} />
          </Field>
        </div>
      </section>

      {/* Current Address */}
      <section>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
          Current Address Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Current Address" required className="lg:col-span-1">
            <input type="text" className={inputClass} value={form.currentAddress} onChange={(e) => update('currentAddress', e.target.value)} />
            {errors.currentAddress && <p className="text-red-500 text-xs mt-1">{errors.currentAddress}</p>}
          </Field>
          <Field label="Current City" required>
            <input type="text" className={inputClass} value={form.currentCity} onChange={(e) => update('currentCity', e.target.value)} />
            {errors.currentCity && <p className="text-red-500 text-xs mt-1">{errors.currentCity}</p>}
          </Field>
          <Field label="Current State" required>
            <input type="text" className={inputClass} value={form.currentState} onChange={(e) => update('currentState', e.target.value)} />
            {errors.currentState && <p className="text-red-500 text-xs mt-1">{errors.currentState}</p>}
          </Field>
          <Field label="Current Pincode" required>
            <input type="text" className={inputClass} value={form.currentPincode} onChange={(e) => update('currentPincode', e.target.value)} maxLength={6} />
            {errors.currentPincode && <p className="text-red-500 text-xs mt-1">{errors.currentPincode}</p>}
          </Field>
        </div>
        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={form.sameAsCurrent}
            onChange={(e) => update('sameAsCurrent', e.target.checked)}
            className="w-4 h-4 accent-[#1898A5]"
          />
          <span className="text-sm text-gray-700">Same as Current Address (for Permanent Address)</span>
        </label>
      </section>

      {/* Permanent Address */}
      <section>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
          Permanent Address Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Permanent Address" required>
            <input type="text" className={inputClass} value={form.permanentAddress} onChange={(e) => update('permanentAddress', e.target.value)} disabled={form.sameAsCurrent} />
            {errors.permanentAddress && <p className="text-red-500 text-xs mt-1">{errors.permanentAddress}</p>}
          </Field>
          <Field label="Permanent City" required>
            <input type="text" className={inputClass} value={form.permanentCity} onChange={(e) => update('permanentCity', e.target.value)} disabled={form.sameAsCurrent} />
            {errors.permanentCity && <p className="text-red-500 text-xs mt-1">{errors.permanentCity}</p>}
          </Field>
          <Field label="Permanent State" required>
            <input type="text" className={inputClass} value={form.permanentState} onChange={(e) => update('permanentState', e.target.value)} disabled={form.sameAsCurrent} />
            {errors.permanentState && <p className="text-red-500 text-xs mt-1">{errors.permanentState}</p>}
          </Field>
          <Field label="Permanent Pincode" required>
            <input type="text" className={inputClass} value={form.permanentPincode} onChange={(e) => update('permanentPincode', e.target.value)} disabled={form.sameAsCurrent} maxLength={6} />
            {errors.permanentPincode && <p className="text-red-500 text-xs mt-1">{errors.permanentPincode}</p>}
          </Field>
        </div>
      </section>

      {/* Category */}
      <section>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
          Service Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Select Category" required className="lg:col-span-1">
            <select className={inputClass} value={form.category} onChange={(e) => update('category', e.target.value)}>
              <option value="">Choose a category</option>
              {PARTNER_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </Field>
        </div>
      </section>

      {/* KYC */}
      <section>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
          KYC Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Bank Name" required>
            <input type="text" className={inputClass} value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
          </Field>
          <Field label="Bank Account No." required>
            <input type="text" className={inputClass} value={form.bankAccountNo} onChange={(e) => update('bankAccountNo', e.target.value)} />
            {errors.bankAccountNo && <p className="text-red-500 text-xs mt-1">{errors.bankAccountNo}</p>}
          </Field>
          <Field label="IFSC Code" required>
            <input type="text" className={inputClass} value={form.ifscCode} onChange={(e) => update('ifscCode', e.target.value.toUpperCase())} />
            {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
          </Field>
          <Field label="Upload Aadhar Card" required>
            <input type="file" accept="image/*,.pdf" className={inputClass} onChange={(e) => handleFile('aadharDoc', e.target.files?.[0] || null)} />
            {errors.aadharDoc && <p className="text-red-500 text-xs mt-1">{errors.aadharDoc}</p>}
          </Field>
          <Field label="Upload PAN Card" required>
            <input type="file" accept="image/*,.pdf" className={inputClass} onChange={(e) => handleFile('panDoc', e.target.files?.[0] || null)} />
            {errors.panDoc && <p className="text-red-500 text-xs mt-1">{errors.panDoc}</p>}
          </Field>
          <Field label="Upload Passport Size Photo" required>
            <input type="file" accept="image/*" className={inputClass} onChange={(e) => handleFile('photo', e.target.files?.[0] || null)} />
            {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
          </Field>
          <Field label="Upload Bank Passbook / Cancelled Cheque" required>
            <input type="file" accept="image/*,.pdf" className={inputClass} onChange={(e) => handleFile('bankPassbook', e.target.files?.[0] || null)} />
            {errors.bankPassbook && <p className="text-red-500 text-xs mt-1">{errors.bankPassbook}</p>}
          </Field>
        </div>
      </section>

      {/* Reference 1 */}
      <section>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
          Reference 1 Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Reference 1 Name" required>
            <input type="text" className={inputClass} value={form.ref1Name} onChange={(e) => update('ref1Name', e.target.value)} />
            {errors.ref1Name && <p className="text-red-500 text-xs mt-1">{errors.ref1Name}</p>}
          </Field>
          <Field label="Reference 1 Mobile" required>
            <input type="tel" className={inputClass} value={form.ref1Mobile} onChange={(e) => update('ref1Mobile', e.target.value)} />
            {errors.ref1Mobile && <p className="text-red-500 text-xs mt-1">{errors.ref1Mobile}</p>}
          </Field>
          <Field label="Reference 1 Address" required>
            <input type="text" className={inputClass} value={form.ref1Address} onChange={(e) => update('ref1Address', e.target.value)} />
            {errors.ref1Address && <p className="text-red-500 text-xs mt-1">{errors.ref1Address}</p>}
          </Field>
          <Field label="Reference 1 City" required>
            <input type="text" className={inputClass} value={form.ref1City} onChange={(e) => update('ref1City', e.target.value)} />
            {errors.ref1City && <p className="text-red-500 text-xs mt-1">{errors.ref1City}</p>}
          </Field>
          <Field label="Reference 1 State" required>
            <input type="text" className={inputClass} value={form.ref1State} onChange={(e) => update('ref1State', e.target.value)} />
            {errors.ref1State && <p className="text-red-500 text-xs mt-1">{errors.ref1State}</p>}
          </Field>
          <Field label="Reference 1 Pincode" required>
            <input type="text" className={inputClass} value={form.ref1Pincode} onChange={(e) => update('ref1Pincode', e.target.value)} maxLength={6} />
            {errors.ref1Pincode && <p className="text-red-500 text-xs mt-1">{errors.ref1Pincode}</p>}
          </Field>
        </div>
      </section>

      {/* Reference 2 */}
      <section>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
          Reference 2 Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Reference 2 Name" required>
            <input type="text" className={inputClass} value={form.ref2Name} onChange={(e) => update('ref2Name', e.target.value)} />
            {errors.ref2Name && <p className="text-red-500 text-xs mt-1">{errors.ref2Name}</p>}
          </Field>
          <Field label="Reference 2 Mobile" required>
            <input type="tel" className={inputClass} value={form.ref2Mobile} onChange={(e) => update('ref2Mobile', e.target.value)} />
            {errors.ref2Mobile && <p className="text-red-500 text-xs mt-1">{errors.ref2Mobile}</p>}
          </Field>
          <Field label="Reference 2 Address" required>
            <input type="text" className={inputClass} value={form.ref2Address} onChange={(e) => update('ref2Address', e.target.value)} />
            {errors.ref2Address && <p className="text-red-500 text-xs mt-1">{errors.ref2Address}</p>}
          </Field>
          <Field label="Reference 2 City" required>
            <input type="text" className={inputClass} value={form.ref2City} onChange={(e) => update('ref2City', e.target.value)} />
            {errors.ref2City && <p className="text-red-500 text-xs mt-1">{errors.ref2City}</p>}
          </Field>
          <Field label="Reference 2 State" required>
            <input type="text" className={inputClass} value={form.ref2State} onChange={(e) => update('ref2State', e.target.value)} />
            {errors.ref2State && <p className="text-red-500 text-xs mt-1">{errors.ref2State}</p>}
          </Field>
          <Field label="Reference 2 Pincode" required>
            <input type="text" className={inputClass} value={form.ref2Pincode} onChange={(e) => update('ref2Pincode', e.target.value)} maxLength={6} />
            {errors.ref2Pincode && <p className="text-red-500 text-xs mt-1">{errors.ref2Pincode}</p>}
          </Field>
        </div>
      </section>

   

      {/* Terms & Submit */}
      <div className="pt-4 border-t border-gray-300">
        <label className="flex items-start gap-2 cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={form.agreeTerms}
            onChange={(e) => update('agreeTerms', e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-[#1898A5]"
          />
          <span className="text-sm text-gray-700">
            I Agree to{' '}
            <Link href="/terms" className="text-[#1898A5] hover:underline font-semibold" target="_blank">
              Terms &amp; Conditions
            </Link>
          </span>
        </label>
        {errors.agreeTerms && <p className="text-red-500 text-xs mb-4 -mt-4">{errors.agreeTerms}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-[#333] hover:bg-[#222] text-white font-semibold rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
}
