
import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, Plus, ExternalLink, 
  ChevronDown, Package as PackageIcon, X, Check, 
  AlertCircle, Calendar, Boxes, Download, Trash2, 
  Sparkles, UserCheck, RefreshCw, FileSpreadsheet,
  Layers, CheckCircle2, Palette, PlusCircle, FileUp, ImagePlus, ImageMinus,
  Settings2, Paperclip, ImageIcon, Image, Layout
} from 'lucide-react';
import ProductDetails from './ProductDetails';

interface Group {
  id: string;
  name: string;
  subgroup: string;
}

const mockGroups: Group[] = [
  { id: 'ADA-ADA', name: '.Adaptery, przejściówki', subgroup: '.Adaptery, przejściówki (Grupa wyłą...' },
  { id: 'ADE-ADE', name: 'AKUMULATORY DO ELEKTRONARZĘ...', subgroup: 'AKUMULATORY DO ELEKTRONARZĘ...' },
  { id: 'ADE-LAA', name: 'AKUMULATORY DO ELEKTRONARZĘ...', subgroup: 'ŁADOWARKI DO AKUMULATORÓW' },
  { id: 'ADE-LDA', name: 'AKUMULATORY DO ELEKTRONARZĘ...', subgroup: 'ŁADOWARKI DO AKUMULATORÓW' },
  { id: 'ADI-KAP', name: 'AKCESORIA DO INSTRUMENTÓW', subgroup: 'KAPODASTER' },
  { id: 'ADI-KOS', name: 'AKCESORIA DO INSTRUMENTÓW', subgroup: 'KOSTKI' },
  { id: 'ADI-MET', name: 'AKCESORIA DO INSTRUMENTÓW', subgroup: 'METRONOMY I TUNERY' },
  { id: 'AKU-BIA', name: 'AKCESORIA DO BIURA', subgroup: 'AKCESORIA DO BIURA' },
];

const PRODUCT_IMG = "https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2025/7/pr_2025_7_16_8_18_16_480_00.jpg";

const UNIT_GROUPS: Record<string, string[]> = {
  length: ['mm', 'cm', 'm', 'cale'],
  weight: ['g', 'kg', 'lb'],
  storage: ['MB', 'GB', 'TB'],
  frequency: ['Hz', 'kHz', 'MHz', 'GHz']
};

const DICTIONARIES = {
  SpecAttributes: [
    { label: 'Typ produktu', unitGroup: null, values: ['Laptop', 'Desktop', 'Tablet', 'Monitor', 'Workstation'] },
    { label: 'Kolor produktu', unitGroup: null, values: ['Czarny', 'Srebrny', 'Biały', 'Szary', 'Niebieski', 'Złoty'] },
    { label: 'Przekątna', unitGroup: 'length' },
    { label: 'Rozdzielczość', unitGroup: null, values: ['1920 x 1080', '2560 x 1440', '3840 x 2160', '1366 x 768'] },
    { label: 'Model procesora', unitGroup: null },
    { label: 'Pojemność RAM', unitGroup: 'storage' },
    { label: 'Pojemność dysku', unitGroup: 'storage' },
    { label: 'Waga produktu', unitGroup: 'weight' },
    { label: 'Wysokość', unitGroup: 'length' },
    { label: 'Szerokość', unitGroup: 'length' },
    { label: 'Głębokość', unitGroup: 'length' },
    { label: 'Taktowanie procesora', unitGroup: 'frequency' },
    { label: 'System operacyjny', unitGroup: null, values: ['Windows 11 Home', 'Windows 11 Pro', 'macOS', 'Linux', 'Brak'] },
    { label: 'Powłoka matrycy', unitGroup: null, values: ['Matowa', 'Błyszcząca', 'Antyrefleksyjna'] },
    { label: 'Typ dysku', unitGroup: null, values: ['SSD', 'HDD', 'eMMC'] }
  ]
};

