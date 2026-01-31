import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { supabase } from '../supabase';
import { ArtPiece } from '../types';
import { LOGO_URL } from '../constants';

import { Header } from '../components/Header';

interface GalleryScreenProps {
  onOpenMenu: () => void;
}

const GalleryScreen: React.FC<GalleryScreenProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const [artCollection, setArtCollection] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArt() {
      const { data, error } = await supabase
        .from('art_pieces')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching art:', error);
      } else {
        setArtCollection(data || []);
      }
      setLoading(false);
    }

    fetchArt();
  }, []);

  return (
    <div className="min-h-screen text-white font-display pb-24">
      <Header onOpenMenu={onOpenMenu} title="In-House Gallery" />

      <main>
        <div className="flex p-6">
          <div className="flex w-full flex-col gap-6 items-center">
            <div className="flex gap-4 flex-col items-center">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-40 w-40 border-4 border-primary shadow-2xl"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUP5FLx0_P0mkl7gmtUvDYQ670de1SWXkiRVNZLpMaPnvQbzcHjqJRTHIilgzN0tOxBhNGug9hr9lpqNuZVXbM_qbcOhYgL6WyjyvQdF6vS4A-IJRsYuqJW_O3oVbZVdDDrLJCuNBBomaf0UBdx9rDug3QoNsZzPJNgyDv8Rm49b4a5rMTXlWPWKFJE8MIIViUDgaODs0kx1qKP91y91QugxkoXgHE549p8XCnSbxGEFwT8R1DtBQLco57pcZ6pTSO810uRdT1T7E")' }}
                ></div>
                <div className="absolute bottom-2 right-2 bg-accent-gold text-white p-1 rounded-full border-2 border-background-dark flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">verified</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-primary dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em] text-center">Elena Rossi</p>
                <p className="text-primary/70 dark:text-[#bba0a2] text-lg font-medium leading-normal text-center">Painter & Mixed Media Artist</p>
                <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-primary/10 dark:bg-primary/30 rounded-full">
                  <span className="material-symbols-outlined text-xs text-accent-gold">calendar_today</span>
                  <p className="text-primary dark:text-[#bba0a2] text-xs font-normal leading-normal text-center">Exhibiting until Oct 30</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col px-4 gap-3">
          <details className="flex flex-col rounded-xl border border-primary/20 bg-white/50 dark:bg-primary/10 px-4 py-2 group shadow-sm" open>
            <summary className="flex cursor-pointer items-center justify-between gap-6 py-2 list-none">
              <p className="text-primary dark:text-white text-sm font-semibold uppercase tracking-wider">About the Artist</p>
              <div className="text-primary dark:text-white group-open:rotate-180 transition-transform duration-300">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </summary>
            <p className="text-primary/80 dark:text-[#bba0a2] text-sm font-normal leading-relaxed pb-4 pt-2">
              Elena's work explores the intersection of urban life and natural textures, drawing inspiration from the Finnish archipelago and the vibrant streets of Helsinki. Her current collection at Ravinteli Olkkari features large-scale acrylics that evoke a sense of home and warmth.
            </p>
          </details>
        </div>

        <div className="flex items-center justify-between px-4 pt-8 pb-2">
          <h2 className="text-primary dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Gallery Collection</h2>
          <span className="material-symbols-outlined text-primary/40 dark:text-white/40">grid_view</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent-gold font-medium animate-pulse">Curating gallery...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-4 pb-6 max-w-7xl mx-auto">
            {artCollection.map((piece) => (
              <div key={piece.id} className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-white dark:bg-[#2d2021] border border-primary/5 overflow-hidden">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover"
                  style={{ backgroundImage: `url("${piece.image}")` }}
                ></div>
                <div className="flex w-full grow flex-col items-stretch justify-center gap-1 py-4 px-5">
                  <p className="text-primary dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">{piece.title}</p>
                  <div className="flex items-end gap-3 justify-between mt-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-primary/60 dark:text-[#bba0a2] text-sm font-normal leading-normal italic">{piece.medium}</p>
                    </div>
                    <button className="flex min-w-[110px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-accent-gold hover:bg-accent-gold/90 text-white text-sm font-bold leading-normal shadow-md shadow-accent-gold/20">
                      <span className="truncate uppercase tracking-tight">Inquire</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-8 py-10 text-center border-t border-primary/10">
          <p className="text-primary/50 dark:text-white/40 text-xs uppercase tracking-[0.2em] mb-2">Exclusive Display</p>
          <p className="text-primary/70 dark:text-[#bba0a2] text-sm font-normal italic">
            These pieces can be viewed in person at Ravinteli Olkkari. Ask your server for a private viewing of the full collection.
          </p>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default GalleryScreen;

