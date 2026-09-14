'use client';

import { useRef, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useGetUserProfileQuery } from './features/auth/authApi';
import { restoreUser } from './features/auth/authSlice';
import { restoreWishlist } from './features/wishlist/wishlistSlice';
import { restoreLanguage } from './features/shared/langSlice';
import { useAppDispatch } from './hooks';

let isRestored = false;

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  // Synchronously restore user on the client side before the first render completes.
  // This avoids race conditions and flashes of unauthenticated states.
  if (typeof window !== 'undefined' && !isRestored) {
    dispatch(restoreUser());
    dispatch(restoreWishlist());
    dispatch(restoreLanguage());
    isRestored = true;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only trigger profile validation after client mount and if a token is present.
  const hasToken = mounted
    ? !!(localStorage.getItem('rajseba_access_token') || localStorage.getItem('token'))
    : false;

  useGetUserProfileQuery(undefined, {
    skip: !hasToken,
  });

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<typeof store>(null);

  if (!storeRef.current) {
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <AuthLoader>{children}</AuthLoader>
    </Provider>
  );
}
