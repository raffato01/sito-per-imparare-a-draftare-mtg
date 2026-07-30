import React, { useState } from 'react';
import { TUTORIAL_LESSONS, SET_GUIDES, GLOSSARY } from '../../data/tutorialData';
import { TRANSLATIONS } from '../../data/translations';
import { BookOpen, Sparkles, Award, Layers, BarChart2, Compass, Play, ChevronRight, CheckCircle, Flame, Star } from 'lucide-react';

function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const parseInlineBold = (str) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-amber-300">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-200">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${index}`} className="space-y-1.5 my-3 pl-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(
        <h4 key={index} className="text-lg font-black text-amber-400 mt-6 mb-2 border-b border-slate-800 pb-1">
          {parseInlineBold(trimmed.replace('### ', ''))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${index}`} className="space-y-1.5 my-3 pl-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(
        <h3 key={index} className="text-xl font-black text-white mt-8 mb-3">
          {parseInlineBold(trimmed.replace('## ', ''))}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.substring(2);
      currentList.push(
        <li key={index} className="flex items-start gap-2 text-slate-300 text-sm sm:text-base">
          <span className="text-amber-400 font-bold">•</span>
          <span>{parseInlineBold(itemText)}</span>
        </li>
      );
    } else if (trimmed.startsWith('> ')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${index}`} className="space-y-1.5 my-3 pl-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(
        <blockquote key={index} className="my-4 p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-2xl text-amber-200 text-sm italic shadow-inner">
          {parseInlineBold(trimmed.replace('> ', ''))}
        </blockquote>
      );
    } else if (trimmed === '') {
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${index}`} className="space-y-1.5 my-3 pl-1">{currentList}</ul>);
        currentList = [];
      }
    } else {
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${index}`} className="space-y-1.5 my-3 pl-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(
        <p key={index} className="text-slate-300 text-sm sm:text-base leading-relaxed my-2">
          {parseInlineBold(trimmed)}
        </p>
      );
    }
  });

  if (currentList.length > 0) {
    elements.push(<ul key="ul-last" className="space-y-1.5 my-3 pl-1">{currentList}</ul>);
  }

  return elements;
}

export function AcademyGuide({ onStartDraft, lang = 'it' }) {
  const [activeLessonId, setActiveLessonId] = useState('intro');
  const [selectedSetCode, setSelectedSetCode] = useState('fdn');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.it;
  const isIT = lang === 'it';

  const activeLesson = TUTORIAL_LESSONS.find(l => l.id === activeLessonId) || TUTORIAL_LESSONS[0];
  const activeSetGuide = SET_GUIDES.find(s => s.code === selectedSetCode) || SET_GUIDES[0];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="text-amber-400" size={20} />;
      case 'Award': return <Award className="text-rose-400" size={20} />;
      case 'Layers': return <Layers className="text-sky-400" size={20} />;
      case 'BarChart2': return <BarChart2 className="text-emerald-400" size={20} />;
      case 'Compass': return <Compass className="text-purple-400" size={20} />;
      default: return <BookOpen className="text-amber-400" size={20} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles size={14} />
            <span>{t.heroTag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            {t.heroTitlePrefix} <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">{t.heroTitleSuffix}</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.heroDesc}
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onStartDraft}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/20 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <Play size={18} fill="currentColor" />
              <span>{t.btnStartDraft}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Lesson Navigation */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase px-1">{t.lessonsTitle}</h3>
          <div className="space-y-2">
            {TUTORIAL_LESSONS.map((lesson) => {
              const isActive = lesson.id === activeLessonId;
              const lessonTitle = lesson.titles ? lesson.titles[lang] : lesson.title;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    isActive
                      ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-amber-500/20' : 'bg-slate-900'}`}>
                    {getIcon(lesson.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">{lesson.badge}</span>
                      {isActive && <ChevronRight size={16} className="text-amber-400" />}
                    </div>
                    <h4 className={`font-bold text-sm mt-0.5 ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                      {lessonTitle}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson Reader View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{activeLesson.badge}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {activeLesson.titles ? activeLesson.titles[lang] : activeLesson.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {activeLesson.subtitles ? activeLesson.subtitles[lang] : activeLesson.subtitle}
              </p>
            </div>

            {/* Parsed Markdown Body */}
            <div className="space-y-3">
              {renderMarkdown(activeLesson.contents ? activeLesson.contents[lang] : activeLesson.content)}
            </div>

            {/* Key Takeaways Box */}
            <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-5 space-y-3 mt-6">
              <h4 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                <CheckCircle size={16} />
                <span>{t.keyPointsTitle}</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
                {(activeLesson.highlightList ? activeLesson.highlightList[lang] : activeLesson.highlights).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* NEW SECTION: Set Ratings & Archetypes Guides */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Star size={16} className="text-amber-400" />
              <span>{isIT ? 'GUIDA AI SET & ARCHETIPI' : 'SET RATINGS & ARCHETYPES'}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              {isIT ? 'Punteggi Set & Guida alle Strategie' : 'Set Ratings & Synergy Guides'}
            </h3>
          </div>

          {/* Set Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SET_GUIDES.map((sg) => (
              <button
                key={sg.code}
                onClick={() => setSelectedSetCode(sg.code)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedSetCode === sg.code
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-inner'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {sg.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Set Details Card */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{isIT ? 'Valutazione Set' : 'Set Rating'}</span>
              <span className="text-base font-black text-amber-400">{activeSetGuide.ratings[lang]}</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{isIT ? 'Velocità Formato' : 'Format Speed'}</span>
              <span className="text-base font-black text-rose-400">{activeSetGuide.speed}</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{isIT ? 'Difficoltà Draft' : 'Draft Difficulty'}</span>
              <span className="text-base font-black text-emerald-400">{activeSetGuide.difficulty}</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            {activeSetGuide.description[lang]}
          </p>

          {/* Top Archetypes Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase flex items-center gap-2">
              <Flame size={16} className="text-rose-400" />
              <span>{isIT ? 'Migliori Archetipi da Draftare:' : 'Top Draft Archetypes:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeSetGuide.topArchetypes.map((arch, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span>{arch.pair}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {arch.desc[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-xs sm:text-sm font-medium flex items-start gap-3">
            <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300 font-bold mb-0.5">{isIT ? 'Consiglio da Pro-Player:' : 'Pro Player Tip:'}</strong>
              <span>{activeSetGuide.proTip[lang]}</span>
            </div>
          </div>
        </div>

      </div>

      {/* MTG Glossary */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4">
        <h4 className="font-extrabold text-base text-slate-200 flex items-center gap-2">
          <span>{t.glossaryTitle}</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {GLOSSARY.map((g, idx) => (
            <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-amber-400 block mb-0.5">{g.term}</span>
              <span className="text-slate-300">{g.descs ? g.descs[lang] : g.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
