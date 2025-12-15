import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Textarea } from '../../components/ui/Input';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus,
  Filter,
  Check,
  Mail,
  Video,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Mock Data ---

type EventType = 'review' | 'deadline' | 'blocked' | 'facility' | 'mentor';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: EventType;
  startup?: string;
  location?: string;
  attendees?: string[];
  description?: string;
}

const initialEvents: CalendarEvent[] = [
  // Reviews
  { id: 'e1', title: 'GreenField Q3 Review', date: '2023-10-24', time: '10:00 AM', type: 'review', startup: 'GreenField Tech', location: 'Meeting Room A', attendees: ['Alex Chen'] },
  { id: 'e2', title: 'MediDrone Monthly Sync', date: '2023-10-26', time: '02:00 PM', type: 'review', startup: 'MediDrone', location: 'Zoom', attendees: ['Sarah Jenkins'] },
  
  // Deadlines
  { id: 'e3', title: 'AutoBotics 1-Pager Due', date: '2023-10-25', time: '05:00 PM', type: 'deadline', startup: 'AutoBotics' },
  
  // Blocked
  { id: 'e4', title: 'OOO - Dentist', date: '2023-10-27', time: '09:00 AM', type: 'blocked' },
  
  // Ecosystem (Facilities/Mentors)
  { id: 'e5', title: 'Robotics Lab A Usage', date: '2023-10-24', time: '09:00 AM', type: 'facility', startup: 'AutoBotics', location: 'Lab A' },
  { id: 'e6', title: 'Mentor Session: Dr. Sharma', date: '2023-10-24', time: '11:00 AM', type: 'mentor', startup: 'VisionAI', location: 'Zoom' },
];

