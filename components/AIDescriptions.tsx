
import React, { useState } from 'react';
import { Sparkles, Loader2, Send, Save, Copy } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';

const AIDescriptions: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [attributes, setAttributes] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!productName) return;
    setIsLoading(true);
    try {
      const attrs = attributes.split(',').map(a => a.trim()).filter(a => a);
      const description = await generateProductDescription(productName, attrs);
      setGeneratedText(description || '');
    } catch (error) {
      alert("Wystąpił błąd podczas generowania opisu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Generator Opisów AI</h2>
            <p className="text-xs text-gray-500">Wykorzystaj moc Gemini do tworzenia profesjonalnych opisów katalogowych.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nazwa Produktu</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="np. Smartwatch Pro X5"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Atrybuty (oddzielone przecinkami)</label>
              <textarea 
                rows={4}
                value={attributes}
                onChange={(e) => setAttributes(e.target.value)}
                placeholder="np. Wodoszczelność 5ATM, Ekran AMOLED, 14 dni na baterii..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !productName}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Generuj Opis
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wynik AI</span>
              {generatedText && (
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(generatedText)} className="text-gray-400 hover:text-blue-600">
                    <Copy size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-green-600">
                    <Save size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 text-sm text-gray-700 leading-relaxed overflow-y-auto">
              {generatedText ? (
                <div dangerouslySetInnerHTML={{ __html: generatedText }} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 text-center px-4">
                  <Sparkles size={32} className="mb-2 opacity-20" />
                  <p>Wprowadź dane produktu i kliknij przycisk generowania, aby zobaczyć magię AI.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDescriptions;
