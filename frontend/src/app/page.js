import NFTMinter from '@/components/NFTMinter';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <NFTMinter />
    </main>
  );
}