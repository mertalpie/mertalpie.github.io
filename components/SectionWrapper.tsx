import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export default function SectionWrapper({ id, children, className, dark = false }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-20 px-4 sm:px-6 lg:px-8',
        dark ? 'bg-slate-900/50' : '',
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
