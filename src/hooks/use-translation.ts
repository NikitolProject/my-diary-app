import dictionary from '@/data/dictionary';

export const useTranslation = () => {
  let locale;

  if (typeof window !== 'undefined') {
    // Perform localStorage action
    locale = localStorage.getItem('locale');
  } else {
    locale = "en"; 
  };
  
  return {
    translate: (term: string) => {
      const translation = (dictionary as any)[term][locale!]

      return Boolean(translation) ? translation : term
    }
  }
}