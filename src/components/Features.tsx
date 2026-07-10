import React from 'react';
import { Globe, Award, ShieldCheck, LucideIcon } from 'lucide-react';

interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
}

interface FeaturesProps {
  items: FeatureItem[];
  isAdminMode?: boolean;
  onEditClick?: () => void;
}

export default function Features({ items, isAdminMode = false, onEditClick }: FeaturesProps) {
  // Map hardcoded icons to feature ids
  const getIcon = (id: string) => {
    switch (id) {
      case 'importados':
        return <Globe className="text-brand-dark stroke-[1.25]" size={26} />;
      case 'limitadas':
        return <Award className="text-brand-dark stroke-[1.25]" size={26} />;
      default:
        return <ShieldCheck className="text-brand-dark stroke-[1.25]" size={26} />;
    }
  };

  return (
    <section id="trust-features-section" className="relative border-y border-brand-dark/10 bg-brand-light-beige/70 py-10">
      
      {/* Admin Edit indicator overlay */}
      {isAdminMode && (
        <button
          onClick={onEditClick}
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 bg-brand-accent text-brand-dark border border-brand-dark font-sans text-[9px] uppercase font-bold px-2.5 py-1 flex items-center gap-1 shadow-md hover:bg-white transition-colors cursor-pointer"
        >
          <span>✏️ Editar Pilares & Características</span>
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-brand-dark/10">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-4 md:py-2 md:px-6 justify-center md:justify-start"
            >
              <div className="flex-shrink-0 p-3 bg-brand-cream rounded-none border border-brand-dark/10">
                {getIcon(item.id)}
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-dark font-sans">
                  {item.title}
                </h4>
                <p className="text-xs text-brand-dark/75 font-light">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