export function ReviewerCalendar() {
  // State
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // Oct 2023
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    myReviews: true,
    deadlines: true,
    blocked: true,
    ecosystem: true, // Facilities & Mentors
  });

  // Modal Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'review' as EventType,
    time: '10:00',
    startup: '',
    sendEmail: true
  });

  // --- Calendar Logic ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const formatDate = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // --- Filter Logic ---
  const filteredEvents = events.filter(e => {
    if (e.type === 'review' && !filters.myReviews) return false;
    if (e.type === 'deadline' && !filters.deadlines) return false;
    if (e.type === 'blocked' && !filters.blocked) return false;
    if ((e.type === 'facility' || e.type === 'mentor') && !filters.ecosystem) return false;
    return true;
  });

  const getEventsForDay = (day: number) => {
    const dateStr = formatDate(day);
    return filteredEvents.filter(e => e.date === dateStr);
  };

  // --- Handlers ---
  const handleDateClick = (day: number) => {
    setSelectedDate(formatDate(day));
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    if (!selectedDate || !newEvent.title) return;
    
    const event: CalendarEvent = {
      id: `new_${Date.now()}`,
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type,
      startup: newEvent.startup,
      location: 'Online'
    };

    setEvents([...events, event]);
    setShowModal(false);
    // Reset form
    setNewEvent({ title: '', type: 'review', time: '10:00', startup: '', sendEmail: true });
  };

  // Color Helpers
  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'review': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'deadline': return 'bg-red-100 text-red-700 border-red-200';
      case 'blocked': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'facility': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'mentor': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <DashboardLayout role="reviewer" title="Schedule & Availability">
      
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
        
        {/* --- Left: Calendar Grid --- */}
        <Card className="flex-1 flex flex-col shadow-sm">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900 w-48">{monthName}</h2>
              <div className="flex rounded-md border border-gray-200">
                <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-50 text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-50 text-gray-600"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => handleDateClick(new Date().getDate())}>
                Add Event
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 uppercase">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-2 h-full">
              {/* Empty slots for start of month */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-gray-50/30 rounded-lg"></div>
              ))}
              
              {/* Days */}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

                return (
                  <div 
                    key={day} 
                    onClick={() => handleDateClick(day)}
                    className={`min-h-[100px] border rounded-lg p-2 transition-all hover:shadow-md cursor-pointer flex flex-col gap-1 ${
                      isToday ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
                    }`}>
                      {day}
                    </span>
                    
                    {/* Event Dots/Bars */}
                    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                      {dayEvents.slice(0, 3).map(ev => (
                        <div key={ev.id} className={`text-[10px] px-1.5 py-0.5 rounded border truncate ${getEventColor(ev.type)}`}>
                          {ev.type === 'deadline' ? '⚠️ ' : ''}
                          {ev.time.split(' ')[0]} {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-gray-400 pl-1">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* --- Right: Sidebar (Filters & Details) --- */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          
          {/* Filters */}
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="flex items-center text-sm">
                <Filter className="w-4 h-4 mr-2" /> Calendar Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={filters.myReviews} onChange={e => setFilters({...filters, myReviews: e.target.checked})} className="text-blue-600 rounded" />
                <span className="text-sm text-gray-700">My Reviews</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 ml-auto"></span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={filters.deadlines} onChange={e => setFilters({...filters, deadlines: e.target.checked})} className="text-red-600 rounded" />
                <span className="text-sm text-gray-700">Deadlines</span>
                <span className="w-2 h-2 rounded-full bg-red-500 ml-auto"></span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={filters.blocked} onChange={e => setFilters({...filters, blocked: e.target.checked})} className="text-gray-600 rounded" />
                <span className="text-sm text-gray-700">Blocked / OOO</span>
                <span className="w-2 h-2 rounded-full bg-gray-500 ml-auto"></span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={filters.ecosystem} onChange={e => setFilters({...filters, ecosystem: e.target.checked})} className="text-purple-600 rounded" />
                <span className="text-sm text-gray-700">Ecosystem (Labs/Mentors)</span>
                <span className="w-2 h-2 rounded-full bg-purple-500 ml-auto"></span>
              </label>
            </CardContent>
          </Card>

          {/* Tips / Legend */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" /> Smart Scheduling
            </h4>
            <p className="text-xs text-blue-700 leading-relaxed mb-2">
              Check the <strong>Ecosystem</strong> layer before booking reviews. Avoid scheduling when startups have Lab time or Mentor sessions booked.
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Mark yourself as <strong>Blocked</strong> to prevent auto-assignment of urgent tasks during that time.
            </p>
          </div>

        </div>
      </div>

      {/* --- Add Event Modal --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="font-semibold text-gray-900">Schedule Event</h3>
                  <p className="text-xs text-gray-500">{selectedDate}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 space-y-4">
                
                {/* Event Type Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setNewEvent({...newEvent, type: 'review'})}
                    className={`p-2 text-sm rounded-lg border text-center transition-colors ${newEvent.type === 'review' ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    Review / Meeting
                  </button>
                  <button 
                    onClick={() => setNewEvent({...newEvent, type: 'blocked'})}
                    className={`p-2 text-sm rounded-lg border text-center transition-colors ${newEvent.type === 'blocked' ? 'bg-gray-100 border-gray-500 text-gray-700 font-medium' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    Block Time (OOO)
                  </button>
                </div>

                <Input 
                  label="Title" 
                  placeholder={newEvent.type === 'review' ? "e.g., Q3 Review with GreenField" : "e.g., Doctor Appointment"}
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input 
                      type="time" 
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  {newEvent.type === 'review' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option>30 min</option>
                        <option>60 min</option>
                        <option>90 min</option>
                      </select>
                    </div>
                  )}
                </div>

                {newEvent.type === 'review' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Startup</label>
                      <select 
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={newEvent.startup}
                        onChange={(e) => setNewEvent({...newEvent, startup: e.target.value})}
                      >
                        <option value="">Select Startup...</option>
                        <option>GreenField Tech</option>
                        <option>MediDrone Systems</option>
                        <option>AutoBotics</option>
                      </select>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newEvent.sendEmail}
                          onChange={(e) => setNewEvent({...newEvent, sendEmail: e.target.checked})}
                          className="text-blue-600 rounded focus:ring-blue-500" 
                        />
                        <span className="text-sm text-blue-800 font-medium flex items-center">
                          <Mail className="w-3 h-3 mr-2" /> Send Calendar Invites
                        </span>
                      </label>
                      <p className="text-[10px] text-blue-600 mt-1 pl-6">
                        Will send email to startup founders and added attendees.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSaveEvent} leftIcon={<Check className="w-4 h-4" />}>
                  {newEvent.type === 'review' ? 'Schedule' : 'Block Time'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}