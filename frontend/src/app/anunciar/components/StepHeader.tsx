'use client';

import { FaChevronRight } from 'react-icons/fa';

interface StepHeaderProps {
  formStep: number;
}

export default function StepHeader({ formStep }: StepHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-6 sm:px-6 sm:py-8 text-white relative overflow-hidden">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <div className="flex flex-col items-center flex-1">
          <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${formStep>=1?'border-white bg-amber-100 text-amber-700':'border-white/40 bg-white/20 text-white/70'}`}>1</div>
          <span className="text-xs mt-1 font-medium">Básico</span>
        </div>
        <FaChevronRight className={`mx-1 sm:mx-2 text-lg ${formStep>=2?'text-white':'text-white/40'}`} />
        <div className="flex flex-col items-center flex-1">
          <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${formStep>=2?'border-white bg-amber-100 text-amber-700':'border-white/40 bg-white/20 text-white/70'}`}>2</div>
          <span className="text-xs mt-1 font-medium">Detalhes</span>
        </div>
        <FaChevronRight className={`mx-1 sm:mx-2 text-lg ${formStep>=3?'text-white':'text-white/40'}`} />
        <div className="flex flex-col items-center flex-1">
          <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${formStep>=3?'border-white bg-amber-100 text-amber-700':'border-white/40 bg-white/20 text-white/70'}`}>3</div>
          <span className="text-xs mt-1 font-medium">Fotos</span>
        </div>
        <FaChevronRight className={`mx-1 sm:mx-2 text-lg ${formStep>=4?'text-white':'text-white/40'}`} />
        <div className="flex flex-col items-center flex-1">
          <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${formStep>=4?'border-white bg-amber-100 text-amber-700':'border-white/40 bg-white/20 text-white/70'}`}>4</div>
          <span className="text-xs mt-1 font-medium">Revisão</span>
        </div>
      </div>
    </div>
  );
}
