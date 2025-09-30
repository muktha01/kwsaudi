'use client'
import React, { useState } from 'react';
import api from '@/utils/api';

export default function InstantValuationForm({ propertyType }) {
  const [formData, setFormData] = useState({
    city: '',
    address: '',
    fullname: '',
    mobileNumber: '',
    bedrooms: '',
    property_type: '',
    valuation_type: '',
    promotionalConsent: false,
    personalDataConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await api.post('/leads', { ...formData, formType: 'instant-valuation' });
      if (response.status === 200 || response.status === 201) {
        setSubmitMessage('Thank you! Your valuation request has been submitted successfully.');
        setFormData({
          city: '',
          address: '',
          fullname: '',
          mobileNumber: '',
          bedrooms: '',
          property_type: '',
          valuation_type: '',
          promotionalConsent: false,
          personalDataConsent: false
        });
      }
    } catch (error) {
      setSubmitMessage('Sorry, there was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input type="text" name="city" placeholder="Enter your city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-1" />
      <input type="text" name="fullname" placeholder="Name" value={formData.fullname} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2" />
      <input type="text" name="mobileNumber" placeholder="Number" value={formData.mobileNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2" />

      <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2">
        <option value="">Bedrooms</option>
        <option value="1">1 Bedroom</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="6+">6+</option>
      </select>

      <select name="property_type" value={formData.property_type} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2">
        <option value="">Property Type</option>
        {propertyType.map((type, idx) => <option key={idx} value={type}>{type}</option>)}
      </select>

      <select name="valuation_type" value={formData.valuation_type} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2">
        <option value="">Type of valuation</option>
        <option value="Sale">Sale</option>
        <option value="Letting">Letting</option>
        <option value="Both">Both</option>
      </select>

      {submitMessage && <div className={`p-3 rounded ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{submitMessage}</div>}

      <button type="submit" disabled={isSubmitting} className={`text-white px-6 font-semibold p-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[rgb(206,32,39,255)]'}`}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
