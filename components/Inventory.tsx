
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { Contact } from '../types';

interface VaultProps {
  products: Contact[];
  onOp: (c: Contact, op: 'add' | 'edit' | 'delete') => void;
  categories: string[];
}

const Inventory: React.FC<VaultProps> = ({ products, onOp, categories }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                           c.company.toLowerCase().includes(search.toLowerCase()) ||
                           c.jobTitle.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [products, search]);

  return (
    <div className="pt-40 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
        <div className="flex-1">
           <span className="clay-text-convex mb-4">Identity Index</span>
           <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">Vault</h1>
        </div>
        
        <div className="w-full md:w-auto">
            <input 
                type="text" 
                placeholder="Search index..." 
                className="w-full md:w-[400px] px-8 py-5 border-4 border-black font-black uppercase tracking-[0.2em] text-sm outline-none focus:bg-black focus:text-white transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </div>
      </div>

      {filtered.length === 0 ? (
          <div className="p-32 text-center flex flex-col items-center border-4 border-black bg-white">
              <div className="text-8xl mb-8 grayscale opacity-20">📇</div>
              <p className="text-black font-black text-2xl uppercase tracking-[0.4em]">Archive Empty</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {filtered.map(c => (
                  <div key={c.id} className="p-10 bg-white border-4 border-black hover:shadow-2xl transition-all relative group">
                      <div className="absolute inset-0 bg-black p-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none text-center">
                          <h4 className="font-black text-white mb-6 uppercase text-xs tracking-[0.4em]">AI Intelligence</h4>
                          <p className="text-sm text-white font-black uppercase tracking-widest leading-relaxed">
                            "{c.aiInsights || "Intelligence Pending..."}"
                          </p>
                      </div>

                      <div className="flex flex-col items-center text-center mb-10 relative z-10">
                          <div className="w-24 h-24 bg-black text-white flex items-center justify-center text-5xl font-black mb-8">
                              {c.name.charAt(0)}
                          </div>
                          <div>
                              <h3 className="font-black text-3xl text-black leading-none mb-2 uppercase tracking-tighter">{c.name}</h3>
                              <p className="text-[12px] font-black text-black/40 uppercase tracking-[0.3em]">{c.company}</p>
                          </div>
                      </div>
                      
                      <div className="space-y-4 mb-10 relative z-10">
                          <div className="p-6 bg-white border-2 border-black">
                              <span className="text-[9px] font-black text-black/40 uppercase block mb-1 tracking-widest">POSITION</span>
                              <span className="font-black text-sm text-black uppercase truncate block">{c.jobTitle}</span>
                          </div>
                          <div className="p-6 bg-white border-2 border-black">
                              <span className="text-[9px] font-black text-black/40 uppercase block mb-1 tracking-widest">CHANNEL</span>
                              <span className="font-black text-sm text-black truncate block uppercase">{c.email || c.phone || 'N/A'}</span>
                          </div>
                      </div>

                      <div className="flex gap-4 pt-8 border-t-2 border-black relative z-10">
                          <button 
                            className="flex-1 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black border-2 border-black transition-all"
                            onClick={() => window.open(`mailto:${c.email}`)}
                          >
                              Connect
                          </button>
                          <button onClick={() => onOp(c, 'delete')} className="w-14 h-14 flex items-center justify-center border-2 border-black text-black hover:bg-black hover:text-white transition-all font-black">X</button>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default Inventory;
