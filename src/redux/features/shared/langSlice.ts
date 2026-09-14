import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Language = 'bn' | 'en';

interface LangState {
  value: Language;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('rajseba_lang') as Language;
    if (saved === 'bn' || saved === 'en') {
      return saved;
    }
  }
  return 'bn'; // Default language is Bangla
};

const initialState: LangState = {
  value: getInitialLanguage(),
};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.value = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('rajseba_lang', action.payload);
      }
    },
    toggleLanguage: (state) => {
      const nextLang: Language = state.value === 'bn' ? 'en' : 'bn';
      state.value = nextLang;
      if (typeof window !== 'undefined') {
        localStorage.setItem('rajseba_lang', nextLang);
      }
    },
    restoreLanguage: (state) => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('rajseba_lang') as Language;
        if (saved === 'bn' || saved === 'en') {
          state.value = saved;
        }
      }
    },
  },
});

export const { setLanguage, toggleLanguage, restoreLanguage } = langSlice.actions;
export default langSlice.reducer;
