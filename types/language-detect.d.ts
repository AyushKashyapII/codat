declare module 'language-detect' {
    function detectLanguage(code: string): string | null;
    export default detectLanguage;
  }