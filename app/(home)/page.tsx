import Link from 'next/link';
import ThemeAwareLogo from '@/components/ThemeAwareLogo';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      {/* Hero section */}
      <div className="max-w-3xl text-center mb-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <ThemeAwareLogo width={250} height={90} className="mb-4" />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[#341100] dark:text-[#f2e9e4]">Documentation</h1>
        <p className="text-xl mb-8 text-[#201a17] dark:text-[#f2e9e4]">
          A collaborative, free and open database of food products from around the world
        </p>

        {/* CTA Buttons - Improved text contrast */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/docs"
            className="px-6 py-3 bg-[#341100] hover:bg-[#52443d] text-[#ffffff] font-semibold rounded-md transition-colors"
            style={{ color: '#ffffff' }}
          >
            Browse Documentation
          </Link>
        </div>
      </div>

      {/* Feature section */}
      <div className="max-w-5xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-[#dcc9c0] rounded-lg bg-[#f6f3f0] dark:bg-[#2a2420] dark:border-[#52443d]">
            <h2 className="text-xl font-bold mb-3 text-[#341100] dark:text-[#f2e9e4]">Comprehensive Data</h2>
            <p className="text-[#201a17] dark:text-[#f2e9e4]">
              Access information about millions of food products including ingredients, nutrition facts, and more.
            </p>
          </div>

          <div className="p-6 border border-[#dcc9c0] rounded-lg bg-[#f6f3f0] dark:bg-[#2a2420] dark:border-[#52443d]">
            <h2 className="text-xl font-bold mb-3 text-[#341100] dark:text-[#f2e9e4]">Open API</h2>
            <p className="text-[#201a17] dark:text-[#f2e9e4]">
              Integrate Open Food Facts data into your applications with our developer-friendly API.
            </p>
          </div>

          <div className="p-6 border border-[#dcc9c0] rounded-lg bg-[#f6f3f0] dark:bg-[#2a2420] dark:border-[#52443d]">
            <h2 className="text-xl font-bold mb-3 text-[#341100] dark:text-[#f2e9e4]">Community Driven</h2>
            <p className="text-[#201a17] dark:text-[#f2e9e4]">
              Join thousands of contributors working to bring food transparency to consumers worldwide.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
