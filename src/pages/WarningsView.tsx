import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, MapPin, Calendar, Clock, Filter, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface WarningItem {
  id: string;
  subdivision: string;
  districts: string[];
  severity: 'RED' | 'ORANGE' | 'YELLOW';
  hazard: 'Extremely Heavy Rainfall' | 'Cyclonic Gale' | 'Severe Thunderstorm' | 'Heatwave' | 'Coastal Inundation';
  headline: string;
  validUntil: string;
  impactLevel: string;
  actionRequired: string;
}

const ACTIVE_WARNINGS: WarningItem[] = [
  {
    id: 'IMD-WARN-001',
    subdivision: 'Odisha (Coastal & Interior)',
    districts: ['Khordha', 'Puri', 'Jagatsinghpur', 'Kendrapara', 'Cuttack', 'Bhadrak'],
    severity: 'RED',
    hazard: 'Extremely Heavy Rainfall',
    headline: 'Red Alert: Torrential downpours (>204.4 mm) with flash flood threat in Mahanadi and Daya river basins.',
    validUntil: '27 Sep 2026, 17:30 IST',
    impactLevel: 'Major disruption of traffic, waterlogging in low-lying urban sectors, localized mudslides.',
    actionRequired: 'Total suspension of fishing operations. Avoid movement in waterlogged underpasses. Mobilize NDRF/ODRAF teams.',
  },
  {
    id: 'IMD-WARN-002',
    subdivision: 'Gangetic West Bengal',
    districts: ['South 24 Parganas', 'North 24 Parganas', 'East Medinipur', 'Howrah', 'Kolkata'],
    severity: 'ORANGE',
    hazard: 'Cyclonic Gale',
    headline: 'Orange Alert: Squally wind speed reaching 55-65 km/h gusting to 75 km/h over coastal districts.',
    validUntil: '27 Sep 2026, 22:00 IST',
    impactLevel: 'Damage to thatched roofs, unfastened hoardings, breaking of tree branches, minor power outages.',
    actionRequired: 'Secure open construction materials. Regulate coastal ferry operations on Hooghly estuary.',
  },
  {
    id: 'IMD-WARN-003',
    subdivision: 'Coastal Andhra Pradesh & Yanam',
    districts: ['Srikakulam', 'Vizianagaram', 'Visakhapatnam'],
    severity: 'ORANGE',
    hazard: 'Severe Thunderstorm',
    headline: 'Orange Alert: Heavy showers accompanied by intense cloud-to-ground lightning and 40-50 km/h wind gusts.',
    validUntil: '27 Sep 2026, 12:00 IST',
    impactLevel: 'Electrical surge hazards, localized water pooling in agrarian lowlands.',
    actionRequired: 'Unplug agricultural electric pumpsets. Seek indoor shelter during thunderclaps.',
  },
  {
    id: 'IMD-WARN-004',
    subdivision: 'Assam & Meghalaya',
    districts: ['Kamrup Metropolitan', 'Barpeta', 'Dhubri', 'East Khasi Hills'],
    severity: 'YELLOW',
    hazard: 'Severe Thunderstorm',
    headline: 'Yellow Watch: Scattered thunderstorm activity with gusty surface winds and moderate rain spells.',
    validUntil: '28 Sep 2026, 08:30 IST',
    impactLevel: 'Minor road slickness, visibility reduction during downpours.',
    actionRequired: 'Stay updated through IMD nowcasts. Keep livestock in sheltered pens.',
  },
  {
    id: 'IMD-WARN-005',
    subdivision: 'West Rajasthan & Punjab',
    districts: ['Bikaner', 'Jaisalmer', 'Fazilka'],
    severity: 'YELLOW',
    hazard: 'Heatwave',
    headline: 'Yellow Advisory: Maximum day temperatures lingering 4-5°C above seasonal benchmark.',
    validUntil: '27 Sep 2026, 19:00 IST',
    impactLevel: 'Moderate health concern for vulnerable infants and elderly persons with cardiovascular issues.',
    actionRequired: 'Carry rehydration fluids. Avoid peak exposure during solar zenith (12:00 - 15:30 IST).',
  },
];

interface WarningsViewProps {
  onNavigateToAlertSetu?: () => void;
}

export const WarningsView: React.FC<WarningsViewProps> = ({ onNavigateToAlertSetu }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = ACTIVE_WARNINGS.filter((w) =>
    filterSeverity === 'ALL' ? true : w.severity === filterSeverity
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>National Warning Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Meteorological Warnings & Risk Advisories
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Multi-hazard early warning dissemination in compliance with National Disaster Management Guidelines.
            </p>
          </div>

          {onNavigateToAlertSetu && (
            <button
              type="button"
              onClick={onNavigateToAlertSetu}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-lg shadow-rose-950/40 shrink-0"
            >
              <span>Convert to Last-Mile Dispatch (AlertSetu)</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Severity Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by Severity:
          </span>

          {['ALL', 'RED', 'ORANGE', 'YELLOW'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterSeverity === sev
                  ? sev === 'RED'
                    ? 'bg-red-500/25 border border-red-500/50 text-red-200'
                    : sev === 'ORANGE'
                    ? 'bg-orange-500/25 border border-orange-500/50 text-orange-200'
                    : sev === 'YELLOW'
                    ? 'bg-amber-500/25 border border-amber-500/50 text-amber-200'
                    : 'bg-white/15 border border-white/30 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev === 'ALL' ? 'All Bulletins' : `${sev} ALERT`}
            </button>
          ))}
        </div>
      </div>

      {/* Warnings List */}
      <div className="space-y-4">
        {filtered.map((warn) => {
          const isRed = warn.severity === 'RED';
          const isOrange = warn.severity === 'ORANGE';

          return (
            <div
              key={warn.id}
              className={`rounded-3xl p-5 sm:p-6 border transition-all duration-200 ${
                isRed
                  ? 'bg-red-950/20 border-red-500/40 shadow-xl shadow-red-950/20'
                  : isOrange
                  ? 'bg-orange-950/20 border-orange-500/40'
                  : 'bg-amber-950/15 border-amber-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border uppercase ${
                      isRed
                        ? 'bg-red-500/20 text-red-300 border-red-500/50'
                        : isOrange
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {warn.severity} WARNING • {warn.hazard}
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                    {warn.id}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Valid Until: {warn.validUntil}</span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-100">{warn.headline}</h3>

              <div className="mt-3 flex items-start gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Target Subdivision:</strong> {warn.subdivision} (Districts:{' '}
                  {warn.districts.join(', ')})
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    Observed Hazard Impact
                  </span>
                  <p className="text-slate-300 leading-relaxed">{warn.impactLevel}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-rose-400 uppercase text-[10px] tracking-wider block">
                    Mandatory Public Action Directive
                  </span>
                  <p className="text-slate-200 font-semibold leading-relaxed">{warn.actionRequired}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
