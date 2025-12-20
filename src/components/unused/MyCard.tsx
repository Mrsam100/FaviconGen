
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Contact } from '../types';

interface MyCardProps {
  onSave: (details: Partial<Contact>) => void;
  initialDetails: Partial<Contact>;
}

const MyCard: React.FC<MyCardProps> = ({ onSave, initialDetails }) => {
  const [details, setDetails] = useState<Partial<Contact>>({
    ...initialDetails,
    address: initialDetails.address || '358 Exchange Place, New York, N.Y. 100099',
    fax: initialDetails.fax || '212 555 6390',
    telex: initialDetails.telex || '10 4534',
    aiInsights: initialDetails.aiInsights || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [designMode, setDesignMode] = useState<'modern' | 'classic'>('classic');
  const [qrUrl, setQrUrl] = useState('');

  const generateQRCode = () => {
    // Generate QR code link. Encoding the contact details as a JSON string for simple app-to-app scanning.
    const contactData = JSON.stringify({
      name: details.name || '',
      jobTitle: details.jobTitle || '',
      company: details.company || '',
      email: details.email || '',
      phone: details.phone || '',
      linkedinUrl: details.linkedinUrl || '',
      aiInsights: details.aiInsights || '',
      source: 'CardScan_QR'
    });
    const encodedData = encodeURIComponent(contactData);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedData}`);
  };

  useEffect(() => {
    generateQRCode();
  }, [details.name, details.jobTitle, details.company, details.email, details.phone]);

  const handleSave = () => {
    onSave(details);
    setIsEditing(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${details.name}'s Digital Business Card`,
          text: `Connect with ${details.name} from ${details.company}.`,
          url: window.location.href, // In a real app, this would be a specific URL for this card
        });
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Digital card link copied to clipboard!');
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 text-center md:text-left">
        <div>
           <span className="clay-text-convex text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">Professional Identity</span>
           <h1 className="text-5xl font-black text-[#4A4A4A]">Card Designer</h1>
        </div>
        <div className="flex gap-4">
            <div className="clay-pill-container p-1 flex items-center bg-white/50 backdrop-blur-md">
                <button 
                    onClick={() => setDesignMode('modern')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${designMode === 'modern' ? 'bg-[#6A4FBF] text-white shadow-lg' : 'text-gray-400'}`}
                >Modern</button>
                <button 
                    onClick={() => setDesignMode('classic')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${designMode === 'classic' ? 'bg-[#1c1917] text-white shadow-lg' : 'text-gray-400'}`}
                >Classic</button>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-10 py-5 clay-button font-black uppercase tracking-widest text-[10px]"
            >
              {isEditing ? 'Cancel' : 'Edit Specs'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Card Design / Preview */}
        <div className="space-y-12">
            {designMode === 'modern' ? (
                <div className="clay-card p-12 bg-white relative overflow-hidden min-h-[400px] flex flex-col justify-between group shadow-2xl hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB673]/20 rounded-bl-[100px] group-hover:scale-110 transition-transform"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#6A4FBF]/10 rounded-tr-[80px]"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="w-20 h-20 rounded-[30px] bg-[#6A4FBF] flex items-center justify-center text-white text-3xl font-black mb-10 shadow-lg">
                                {details.name?.charAt(0) || '?'}
                            </div>
                            <h2 className="text-4xl font-black text-[#4A4A4A] mb-2">{details.name || 'Your Name'}</h2>
                            <p className="text-[#6A4FBF] font-black text-xl mb-1 uppercase tracking-widest">{details.jobTitle || 'Your Title'}</p>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{details.company || 'Company Name'}</p>
                            
                            {details.aiInsights && (
                              <div className="mt-8 p-4 bg-[#F8E9DD]/40 rounded-2xl border border-white/60">
                                <span className="text-[9px] font-black uppercase text-[#6A4FBF] tracking-widest block mb-2">AI Conversation Starter</span>
                                <p className="text-sm font-medium italic text-gray-600 leading-relaxed">"{details.aiInsights}"</p>
                              </div>
                            )}
                        </div>
                        <div className="mt-20 space-y-4">
                            <div className="flex items-center gap-4 text-gray-500 font-bold">
                                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs">📧</span>
                                {details.email || 'email@example.com'}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* PIERCE & PIERCE CLASSIC MODE */
                <div className="relative group w-full aspect-[1.75/1] bg-[#fdfaf5] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-12 flex flex-col justify-between border border-gray-100 hover:scale-[1.01] transition-transform overflow-hidden font-serif">
                    {/* Subtle Paper Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <filter id="cardNoise">
                                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#cardNoise)" />
                        </svg>
                    </div>

                    <div className="flex justify-between items-start z-10">
                        <div className="text-[12px] font-medium text-[#2C2A26] uppercase tracking-[0.1em]">{details.phone || '212 555 6342'}</div>
                        <div className="text-right">
                            <div className="text-[14px] font-bold text-[#2C2A26] uppercase tracking-[0.15em] leading-tight">
                                {details.company || 'PIERCE & PIERCE'}
                            </div>
                            <div className="text-[9px] font-bold text-[#5D5A53] uppercase tracking-[0.2em] mt-0.5">
                                Mergers and Acquisitions
                            </div>
                        </div>
                    </div>

                    <div className="text-center z-10 flex flex-col items-center">
                        <h2 className="text-[32px] font-semibold text-[#1c1917] uppercase tracking-[0.2em] mb-1">
                            {details.name || 'PATRICK BATEMAN'}
                        </h2>
                        <p className="text-[16px] font-medium text-[#5D5A53] uppercase tracking-[0.25em]">
                            {details.jobTitle || 'VICE PRESIDENT'}
                        </p>
                    </div>

                    <div className="flex justify-center z-10">
                        <div className="text-[10px] font-bold text-[#5D5A53] uppercase tracking-[0.1em] text-center max-w-[80%] leading-relaxed">
                            {details.address || '358 Exchange Place, New York, N.Y. 100099'} 
                            <span className="mx-2 opacity-30">|</span> 
                            FAX {details.fax || '212 555 6390'} 
                            <span className="mx-2 opacity-30">|</span> 
                            TELEX {details.telex || '10 4534'}
                        </div>
                    </div>
                    
                    {details.aiInsights && (
                        <div className="absolute bottom-2 right-2 text-[8px] italic text-gray-300 pointer-events-none opacity-50 font-sans tracking-tight">
                           Insight: {details.aiInsights}
                        </div>
                    )}
                </div>
            )}

            <div className="clay-card p-12 bg-[#1c1917] text-white shadow-2xl flex flex-col items-center text-center">
                <div className="p-6 bg-white rounded-[40px] shadow-inner mb-8 border-4 border-white/20">
                    <img src={qrUrl} alt="Your QR Card" className="w-48 h-48" />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-widest">Digital Hub</h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed max-w-xs mb-8">
                    Visiting the Dubai Airshow? Display this QR code. Anyone with the CardScan app can instantly capture your identity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button 
                      onClick={generateQRCode}
                      className="px-8 py-4 bg-white/10 border border-white/20 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white/20 transition-all"
                    >
                        Regenerate QR
                    </button>
                    <button 
                      onClick={handleShare}
                      className="px-8 py-4 bg-[#FFB673] text-[#1c1917] rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl"
                    >
                        Share Card
                    </button>
                </div>
            </div>
        </div>

        {/* Edit Form */}
        <div className={`clay-card p-12 bg-white transition-all duration-500 shadow-xl ${isEditing ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
            <h3 className="text-3xl font-black mb-10 text-[#4A4A4A]">Card Specifications</h3>
            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Full Name</label>
                    <input className="w-full clay-pill-container px-6 py-4 outline-none font-black text-lg bg-white shadow-inner border border-gray-100" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Title</label>
                        <input className="w-full clay-pill-container px-4 py-3 outline-none font-bold text-sm bg-white shadow-inner" value={details.jobTitle} onChange={e => setDetails({...details, jobTitle: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Firm Name</label>
                        <input className="w-full clay-pill-container px-4 py-3 outline-none font-bold text-sm bg-white shadow-inner" value={details.company} onChange={e => setDetails({...details, company: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">AI Enrichment / Bio</label>
                    <textarea 
                        className="w-full clay-card p-6 outline-none font-medium text-sm bg-white shadow-inner border border-gray-100 min-h-[100px]" 
                        placeholder="Add a conversation starter or bio..."
                        value={details.aiInsights} 
                        onChange={e => setDetails({...details, aiInsights: e.target.value})} 
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Phone</label>
                        <input className="w-full clay-pill-container px-4 py-3 outline-none font-bold text-sm bg-white shadow-inner" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Fax (Classic Only)</label>
                        <input className="w-full clay-pill-container px-4 py-3 outline-none font-bold text-sm bg-white shadow-inner" value={details.fax} onChange={e => setDetails({...details, fax: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Address</label>
                    <input className="w-full clay-pill-container px-6 py-4 outline-none font-bold text-sm bg-white shadow-inner" value={details.address} onChange={e => setDetails({...details, address: e.target.value})} />
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">LinkedIn URL</label>
                    <input className="w-full clay-pill-container px-6 py-4 outline-none font-bold text-sm bg-white shadow-inner" value={details.linkedinUrl} onChange={e => setDetails({...details, linkedinUrl: e.target.value})} />
                </div>
                <button 
                  onClick={handleSave}
                  className="w-full py-5 clay-button-primary mt-6 text-lg font-black uppercase tracking-widest transition-all"
                >
                    Finalize Identity
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
