import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitReport } from '../services/reportService';
import { useAuth } from '../context/AuthContext';

const CRISIS_TYPES = [
  { value: 'violence', label: 'Violence', icon: 'security' },
  { value: 'accident', label: 'Accident', icon: 'car_crash' },
  { value: 'fire', label: 'Fire Outbreak', icon: 'local_fire_department' },
  { value: 'kidnapping', label: 'Suspicious Activity', icon: 'no_encryption' },
  { value: 'medical', label: 'Medical Emergency', icon: 'medical_services' },
  { value: 'other', label: 'Other', icon: 'report_problem' },
];

function CrisisReportForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [locationPermission, setLocationPermission] = useState('prompt');

  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: { lat: null, lng: null, address: '' },
    urgency: 'medium',
    mediaFile: null,
  });

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      setLocationPermission('requesting');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
            }
          }));
          setLocationPermission('granted');
        },
        () => setLocationPermission('denied'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationPermission('unsupported');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.type) { setError('Select a crisis type'); return; }
    if (!formData.description.trim()) { setError('Provide a description'); return; }
    if (!formData.location.lat || !formData.location.lng) { setError('Enable location access'); return; }

    setLoading(true);
    try {
      const userId = user?.uid || 'anonymous';
      await submitReport(formData, userId);
      setSuccess(true);
      setTimeout(() => navigate('/map'), 2000);
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4 pt-24">
        <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-12 max-w-md w-full text-center border border-white/10">
          <span className="material-symbols-outlined text-success text-7xl mb-4 filled" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          <h2 className="text-3xl font-black text-on-surface tracking-tighter uppercase mb-2">Report Filed</h2>
          <p className="text-on-surface-variant mb-4">Your crisis report has been submitted. AI analysis is processing.</p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <span className="animate-spin material-symbols-outlined">progress_activity</span>
            <span className="text-xs font-bold uppercase tracking-widest">Redirecting to map view...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-16 pb-24 md:pb-12">
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Progress Indicator */}
        <div className="w-full max-w-4xl pt-12 pb-8 mx-auto">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-1">Incident Workflow</span>
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tighter uppercase">Crisis Reporting</h1>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Step {step} of 3</span>
              <div className="text-sm font-bold text-primary">
                {step === 1 ? 'CLASSIFICATION' : step === 2 ? 'DOCUMENTATION' : 'REVIEW & SUBMIT'}
              </div>
            </div>
          </div>
          <div className="flex w-full gap-1 h-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex-1 rounded-full transition-all ${i <= step ? 'bg-primary' : 'bg-surface-container-highest'}`}></div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-4xl mx-auto items-start">
          
          {/* Crisis Type Selection */}
          <div className="md:col-span-4 bg-surface-container-low p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Selected Threat</h3>
            {formData.type ? (
              <div className="bg-tertiary-container p-6 rounded-lg flex flex-col items-center justify-center text-center border border-on-tertiary-container/10">
                <span className="material-symbols-outlined text-5xl text-on-tertiary-container mb-3 filled" style={{fontVariationSettings: "'FILL' 1"}}>
                  {CRISIS_TYPES.find(t => t.value === formData.type)?.icon || 'report_problem'}
                </span>
                <span className="text-lg font-black text-on-tertiary-container uppercase tracking-tight">
                  {CRISIS_TYPES.find(t => t.value === formData.type)?.label}
                </span>
              </div>
            ) : (
              <div className="bg-surface-container-highest p-6 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">help_outline</span>
                <span className="text-sm font-bold text-on-surface-variant uppercase tracking-tight">No Type Selected</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {CRISIS_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => { setFormData(prev => ({ ...prev, type: type.value })); setStep(2); }}
                  className={`p-3 rounded-lg border transition-all text-xs font-bold uppercase tracking-wider ${
                    formData.type === type.value
                      ? 'bg-tertiary-container border-on-tertiary-container/30 text-on-tertiary-container'
                      : 'bg-surface-container-highest border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg block mx-auto mb-1">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Media */}
          <div className="md:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Tactical Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => { setFormData(prev => ({ ...prev, description: e.target.value })); }}
                className="w-full bg-surface-container-highest border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 p-4 min-h-[160px] resize-none rounded-lg"
                placeholder="Enter detailed operational summary of the crisis. Include scale, immediate risks, and observed casualties..."
                required
              />
            </div>

            {/* Media Upload */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size <= 10 * 1024 * 1024) {
                      setFormData(prev => ({ ...prev, mediaFile: file }));
                    } else {
                      setError('File must be under 10MB');
                    }
                  }}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer text-center">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary mb-2">add_a_photo</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary block">
                    {formData.mediaFile ? formData.mediaFile.name.substring(0, 20) : 'Upload Visuals'}
                  </span>
                </label>
              </div>
              {formData.mediaFile && (
                <div className="relative group rounded-xl overflow-hidden h-32 md:h-auto bg-surface-container-highest flex items-center justify-center">
                  <img 
                    src={URL.createObjectURL(formData.mediaFile)} 
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => setFormData(prev => ({ ...prev, mediaFile: null }))}
                  >
                    <span className="material-symbols-outlined text-white">delete</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Map Preview */}
          <div className="md:col-span-12 bg-surface-container-lowest p-1 rounded-xl overflow-hidden relative shadow-sm border border-outline-variant/10">
            <div className="absolute top-4 left-4 z-10 space-y-2">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                <span className="text-xs font-bold uppercase tracking-tight text-primary">
                  {formData.location.address || 'Awaiting location...'}
                </span>
              </div>
            </div>
            <div className="h-48 w-full bg-surface-dim rounded-lg overflow-hidden flex items-center justify-center">
              {locationPermission === 'granted' ? (
                <div className="text-center text-on-surface-variant/50">
                  <span className="material-symbols-outlined text-4xl mb-2">public</span>
                  <p className="text-xs font-bold uppercase tracking-widest">GPS Coordinates Locked</p>
                  <p className="text-sm">{formData.location.lat?.toFixed(4)}, {formData.location.lng?.toFixed(4)}</p>
                </div>
              ) : (
                <div className="text-center text-on-surface-variant/50">
                  <span className="material-symbols-outlined text-4xl mb-2">location_disabled</span>
                  <p className="text-xs font-bold uppercase tracking-widest">Location Required</p>
                </div>
              )}
            </div>
            <div className="p-4 flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary rounded flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">my_location</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    {locationPermission === 'granted' ? 'Auto-Detect Active' : 'Detection Inactive'}
                  </p>
                  <p className="text-sm font-medium">{formData.location.address || 'No coordinates'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={requestLocation}
                className="bg-surface-container-highest px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-surface-container-high transition-colors"
              >
                Recalibrate
              </button>
            </div>
          </div>

          {/* Urgency & Submit */}
          <div className="md:col-span-12 flex flex-col md:flex-row justify-between items-center gap-6 mt-6 pb-12">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Threat Level:</span>
              <div className="flex gap-1">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                      formData.urgency === level
                        ? level === 'high' 
                          ? 'bg-tertiary-container text-on-tertiary-container shadow-sm'
                          : level === 'medium'
                          ? 'bg-warning text-white'
                          : 'bg-success text-white'
                        : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 md:flex-none px-8 py-4 bg-surface-container-highest text-on-surface text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-surface-container-high transition-colors"
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none px-12 py-4 bg-primary text-white text-sm font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin material-symbols-outlined">progress_activity</span>
                    Transmitting...
                  </span>
                ) : (
                  'Transmit Report'
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="md:col-span-12 bg-error-container text-on-error-container px-6 py-4 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
        </form>
      </main>

      {/* Emergency FAB */}
      <button 
        onClick={() => { setFormData({ type: '', description: '', location: formData.location, urgency: 'high', mediaFile: null }); setStep(1); }}
        className="fixed right-6 bottom-32 md:bottom-12 w-16 h-16 bg-tertiary-container text-on-tertiary-container rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform active:scale-95 z-40 border-4 border-white"
      >
        <span className="material-symbols-outlined text-3xl filled" style={{fontVariationSettings: "'FILL' 1"}}>emergency</span>
        <div className="absolute right-20 bg-tertiary text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Immediate Distress
        </div>
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl fixed bottom-0 w-full z-50 rounded-t-2xl shadow-[0_-4px_20px_0_rgba(0,6,102,0.12)]">
        <div className="flex justify-around items-center px-4 pb-6 pt-2">
          <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-slate-400 py-2">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Home</span>
          </button>
          <div className="flex flex-col items-center justify-center bg-blue-900 text-white rounded-xl py-2 px-6 scale-110 -translate-y-2 transition-all">
            <span className="material-symbols-outlined">add_alert</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Report</span>
          </div>
          <button onClick={() => navigate('/map')} className="flex flex-col items-center justify-center text-slate-400 py-2">
            <span className="material-symbols-outlined">location_searching</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Tracking</span>
          </button>
          <div className="flex flex-col items-center justify-center text-slate-400 py-2">
            <span className="material-symbols-outlined">notifications_active</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Alerts</span>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default CrisisReportForm;
