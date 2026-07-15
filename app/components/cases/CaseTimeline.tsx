import React, { useState, useEffect } from 'react';
import { getCaseTimeline } from '../../lib/api';
import type { TimelineEvent } from '../../types';
import { Clock, AlertTriangle, CheckCircle, Calendar, ArrowDown } from 'lucide-react';

interface Props {
  caseId: string;
}

export default function CaseTimeline({ caseId }: Props) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      setLoading(true);
      try {
        const data = await getCaseTimeline(caseId);
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, [caseId]);

  if (loading) {
    return (
      <div className="py-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-surface-soft border border-hairline-soft rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-10 text-center text-xs text-steel font-bold">
        No chronological timeline events registered for this case.
      </div>
    );
  }

  return (
    <div className="relative border-l border-hairline-soft pl-6 ml-3 space-y-8 py-4 animate-in fade-in duration-200">
      {events.map((event, idx) => {
        const isDelayWarning = event.delayDays && event.delayDays > 3;
        
        return (
          <div key={idx} className="relative">
            {/* Dot marker */}
            <span className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-circle border-4 border-canvas flex items-center justify-center ${
              event.type === 'incident' ? 'bg-primary' : 
              event.type === 'registration' ? 'bg-ink-deep' : 
              event.type === 'arrest' ? 'bg-attention' : 
              event.type === 'chargesheet' ? 'bg-success' : 'bg-stone'
            }`} />

            <div className="space-y-1 bg-surface-soft/40 border border-hairline-soft p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold text-ink-deep">{event.title}</span>
                <span className="text-[10px] text-steel font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-steel leading-relaxed">{event.description}</p>
              
              {/* Delay Notification Banner */}
              {event.delayDays !== undefined && event.delayDays > 0 && (
                <div className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                  isDelayWarning ? 'bg-critical/10 text-critical border border-critical/20' : 'bg-surface-soft text-steel'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Elapsed Time: {event.delayDays} day{event.delayDays > 1 ? 's' : ''} since previous milestone
                  </span>
                  {isDelayWarning && (
                    <span className="ml-auto flex items-center gap-0.5 uppercase tracking-wider text-[8px] bg-critical text-canvas px-1 rounded">
                      <AlertTriangle className="w-2.5 h-2.5" /> High Delay
                    </span>
                  )}
                </div>
              )}
            </div>

            {idx < events.length - 1 && (
              <div className="absolute -left-[24px] top-6 flex flex-col items-center select-none text-hairline pointer-events-none">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
