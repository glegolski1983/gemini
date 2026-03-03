
import React, { useState } from 'react';
import { 
  FileUp, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Settings2,
  Table as TableIcon,
  Trash2,
  RefreshCw
} from 'lucide-react';

const DescriptionImporter: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
      startImport();
    } else {
      alert("Proszę wybrać plik Excel (.xlsx) lub CSV.");
    }
  };

  const startImport = () => {
    setStatus('uploading');
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStatus('processing');
        setTimeout(() => setStatus('done'), 2000);
      }
    }, 200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1a2b4d] tracking-tight">Importer Opisów</h2>
          <p className="text-sm text-gray-500 mt-1">Masowe wgrywanie danych technicznych i marketingowych z plików zewnętrznych.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <RefreshCw size={16} />
            Historia Importów
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transition-all">
            <Settings2 size={16} />
            Konfiguracja Mapowania
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center group ${
              isDragging ? 'bg-blue-50 border-blue-400 scale-[1.01]' : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${
              isDragging ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
            }`}>
              <Upload size={32} />
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2">Przeciągnij i upuść plik z danymi</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
              Obsługiwane formaty: <span className="font-bold">XLSX, CSV</span>. Plik powinien zawierać kolumnę z ActionID lub EAN jako klucz.
            </p>
            
            <input 
              type="file" 
              className="hidden" 
              id="file-upload" 
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setFile(f); startImport(); }
              }}
            />
            <label 
              htmlFor="file-upload"
              className="px-8 py-3 bg-[#1a2b4d] text-white rounded-xl text-sm font-black uppercase tracking-widest cursor-pointer hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10"
            >
              Wybierz plik z dysku
            </label>
          </div>

          {status !== 'idle' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{file?.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                      {status === 'uploading' ? 'Wgrywanie pliku...' : status === 'processing' ? 'Analiza danych przez AI...' : 'Zakończono pomyślnie'}
                    </p>
                  </div>
                </div>
                {status === 'done' && (
                  <div className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
                    <CheckCircle2 size={16} /> Gotowe
                  </div>
                )}
              </div>

              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all duration-300 ${status === 'done' ? 'bg-emerald-500' : 'bg-blue-600'}`}
                  style={{ width: `${status === 'done' ? 100 : progress}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>{status === 'done' ? '100%' : `${progress}%`}</span>
                <span>{status === 'done' ? 'Processed' : 'In Progress'}</span>
              </div>
            </div>
          )}

          {status === 'done' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="text-emerald-600" size={20} />
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">Rozpoznano</span>
                </div>
                <h4 className="text-2xl font-black text-emerald-900 leading-none">124</h4>
                <p className="text-xs text-emerald-700 mt-1">Produkty zaktualizowane</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="text-amber-600" size={20} />
                  <span className="text-xs font-black text-amber-800 uppercase tracking-widest">Ostrzeżenia</span>
                </div>
                <h4 className="text-2xl font-black text-amber-900 leading-none">12</h4>
                <p className="text-xs text-amber-700 mt-1">Wymaga ręcznej weryfikacji</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h4 className="text-sm font-black text-[#1a2b4d] uppercase tracking-widest mb-6 border-b border-gray-50 pb-4 flex items-center gap-3">
              <TableIcon size={18} className="text-blue-500" />
              Format Pliku
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black flex items-center justify-center shrink-0">1</div>
                <div>
                  <p className="text-xs font-bold text-gray-800 mb-1">Klucz Główny</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">Pierwsza kolumna musi zawierać <span className="font-bold text-blue-600">ActionID</span> lub <span className="font-bold text-blue-600">Kod EAN</span>.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black flex items-center justify-center shrink-0">2</div>
                <div>
                  <p className="text-xs font-bold text-gray-800 mb-1">Nagłówki</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">Nazwy kolumn zostaną automatycznie dopasowane do atrybutów w systemie PIMM.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black flex items-center justify-center shrink-0">3</div>
                <div>
                  <p className="text-xs font-bold text-gray-800 mb-1">Maks. Rozmiar</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">Pliki do 20MB lub 5000 wierszy w jednym procesie importu.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-[#1a2b4d] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
            <h4 className="text-sm font-black uppercase italic tracking-widest mb-4">Pobierz Szablon</h4>
            <p className="text-xs opacity-70 leading-relaxed mb-6">Użyj naszego zoptymalizowanego szablonu, aby zapewnić 100% skuteczności importu.</p>
            <button className="w-full py-3 bg-white text-[#1a2b4d] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
              POBIERZ .XLSX
            </button>
          </div>

          {status === 'done' && (
            <button className="w-full flex items-center justify-between p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all group">
              <span className="text-[11px] font-black uppercase tracking-widest">Przejdź do produktów</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptionImporter;
