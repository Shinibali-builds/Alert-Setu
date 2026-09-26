import React from 'react';
import { FileText, Download, Printer, Calendar, BarChart3, CheckCircle2 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>National Weather Forecasting Centre</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Official Meteorological Bulletins & Reports
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Archival and daily operational bulletins, rainfall departure tables, and seasonal monsoon summaries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bulletin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Weather Summary Bulletin Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              BULLETIN NO. 142 / MONSOON-2026
            </span>
            <h2 className="text-xl font-bold text-slate-100 mt-0.5">
              All India Daily Weather Summary & Forecast Dispatch
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Issued at: 17:30 IST, 26 Sep 2026</span>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          <p>
            <strong>1. Synoptic Weather Features:</strong> The monsoon trough at mean sea level passes through Ganganagar, Rohtak, Hardoi, Varanasi, Gaya, Balasore and thence east-southeastwards to eastcentral Bay of Bengal. A well-marked low-pressure area over Northwest & adjoining Westcentral Bay of Bengal off Odisha coast persists and has concentrated into a Cyclonic Storm.
          </p>

          <p>
            <strong>2. Heavy Rainfall Distribution:</strong> Extremely heavy rainfall (&gt;20 cm) observed at isolated places over coastal Odisha (Puri, Paradip, Bhubaneswar). Very heavy rainfall recorded over Gangetic West Bengal and Coastal Andhra Pradesh.
          </p>

          <p>
            <strong>3. Cumulative Seasonal Performance:</strong> Countrywide cumulative monsoon rainfall until 26 September stands at <strong>+7.4% above Long Period Average (LPA)</strong>, categorized under &quot;Normal to Excess&quot; distribution.
          </p>
        </div>

        {/* Departure Table */}
        <div className="pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Regional Subdivision Rainfall Departures (Past 24 Hours)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Subdivision</th>
                  <th className="py-2.5 px-3">Actual (mm)</th>
                  <th className="py-2.5 px-3">Normal (mm)</th>
                  <th className="py-2.5 px-3">Departure (%)</th>
                  <th className="py-2.5 px-3 text-right">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                <tr className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 text-slate-200">Odisha Coastal</td>
                  <td className="py-2.5 px-3 font-bold text-rose-300">148.5</td>
                  <td className="py-2.5 px-3 text-slate-400">14.2</td>
                  <td className="py-2.5 px-3 text-emerald-400">+945%</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">Large Excess</td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 text-slate-200">Gangetic West Bengal</td>
                  <td className="py-2.5 px-3 font-bold text-amber-300">62.4</td>
                  <td className="py-2.5 px-3 text-slate-400">11.8</td>
                  <td className="py-2.5 px-3 text-emerald-400">+428%</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">Excess</td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 text-slate-200">Coastal Andhra Pradesh</td>
                  <td className="py-2.5 px-3 font-bold text-slate-200">38.0</td>
                  <td className="py-2.5 px-3 text-slate-400">9.5</td>
                  <td className="py-2.5 px-3 text-emerald-400">+300%</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">Excess</td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 text-slate-200">Delhi & NCR</td>
                  <td className="py-2.5 px-3 text-slate-200">0.0</td>
                  <td className="py-2.5 px-3 text-slate-400">3.2</td>
                  <td className="py-2.5 px-3 text-rose-400">-100%</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">No Rain</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
