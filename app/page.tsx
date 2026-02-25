import Footer from '@/components/Footer';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'product', label: 'Product' },
  { id: 'features', label: 'Features' },
  { id: 'usecases', label: 'Use Cases' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'demo', label: 'Demo' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

export default function Home() {
  return (
    <main>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="min-h-screen flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-slate-100">{section.label}</h2>
        </section>
      ))}
      <Footer />
    </main>
  );
}
