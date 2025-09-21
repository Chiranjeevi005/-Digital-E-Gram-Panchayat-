declare module 'pdf-poppler' {
  interface ConvertOptions {
    format: string;
    out_dir: string;
    out_prefix: string;
    page?: number;
  }
  
  function convert(pdfPath: string, opts: ConvertOptions): Promise<void>;
  
  export default { convert };
}