const mockProducts = [
  { id: '1', actionId: 'MOBESPTOR0002', ean: '5099206085816', partNumber: '910-005647', name: 'Logitech MX Master 3S Wireless Mouse', category: 'Akcesoria', producer: 'Logitech', productManager: 'Jan Kowalski', status: 'Active', image: PRODUCT_IMG, group: '.Adaptery, przejściówki', subgroup: '.Adaptery, przejściówki (Grupa wyłą...', stock: 142, createdAt: '2023-10-12', productType: 'MYSZKA', hasMarketingDescription: true },
  { id: '2', actionId: 'MOBESPTOR0003', ean: '5099206065002', partNumber: 'MQD83ZM/A', name: 'Lenovo Professional Product 3 - Edition 2024', category: 'Słuchawki', producer: 'Lenovo', productManager: 'Sebastian Osytek', status: 'Active', image: PRODUCT_IMG, group: 'AKCESORIA DO INSTRUMENTÓW', subgroup: 'KAPODASTER', stock: 0, createdAt: '2024-01-05', productType: 'SŁUCHAWKI', hasMarketingDescription: false },
  { id: '3', actionId: 'MOBESPTOR0004', ean: '4711081512394', partNumber: '90MB18Q0-M0EAY0', name: 'ASUS ROG STRIX Z690-F Gaming WiFi', category: 'Płyty główne', producer: 'Asus', productManager: 'Anna Nowak', status: 'Draft', image: PRODUCT_IMG, group: 'AKCESORIA DO BIURA', subgroup: 'AKCESORIA DO BIURA', stock: 5, createdAt: '2024-02-14', productType: 'PŁYTA GŁÓWNA', hasMarketingDescription: true },
  { id: '4', actionId: 'MOBESPTOR0005', ean: '8806094511512', partNumber: 'MZ-V8P2T0BW', name: 'Samsung 980 PRO 2TB NVMe SSD', category: 'Dyski SSD', producer: 'Samsung', productManager: 'Piotr Wiśniewski', status: 'Active', image: PRODUCT_IMG, group: 'DYSKI SSD', subgroup: 'DYSKI M.2 NVMe', stock: 89, createdAt: '2023-11-20', productType: 'DYSK SSD', hasMarketingDescription: false },
  { id: '5', actionId: 'MOBESPTOR0006', ean: '0195925340251', partNumber: 'MTJV3ZM/A', name: 'Apple MagSafe Charger with USB-C', category: 'Akcesoria', producer: 'Apple', productManager: 'Jan Kowalski', status: 'Pending', image: PRODUCT_IMG, group: '.Adaptery, przejściówki', subgroup: '.Adaptery, przejściówki (Grupa wyłą...', stock: 0, createdAt: '2024-02-01', productType: 'ŁADOWARKA', hasMarketingDescription: false },
  { id: '6', actionId: 'MOBESPTOR0007', ean: '197529432014', partNumber: '82XM004YPB', name: 'Lenovo Yoga Slim 6 i5-1240P/16GB/512/Win11', category: 'Notebooki', producer: 'Lenovo', productManager: 'Sebastian Osytek', status: 'Active', image: PRODUCT_IMG, group: 'NOTEBOOKI', subgroup: 'ULTRABOOKI', stock: 24, createdAt: '2024-03-10', productType: 'LAPTOP', hasMarketingDescription: true },
  { id: '7', actionId: 'MOBESPTOR0008', ean: '4889502123456', partNumber: 'WDS100T3B0C', name: 'WD Blue SN580 1TB NVMe Gen4 SSD', category: 'Dyski SSD', producer: 'WD', productManager: 'Piotr Wiśniewski', status: 'Active', image: PRODUCT_IMG, group: 'DYSKI SSD', subgroup: 'DYSKI M.2 NVMe', stock: 312, createdAt: '2024-01-15', productType: 'DYSK SSD', hasMarketingDescription: false },
  { id: '8', actionId: 'MOBESPTOR0009', ean: '6935364006532', partNumber: 'Tapo C212', name: 'TP-Link Tapo C212 Wi-Fi Home Security Camera', category: 'Kamery', producer: 'TP-Link', productManager: 'Marcin Zieliński', status: 'Active', image: PRODUCT_IMG, group: 'KAMERY', subgroup: 'KAMERY WI-FI', stock: 58, createdAt: '2024-02-28', productType: 'KAMERA', hasMarketingDescription: true },
  { id: '9', actionId: 'MOBESPTOR0010', ean: '8806090539121', partNumber: 'LS27AG500PPXEN', name: 'Samsung Odyssey G5 27" 144Hz 1ms Gaming', category: 'Monitory', producer: 'Samsung', productManager: 'Anna Nowak', status: 'Active', image: PRODUCT_IMG, group: 'MONITORY', subgroup: 'MONITORY GAMINGOWE', stock: 15, createdAt: '2023-12-01', productType: 'MONITOR', hasMarketingDescription: false },
  { id: '10', actionId: 'MOBESPTOR0011', ean: '4548736130983', partNumber: 'WH1000XM5B.CE7', name: 'Sony WH-1000XM5 Wireless Noise Cancelling', category: 'Słuchawki', producer: 'Sony', productManager: 'Sebastian Osytek', status: 'Active', image: PRODUCT_IMG, group: 'SŁUCHAWKI', subgroup: 'SŁUCHAWKI BEZPRZEWODOWE', stock: 42, createdAt: '2024-03-20', productType: 'SŁUCHAWKI', hasMarketingDescription: true }
];

