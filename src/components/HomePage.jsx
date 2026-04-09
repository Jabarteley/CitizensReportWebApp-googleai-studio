import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function HomePage() {
  return (
    <div className="bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      {/* Hero Section */}
      <section className="relative h-[870px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSIIi_WIoKhgzxagl0-XbyCfFXrG54fzHiNZGSlDGIl_WNNePj0kUWKJeExQSFZjS1pgAuWKPL18nPk05PqzVHn_DMxlKZZpcoMf3tBUt5Ck1PBs8BLHWzo8CfTJzJlqBdVOiFEeiABTOACKZzk0mHR_TACNVAL62bozUUNhYy1aWX34b4Uwh8LVji7QJn0-p6DCmygzKqt39MSG2dvejM0iFNA5ezQswShiWYqYW71cqSgJxTd4CFGjuZAi7-0KM6lYBU2plfGeUu"
            alt="Global command center network map"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-tertiary-container/20 px-3 py-1 rounded-full border border-tertiary-container/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container"></span>
              </span>
              <span className="text-on-tertiary-container text-[10px] font-black uppercase tracking-[0.2em]">Live CCRS Sentinel Active</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter uppercase italic">
              Command<br/>
              <span className="text-on-primary-container">The Crisis.</span>
            </h1>

            <p className="text-blue-100/80 text-xl font-medium max-w-md leading-relaxed border-l-4 border-on-primary-container pl-6">
              Real-time intelligence and rapid response for municipal emergencies. Professional grade reporting for a safer sector.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/report"
                className="bg-tertiary-container text-on-tertiary-container px-8 py-5 rounded-lg flex items-center justify-center gap-3 font-black uppercase tracking-widest hover:bg-on-tertiary-container hover:text-white transition-all group active:scale-95 shadow-2xl shadow-tertiary/40"
              >
                Report Crisis Now
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">emergency</span>
              </Link>
              <Link
                to="/report"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-5 rounded-lg font-black uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
              >
                Report Crisis
              </Link>
            </div>
          </div>

          {/* High-Impact Live Counter Card */}
          <div className="hidden md:block">
            <div className="bg-surface-container-lowest/10 backdrop-blur-3xl p-8 rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-white text-xs font-black uppercase tracking-widest opacity-60">System Throughput</h3>
                  <p className="text-white text-4xl font-black tracking-tighter">Operational</p>
                </div>
                <span className="material-symbols-outlined text-on-primary-container text-4xl">satellite_alt</span>
              </div>
              <div className="grid grid-cols-1 gap-8">
                <div className="border-l-4 border-on-primary-container pl-6">
                  <span className="text-on-primary-container text-5xl font-black block tracking-tighter">14,208</span>
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Incidents Resolved</span>
                </div>
                <div className="border-l-4 border-slate-500 pl-6">
                  <span className="text-white text-5xl font-black block tracking-tighter">99.8%</span>
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Verification Accuracy</span>
                </div>
                <div className="border-l-4 border-on-tertiary-container pl-6">
                  <span className="text-on-tertiary-container text-5xl font-black block tracking-tighter">112</span>
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Active Units In-Field</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20">
            <div className="max-w-2xl">
              <span className="text-primary text-xs font-black uppercase tracking-[0.3em] block mb-4">The Sentinel Protocol</span>
              <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-[0.9]">
                Architected for <span className="text-outline">Response.</span>
              </h2>
            </div>
            <p className="text-secondary text-lg max-w-sm border-l-2 border-primary-container pl-6">
              Our tri-phase methodology ensures no signal is lost and every action is justified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="bg-surface-container-low p-10 group hover:bg-primary transition-all duration-500 relative overflow-hidden">
              <span className="text-9xl font-black absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 group-hover:text-white transition-all">01</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-10 group-hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-white group-hover:text-primary text-3xl">add_alert</span>
                </div>
                <h4 className="text-2xl font-black text-blue-900 mb-4 uppercase tracking-tight group-hover:text-white">Report</h4>
                <p className="text-on-surface-variant group-hover:text-white/80 leading-relaxed font-medium">
                  Immediate data intake via encrypted uplink. Multimedia support for visual verification and geolocation locking.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-high p-10 group hover:bg-primary transition-all duration-500 relative overflow-hidden">
              <span className="text-9xl font-black absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 group-hover:text-white transition-all">02</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-10 group-hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-white group-hover:text-primary text-3xl">psychology</span>
                </div>
                <h4 className="text-2xl font-black text-blue-900 mb-4 uppercase tracking-tight group-hover:text-white">Verify</h4>
                <p className="text-on-surface-variant group-hover:text-white/80 leading-relaxed font-medium">
                  Neural-assisted analysis cross-references reports with satellite telemetry and field sensors to prevent false alarms.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-highest p-10 group hover:bg-primary transition-all duration-500 relative overflow-hidden">
              <span className="text-9xl font-black absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 group-hover:text-white transition-all">03</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-10 group-hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-white group-hover:text-primary text-3xl">conveyor_belt</span>
                </div>
                <h4 className="text-2xl font-black text-blue-900 mb-4 uppercase tracking-tight group-hover:text-white">Act</h4>
                <p className="text-on-surface-variant group-hover:text-white/80 leading-relaxed font-medium">
                  Direct dispatch to tactical units. Live reporting loop maintains visual contact until the crisis is confirmed resolved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Detail Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 relative h-[600px] rounded-2xl overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvLnJXfICSUU2gQItSmk0Kybn84Kdj_oZIGld340rwHdNv14_enOtDJe772acgrxd2Pzm2pSOKAt4FPB0rOnrwgGj6Z_0yohYftHfGfTEFCcbZ2Z0XXsSEpyf6qIy3JEPLbD7bf6DFYawiPKEilJepeS6U2jMrioPAP8TGK0cwnj7rhVoDsS9kdG_hDAv_OsKHZwEbysnT_MVEqBE8qb3AEBAffHk_WaDy7Ih8PC5wrCp8JLuZP3HpoDGlBN55NASPUq8JQKIx8l3F"
              alt="Emergency command center"
            />
            <div className="absolute bottom-8 left-8 bg-primary p-6 rounded-lg shadow-2xl">
              <p className="text-white text-xs font-black uppercase tracking-[0.2em] mb-2">Live Sector Intel</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-on-primary-container tracking-tighter">98.2ms</span>
                <span className="text-white/60 text-[10px] font-bold uppercase mb-1">Latency</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-8 md:pl-12">
            <h3 className="text-4xl font-black text-blue-950 uppercase tracking-tighter leading-none">
              Unrivaled <br/> Situational <br/> Awareness
            </h3>
            <p className="text-secondary leading-relaxed font-medium">
              Tactical Authority isn't just a dashboard—it's a digital shield. By integrating fragmented data streams into a single, unified command view, we provide administrators with the clarity needed to make life-saving decisions in seconds.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span className="text-sm font-bold uppercase tracking-wider text-on-surface">Biometric Authentication</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span className="text-sm font-bold uppercase tracking-wider text-on-surface">End-to-End Field Encryption</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span className="text-sm font-bold uppercase tracking-wider text-on-surface">Redundant Data Clusters</span>
              </li>
            </ul>
            <div className="pt-6">
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2 group">
                Explore Capabilities
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-24 bg-surface-container-high relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-primary">
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">verified_user</span>
              <p className="text-blue-900 text-4xl font-black tracking-tighter">100%</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Uptime Record</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-tertiary-container">
              <span className="material-symbols-outlined text-tertiary-container mb-4 text-3xl">speed</span>
              <p className="text-blue-900 text-4xl font-black tracking-tighter">4.2m</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg Response Time</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-primary-container">
              <span className="material-symbols-outlined text-primary-container mb-4 text-3xl">groups</span>
              <p className="text-blue-900 text-4xl font-black tracking-tighter">1.2k</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Agency Partners</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-secondary">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl">public</span>
              <p className="text-blue-900 text-4xl font-black tracking-tighter">Global</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Inter-sector Reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-black text-white tracking-tighter uppercase block mb-6 italic">Tactical Authority</span>
              <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
                The world's most advanced Crisis Response System, built for authorities who refuse to compromise on public safety.
              </p>
              <div className="flex gap-4">
                <span className="material-symbols-outlined cursor-pointer hover:text-on-primary-container">language</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-on-primary-container">share</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-on-primary-container">security</span>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-widest text-on-primary-container mb-6">Resources</h5>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a className="hover:text-white transition-colors" href="#">Incident Archives</a></li>
                <li><a className="hover:text-white transition-colors" href="#">API Documentation</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Personnel Training</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Privacy Protocols</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-widest text-on-primary-container mb-6">Support</h5>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a className="hover:text-white transition-colors" href="#">System Status</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Direct Command Link</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Whitepapers</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">© 2026 CCRS Command Authority. All Rights Reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">All Systems Nominal</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile BottomNavBar */}
      <nav className="md:hidden bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl fixed bottom-0 w-full z-50 rounded-t-2xl shadow-[0_-4px_20px_0_rgba(0,6,102,0.12)]">
        <div className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2">
          <div className="flex flex-col items-center justify-center bg-blue-900 dark:bg-blue-600 text-white rounded-xl py-2 px-6 scale-110 -translate-y-2 transition-all">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Home</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-2 hover:text-blue-700 dark:hover:text-blue-300">
            <span className="material-symbols-outlined">add_alert</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Report</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-2 hover:text-blue-700 dark:hover:text-blue-300">
            <span className="material-symbols-outlined">location_searching</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Tracking</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-2 hover:text-blue-700 dark:hover:text-blue-300">
            <span className="material-symbols-outlined">notifications_active</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Alerts</span>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HomePage;
