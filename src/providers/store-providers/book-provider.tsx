'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type BookStore, createBookStore, defaultInitState } from '@/store/book';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export type BookStoreApi = ReturnType<typeof createBookStore>

export const BookStoreContext = createContext<BookStoreApi | undefined>(
  undefined,
)

export interface BookStoreProviderProps {
  children: ReactNode
}

export const BookStoreProvider = ({
  children,
}: BookStoreProviderProps) => {
  const storeRef = useRef<BookStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createBookStore(defaultInitState);
  }

  // clear storage
  const pathname = usePathname();
  useEffect(() => {
    if(pathname !== '/confirm-n-pay') {
      storeRef.current?.persist.clearStorage();
    }
  }, [pathname]);

  return (
    <BookStoreContext.Provider value={storeRef.current}>
      {children}
    </BookStoreContext.Provider>
  )
}

export const useBookStore = <T,>(
  selector: (store: BookStore) => T,
): T => {
  const bookStoreContext = useContext(BookStoreContext)

  if (!bookStoreContext) {
    throw new Error(`useBookStore must be used within BookStoreProvider`)
  }

  return useStore(bookStoreContext, selector);
}