interface ProductListProps {
  onNavigateToMarketing?: (actionId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onNavigateToMarketing }) => {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [viewingProduct, setViewingProduct] = useState<typeof mockProducts[0] | null>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [activeBulkModal, setActiveBulkModal] = useState<'attr' | 'file' | 'toggle_photos' | 'toggle_blocks' | null>(null);
  const [bulkAttrLabel, setBulkAttrLabel] = useState('');
  const [bulkAttrValue, setBulkAttrValue] = useState('');
  const [bulkAttrUnit, setBulkAttrUnit] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedProducers, setSelectedProducers] = useState<string[]>([]);
  const [selectedPMs, setSelectedPMs] = useState<string[]>([]);
  const [marketingFilter, setMarketingFilter] = useState<'ALL' | 'TAK' | 'NIE'>('ALL');
  const [onlyWithDescription, setOnlyWithDescription] = useState(false);

  const filteredGroups = mockGroups.filter(g => 
    g.id.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
    g.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
    g.subgroup.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  const displayProducts = mockProducts.filter(p => {
    if (showAvailableOnly && p.stock <= 0) return false;
    
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches = p.name.toLowerCase().includes(q) || 
                      p.actionId.toLowerCase().includes(q) || 
                      p.ean.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Multi-select filters
    if (selectedTypes.length > 0 && !selectedTypes.includes(p.productType)) return false;
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(p.status)) return false;
    if (selectedProducers.length > 0 && !selectedProducers.includes(p.producer)) return false;
    if (selectedPMs.length > 0 && !selectedPMs.includes(p.productManager)) return false;
    
    // Group filter (from modal)
    if (selectedGroups.length > 0 && !selectedGroups.includes(p.group)) return false;

    // Marketing filter
    if (marketingFilter === 'TAK' && !p.hasMarketingDescription) return false;
    if (marketingFilter === 'NIE' && p.hasMarketingDescription) return false;
    
    // Checkbox "Tylko z opisem"
    if (onlyWithDescription && !p.hasMarketingDescription) return false;

    return true;
  });

  const MultiSelectSearch: React.FC<{
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder: string;
  }> = ({ label, options, selected, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

    const toggleOption = (opt: string) => {
      if (selected.includes(opt)) {
        onChange(selected.filter(item => item !== opt));
      } else {
        onChange([...selected, opt]);
      }
    };

    return (
      <div className="space-y-2 relative">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
        </div>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full h-11 px-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all group"
        >
          <span className="text-sm font-semibold text-gray-700 truncate pr-4">
            {selected.length === 0 ? placeholder : `${selected.length} wybrano: ${selected.join(', ')}`}
          </span>
          <ChevronDown className={`text-gray-400 group-hover:text-blue-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={18} />
        </div>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-[120]" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[130] flex flex-col max-h-64 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Szukaj..."
                    className="w-full h-8 pl-9 pr-3 bg-gray-50 border border-gray-100 rounded-md text-xs outline-none focus:border-blue-400 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                {filteredOptions.map(opt => (
                  <div 
                    key={opt}
                    onClick={(e) => { e.stopPropagation(); toggleOption(opt); }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected.includes(opt) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                      {selected.includes(opt) && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-xs font-medium text-gray-700">{opt}</span>
                  </div>
                ))}
                {filteredOptions.length === 0 && (
                  <div className="p-4 text-center text-gray-400 text-xs italic">Brak wyników</div>
                )}
              </div>
              {selected.length > 0 && (
                <div className="p-2 border-top border-gray-100 bg-gray-50 flex justify-end">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onChange([]); }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                  >
                    Wyczyść
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(displayProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const toggleSelectProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedProducts(newSelected);
  };

  const handleBulkExcelExport = () => {
    alert(`Eksportowanie ${selectedProducts.size} produktów do pliku .xlsx...`);
  };

  const handleBulkStatusChange = () => {
    alert(`Otwieranie menu zmiany statusu dla ${selectedProducts.size} produktów.`);
  };

  const handleBulkAiGeneration = async () => {
    setIsProcessingBulk(true);
    // Symulacja procesu AI
    await new Promise(r => setTimeout(r, 2000));
    setIsProcessingBulk(false);
    alert(`Zakończono masowe generowanie opisów AI dla ${selectedProducts.size} produktów.`);
    setSelectedProducts(new Set());
  };

  const handleBulkDelete = () => {
    if (confirm(`Czy na pewno chcesz usunąć ${selectedProducts.size} produktów z katalogu? Operacja jest nieodwracalna.`)) {
      alert("Produkty zostały usunięte (symulacja).");
      setSelectedProducts(new Set());
    }
  };

  const checkProductTypeConsistency = () => {
    const selected = displayProducts.filter(p => selectedProducts.has(p.id));
    if (selected.length === 0) return true;
    const firstType = selected[0].productType;
    return selected.every(p => p.productType === firstType);
  };

  const handleOpenBulkAttr = () => {
    if (!checkProductTypeConsistency()) {
      alert("Operacja zablokowana: Wybrane produkty mają różne typy produktów. Akcja grupowa dodawania atrybutu wymaga identycznego typu produktu dla wszystkich zaznaczonych pozycji.");
      return;
    }
    setActiveBulkModal('attr');
  };

  const closeBulkModal = () => {
    setActiveBulkModal(null);
    setBulkAttrLabel('');
    setBulkAttrValue('');
    setBulkAttrUnit('');
  };

  const handleBulkAction = (type: string | null, data?: any) => {
    if (!type) return;
    setIsProcessingBulk(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessingBulk(false);
      closeBulkModal();
      alert(`Akcja grupowa (${type}) wykonana pomyślnie dla ${selectedProducts.size} produktów.`);
      setSelectedProducts(new Set());
    }, 1500);
  };

  if (viewingProduct) {
    return <ProductDetails product={viewingProduct} onBack={() => setViewingProduct(null)} onNavigateToMarketing={onNavigateToMarketing} />;
  }

  return (
    <div className="space-y-6 relative min-h-screen">
      {/* BULK ACTIONS FLOATING BAR */}
      {selectedProducts.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-4xl px-4 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-[#1e293b] text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-slate-700 backdrop-blur-md">
            <div className="flex items-center gap-6 pl-4 border-r border-slate-700 pr-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Zaznaczono</p>
                  <p className="text-lg font-black leading-none">{selectedProducts.size} produktów</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProducts(new Set())}
                className="text-slate-400 hover:text-white transition-colors"
                title="Wyczyść zaznaczenie"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-1 justify-center px-4">
              <button 
                onClick={handleBulkExcelExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
              >
                <FileSpreadsheet size={16} className="text-emerald-400" />
                Eksport Excel
              </button>
              <button 
                onClick={handleBulkStatusChange}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
              >
                <RefreshCw size={16} className="text-blue-400" />
                Zmień Status
              </button>
              <button 
                disabled={isProcessingBulk}
                onClick={handleBulkAiGeneration}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-900/40"
              >
                {isProcessingBulk ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Generuj AI
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
              >
                <UserCheck size={16} className="text-amber-400" />
                Przypisz PM
              </button>
              
              <div className="w-px h-8 bg-slate-700 mx-2" />
              
              <button 
                onClick={handleOpenBulkAttr}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
                title="Dodaj atrybut grupowo"
              >
                <PlusCircle size={16} className="text-emerald-400" />
                Atrybut
              </button>
              <button 
                onClick={() => setActiveBulkModal('file')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
                title="Dodaj plik grupowo"
              >
                <FileUp size={16} className="text-blue-400" />
                Plik
              </button>
              <button 
                onClick={() => setActiveBulkModal('toggle_photos')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
                title="Włącz/Wyłącz zdjęcia grupowo"
              >
                <Image size={16} className="text-indigo-400" />
                Zdjęcia ON/OFF
              </button>
              <button 
                onClick={() => setActiveBulkModal('toggle_blocks')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
                title="Włącz/Wyłącz opisy blokowe grupowo"
              >
                <Layout size={16} className="text-rose-400" />
                Bloki ON/OFF
              </button>
            </div>

            <div className="pr-2 ml-4">
              <button 
                onClick={handleBulkDelete}
                className="p-3 text-rose-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all"
                title="Usuń zaznaczone"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-black">
          <div className="bg-white w-full max-w-[750px] rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-12 flex-1">
                <h3 className="text-[15px] font-black text-gray-900 tracking-tight whitespace-nowrap uppercase">ZNAJDŹ GRUPĘ</h3>
                <div className="relative flex-1 max-w-[400px]">
                  <input 
                    type="text" 
                    value={groupSearchQuery}
                    onChange={(e) => setGroupSearchQuery(e.target.value)}
                    placeholder="Szukaj w Id, Grupie lub Podgrupie..." 
                    className="w-full h-10 pl-4 pr-10 border border-blue-200 rounded-lg text-[13px] text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                </div>
              </div>
              <button 
                onClick={() => setIsGroupModalOpen(false)}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={22} />
              </button>
            </div>
            <div className="px-6 py-3 bg-[#f8fbfe] border-b border-gray-100 flex text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="w-[120px]">ID GRUPY</div>
              <div className="w-[240px]">GRUPA</div>
              <div className="flex-1">PODGRUPA</div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => { setSelectedGroups([]); }}
                className={`w-full px-6 py-3 flex items-center text-left transition-colors border-b border-gray-50 group ${selectedGroups.length === 0 ? 'bg-[#e7f7f0]' : 'hover:bg-gray-50'}`}
              >
                <div className="text-[13px] font-bold text-[#107c41] flex-1">Wszystkie grupy</div>
                {selectedGroups.length === 0 && <Check size={16} className="text-[#107c41]" />}
              </button>
              {filteredGroups.map((group) => {
                const isSelected = selectedGroups.includes(group.name);
                return (
                  <button 
                    key={group.id}
                    onClick={() => { 
                      if (isSelected) {
                        setSelectedGroups(selectedGroups.filter(g => g !== group.name));
                      } else {
                        setSelectedGroups([...selectedGroups, group.name]);
                      }
                    }}
                    className={`w-full px-6 py-3.5 flex items-center text-left transition-colors border-b border-gray-50 hover:bg-gray-50 group ${isSelected ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="w-10 flex items-center">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                    <div className="w-[120px] text-[12px] font-bold text-blue-600 font-mono">{group.id}</div>
                    <div className="w-[240px] text-[11px] font-medium text-gray-500 pr-4">{group.name}</div>
                    <div className="flex-1 text-[11px] text-gray-400 truncate">{group.subgroup}</div>
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedGroups([])}
                className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-700"
              >
                Wyczyść
              </button>
              <button 
                onClick={() => setIsGroupModalOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
              >
                Zastosuj
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Katalog Produktów</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">WYSZUKAJ PRODUKT (EAN, KOD ACTIONID, NAZWA)</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Wpisz np. 509920..., PERLOG..., Dell XPS..." 
                className="w-full h-12 pl-12 pr-4 bg-gray-50/50 border border-gray-200 rounded-lg text-[14px] text-black focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="lg:w-auto flex gap-4">
            <div className="space-y-2 w-48">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DOSTĘPNOŚĆ</label>
               <button 
                  onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                  className={`w-full h-12 px-4 rounded-lg flex items-center justify-between border-2 transition-all duration-300 ${
                    showAvailableOnly 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
               >
                  <div className="flex items-center gap-2">
                     <Check size={14} className={showAvailableOnly ? 'text-emerald-600' : 'text-gray-400'} />
                     <span className="text-[10px] font-black uppercase tracking-tight">Tylko na stanie</span>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${showAvailableOnly ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                     <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ease-in-out transform ${showAvailableOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MultiSelectSearch 
            label="typ produktu"
            options={Array.from(new Set(mockProducts.map(p => p.productType)))}
            selected={selectedTypes}
            onChange={setSelectedTypes}
            placeholder="Wszystkie typy"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">opis marketingowy</label>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={onlyWithDescription}
                  onChange={(e) => setOnlyWithDescription(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  id="marketing-check" 
                />
                <label htmlFor="marketing-check" className="text-[9px] font-bold text-gray-400 uppercase cursor-pointer">Tylko z opisem</label>
              </div>
            </div>
            <div className="relative">
              <select 
                value={marketingFilter}
                onChange={(e) => setMarketingFilter(e.target.value as any)}
                className="w-full h-11 px-4 appearance-none bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="ALL">Wszystkie</option>
                <option value="TAK">TAK</option>
                <option value="NIE">NIE</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
          <MultiSelectSearch 
            label="status"
            options={['Active', 'Draft', 'Pending']}
            selected={selectedStatuses}
            onChange={setSelectedStatuses}
            placeholder="Wszystkie statusy"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">KATEGORIA / GRUPA</label>
            </div>
            <div 
              onClick={() => setIsGroupModalOpen(true)}
              className="relative w-full h-11 px-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all group"
            >
              <span className="text-sm font-semibold text-gray-700 truncate pr-4">
                {selectedGroups.length === 0 ? 'Wszystkie grupy' : `${selectedGroups.length} wybrano: ${selectedGroups.join(', ')}`}
              </span>
              <ChevronDown className="text-gray-400 group-hover:text-blue-500 shrink-0" size={18} />
            </div>
          </div>
          <MultiSelectSearch 
            label="PRODUCENT"
            options={Array.from(new Set(mockProducts.map(p => p.producer)))}
            selected={selectedProducers}
            onChange={setSelectedProducers}
            placeholder="Wszystkie"
          />
          <MultiSelectSearch 
            label="PRODUCT MANAGER"
            options={Array.from(new Set(mockProducts.map(p => p.productManager)))}
            selected={selectedPMs}
            onChange={setSelectedPMs}
            placeholder="Wszystkie"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-24">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-4 py-4 w-10 relative">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    checked={selectedProducts.size === displayProducts.length && displayProducts.length > 0}
                  />
                </th>
                <th className="px-6 py-4 w-40">
                  <div className="flex items-center gap-2">
                    ACTIONID
                    {selectedProducts.size > 0 && (
                      <div className="flex items-center gap-1 ml-2">
                        <button onClick={handleOpenBulkAttr} className="p-1 hover:bg-gray-200 rounded text-emerald-600" title="Dodaj atrybut"><PlusCircle size={14}/></button>
                        <button onClick={() => setActiveBulkModal('file')} className="p-1 hover:bg-gray-200 rounded text-blue-600" title="Dodaj plik"><FileUp size={14}/></button>
                        <button onClick={() => setActiveBulkModal('toggle_photos')} className="p-1 hover:bg-gray-200 rounded text-indigo-600" title="Włącz/Wyłącz zdjęcia"><Image size={14}/></button>
                        <button onClick={() => setActiveBulkModal('toggle_blocks')} className="p-1 hover:bg-gray-200 rounded text-rose-600" title="Włącz/Wyłącz bloki"><Layout size={14}/></button>
                      </div>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4">Nazwa Produktu</th>
                <th className="px-6 py-4">Stan</th>
                <th className="px-6 py-4">Part Number</th>
                <th className="px-6 py-4">Producent</th>
                <th className="px-6 py-4">PM</th>
                <th className="px-6 py-4">typ produktu</th>
                <th className="px-6 py-4">Kategoria</th>
                <th className="px-6 py-4">Utworzono</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Opis</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayProducts.map((p) => (
                <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors group cursor-pointer ${selectedProducts.has(p.id) ? 'bg-blue-50/50' : ''}`} onClick={() => setViewingProduct(p)}>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedProducts.has(p.id)}
                      onChange={() => toggleSelectProduct(p.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-black text-blue-700 underline decoration-blue-100 decoration-2 tracking-tight whitespace-nowrap">{p.actionId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 leading-tight">{p.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{p.ean}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 font-black text-[12px] ${p.stock > 0 ? 'text-[#107c41]' : 'text-rose-500'}`}>
                      <Boxes size={14} />
                      {p.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-gray-500 font-mono">{p.partNumber}</td>
                  <td className="px-6 py-4"><span className="text-[12px] font-bold text-gray-600">{p.producer}</span></td>
                  <td className="px-6 py-4"><span className="text-[11px] font-medium text-blue-500 whitespace-nowrap">{p.productManager}</span></td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm">
                      {p.productType}
                    </span>
                  </td>
                  <td className="px-6 py-4"><span className="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">{p.category}</span></td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                        <Calendar size={12} />
                        {p.createdAt}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      p.status === 'Active' ? 'bg-green-50 text-green-600' : 
                      p.status === 'Draft' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToMarketing?.(p.actionId);
                      }}
                      className={`p-2 rounded-xl transition-all ${p.hasMarketingDescription ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-gray-400 bg-gray-50 hover:bg-blue-50 hover:text-blue-600'}`}
                      title={p.hasMarketingDescription ? "Edytuj opis marketingowy" : "Utwórz opis marketingowy"}
                    >
                      <Palette size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-gray-400 hover:text-blue-600"><ExternalLink size={16} /></button>
                      <button className="p-1 text-gray-400 hover:text-gray-800"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayProducts.length === 0 && (
                <tr>
                   <td colSpan={12} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                            <AlertCircle size={32} />
                         </div>
                         <h3 className="text-sm font-bold text-gray-700">Nie znaleziono produktów spełniających kryteria</h3>
                         <button 
                            onClick={() => { 
                              setShowAvailableOnly(false); 
                              setSearchQuery('');
                              setSelectedTypes([]);
                              setSelectedStatuses([]);
                              setSelectedProducers([]);
                              setSelectedPMs([]);
                              setMarketingFilter('ALL');
                              setOnlyWithDescription(false);
                              setSelectedGroups([]);
                            }}
                            className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                         >
                            Wyczyść filtry
                         </button>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BULK ACTION MODALS */}
      {activeBulkModal && (
        <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 text-black">
            <div className="p-6 bg-[#1e293b] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeBulkModal === 'attr' && <PlusCircle size={20} className="text-emerald-400" />}
                {activeBulkModal === 'file' && <FileUp size={20} className="text-blue-400" />}
                {activeBulkModal === 'toggle_photos' && <Image size={20} className="text-indigo-400" />}
                {activeBulkModal === 'toggle_blocks' && <Layout size={20} className="text-rose-400" />}
                <h3 className="text-sm font-black uppercase tracking-widest">
                  {activeBulkModal === 'attr' && 'Dodaj atrybut grupowo'}
                  {activeBulkModal === 'file' && 'Dodaj plik grupowo'}
                  {activeBulkModal === 'toggle_photos' && 'Włącz/Wyłącz zdjęcia'}
                  {activeBulkModal === 'toggle_blocks' && 'Włącz/Wyłącz opisy blokowe'}
                </h3>
              </div>
              <button onClick={closeBulkModal} className="hover:bg-white/10 p-2 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">
                Wykonujesz akcję dla <span className="text-blue-600">{selectedProducts.size}</span> zaznaczonych produktów.
              </p>

              {activeBulkModal === 'attr' && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl mb-4">
                    <p className="text-[11px] font-bold text-emerald-800">Wszystkie wybrane produkty mają typ: <span className="uppercase font-black">{displayProducts.find(p => selectedProducts.has(p.id))?.productType}</span></p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Wybierz atrybut</label>
                    <select 
                      value={bulkAttrLabel}
                      onChange={(e) => {
                        const attr = DICTIONARIES.SpecAttributes.find(a => a.label === e.target.value);
                        setBulkAttrLabel(e.target.value);
                        setBulkAttrValue('');
                        setBulkAttrUnit(attr?.unitGroup ? UNIT_GROUPS[attr.unitGroup][0] : '');
                      }}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    >
                      <option value="">Wybierz...</option>
                      {DICTIONARIES.SpecAttributes.map(a => (
                        <option key={a.label} value={a.label}>{a.label}</option>
                      ))}
                    </select>
                  </div>

                  {bulkAttrLabel && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Wartość atrybutu</label>
                        <span className="text-[9px] font-black px-2 py-0.5 bg-blue-100 text-blue-600 rounded uppercase">
                          {DICTIONARIES.SpecAttributes.find(a => a.label === bulkAttrLabel)?.values ? 'Lista wartości' : 'Wpis ręczny'}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1">
                          {DICTIONARIES.SpecAttributes.find(a => a.label === bulkAttrLabel)?.values ? (
                            <select 
                              value={bulkAttrValue}
                              onChange={(e) => setBulkAttrValue(e.target.value)}
                              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                            >
                              <option value="">Wybierz wartość...</option>
                              {DICTIONARIES.SpecAttributes.find(a => a.label === bulkAttrLabel)?.values?.map(v => (
                                <option key={v} value={v}>{v}</option>
                              ))}
                            </select>
                          ) : (
                            <input 
                              type="text" 
                              value={bulkAttrValue}
                              onChange={(e) => setBulkAttrValue(e.target.value)}
                              placeholder="Wpisz wartość..." 
                              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" 
                            />
                          )}
                        </div>

                        {DICTIONARIES.SpecAttributes.find(a => a.label === bulkAttrLabel)?.unitGroup && (
                          <div className="w-24">
                            <select 
                              value={bulkAttrUnit}
                              onChange={(e) => setBulkAttrUnit(e.target.value)}
                              className="w-full h-12 px-4 bg-blue-50 border border-blue-200 rounded-xl text-sm font-black text-blue-700 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                            >
                              {UNIT_GROUPS[DICTIONARIES.SpecAttributes.find(a => a.label === bulkAttrLabel)!.unitGroup!].map(u => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeBulkModal === 'file' && (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 group hover:border-blue-400 transition-all cursor-pointer">
                  <FileUp size={48} className="text-slate-300 group-hover:text-blue-500 transition-all mb-4" />
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Przeciągnij plik tutaj</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">lub kliknij aby wybrać z dysku</p>
                </div>
              )}

              {activeBulkModal === 'toggle_photos' && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">Wybierz status widoczności zdjęć dla zaznaczonych produktów:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-6 border-2 border-blue-100 bg-blue-50/50 rounded-2xl flex flex-col items-center gap-3 hover:border-blue-500 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                        <Check className="text-blue-600" size={24} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-blue-900">Włącz zdjęcia</span>
                    </button>
                    <button className="p-6 border-2 border-slate-100 bg-slate-50/50 rounded-2xl flex flex-col items-center gap-3 hover:border-rose-500 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                        <X className="text-rose-600" size={24} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900">Wyłącz zdjęcia</span>
                    </button>
                  </div>
                </div>
              )}

              {activeBulkModal === 'toggle_blocks' && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">Wybierz status aktywności opisów blokowych dla zaznaczonych produktów:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-6 border-2 border-emerald-100 bg-emerald-50/50 rounded-2xl flex flex-col items-center gap-3 hover:border-emerald-500 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                        <Check className="text-emerald-600" size={24} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-900">Włącz bloki</span>
                    </button>
                    <button className="p-6 border-2 border-slate-100 bg-slate-50/50 rounded-2xl flex flex-col items-center gap-3 hover:border-rose-500 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                        <X className="text-rose-600" size={24} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900">Wyłącz bloki</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={closeBulkModal} 
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
              >
                Anuluj
              </button>
              <button 
                disabled={isProcessingBulk}
                onClick={() => handleBulkAction(activeBulkModal)}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all"
              >
                {isProcessingBulk ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
                Zatwierdź Akcję
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
