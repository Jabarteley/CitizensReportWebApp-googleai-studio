import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { submitReport } from '../services/reportService';

const CRISIS_TYPES = [
  { value: 'violence', label: 'Violence', icon: 'security' },
  { value: 'accident', label: 'Accident', icon: 'car_crash' },
  { value: 'fire', label: 'Fire', icon: 'local_fire_department' },
  { value: 'kidnapping', label: 'Suspicious', icon: 'no_encryption' },
  { value: 'medical', label: 'Medical', icon: 'medical_services' },
  { value: 'other', label: 'Other', icon: 'report_problem' },
];

function AnonymousReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: '', description: '', location: { lat: null, lng: null, address: '' }, urgency: 'medium', mediaFile: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setFormData(prev => ({
          ...prev,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude, address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }
        })),
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.type) { setError('Select crisis type'); return; }
    if (!formData.description.trim()) { setError('Add a description'); return; }
    if (!formData.location.lat) { setError('Enable location access'); return; }

    setLoading(true);
    try {
      await submitReport(formData, 'anonymous');
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError('Submission failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <span className="material-symbols-outlined text-on-primary-container text-8xl mb-6" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          <h2 className="text-4xl font-black text-on-surface tracking-tighter uppercase mb-3">Report Filed</h2>
          <p className="text-on-surface-variant text-lg mb-6">Your anonymous report has been submitted. AI analysis is processing.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm hover:underline">
            <span className="material-symbols-outlined">arrow_back</span>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal top bar */}
      <div className="bg-surface-container-low px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-lg font-black text-primary tracking-tighter uppercase">Tactical Authority</Link>
        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Cancel</Link>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Anonymous badge */}
        <div className="inline-flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full mb-8">
          <span className="material-symbols-outlined text-primary text-sm">visibility_off</span>
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Anonymous — No identity stored</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Crisis Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Crisis Type</label>
            <div className="grid grid-cols-3 gap-3">
              {CRISIS_TYPES.map(type => (
                <button key={type.value} type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    formData.type === type.value
                      ? 'bg-tertiary-container border-on-tertiary-container text-on-tertiary-container'
                      : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl block mx-auto mb-1">{type.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 focus:border-primary focus:ring-0 text-sm resize-none"
              placeholder="Describe what is happening..."
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Location</label>
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span className="text-sm font-medium">
                {formData.location.address || 'Detecting location...'}
              </span>
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Urgency</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map(level => (
                <button key={level} type="button"
                  onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    formData.urgency === level
                      ? level === 'high' ? 'bg-tertiary-container text-on-tertiary-container' : level === 'medium' ? 'bg-warning text-white' : 'bg-success text-white'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >{level}</button>
              ))}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Evidence (Optional)</label>
            {formData.mediaFile ? (
              <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden">
                {formData.mediaFile.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(formData.mediaFile)} alt="Preview" className="w-full h-48 object-cover" />
                ) : (
                  <video src={URL.createObjectURL(formData.mediaFile)} className="w-full h-48 object-cover" controls />
                )}
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, mediaFile: null }))}
                  className="absolute top-2 right-2 bg-error text-white rounded-full p-1 hover:bg-on-error-container transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* Camera Option */}
                <label className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">photo_camera</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block">Take Photo</span>
                  <span className="text-[10px] text-on-surface-variant/60 block mt-1">Camera</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size <= 10 * 1024 * 1024) setFormData(prev => ({ ...prev, mediaFile: file }));
                    }} />
                </label>
                {/* Upload Option */}
                <label className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">add_a_photo</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block">Upload File</span>
                  <span className="text-[10px] text-on-surface-variant/60 block mt-1">Max 10MB</span>
                  <input type="file" accept="image/*,video/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size <= 10 * 1024 * 1024) setFormData(prev => ({ ...prev, mediaFile: file }));
                    }} />
                </label>
              </div>
            )}
          </div>

          {/* Error */}
          {error && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">{error}</div>}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin material-symbols-outlined">progress_activity</span>
                Submitting...
              </span>
            ) : 'Submit Anonymous Report'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AnonymousReport;
