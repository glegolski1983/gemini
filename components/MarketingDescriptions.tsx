
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Palette, 
  Sparkles, 
  Layout, 
  Monitor, 
  ShoppingBag, 
  Store, 
  Dog, 
  Image as ImageIcon, 
  ChevronRight, 
  Loader2, 
  Copy, 
  Save, 
  RefreshCw,
  Zap,
  AlignLeft,
  AlignRight,
  Maximize,
  Type,
  Search,
  CheckCircle2,
  Check,
  Package,
  FileText,
  Database,
  X,
  Target,
  PenTool,
  Smile,
  Bold,
  List as ListIcon,
  Globe,
  Settings2,
  Upload,
  Plus,
  Trash2,
  Camera,
  ChevronUp,
  LayoutGrid,
  Layers,
  Video,
  FileCode,
  Grid3X3,
  ArrowUp,
  ArrowDown,
  ExternalLink
} from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';

// Mock products data for selection
const MOCK_PRODUCTS = [
  { 
    id: '1', 
    actionId: 'MOBESPTOR0002', 
    name: 'Logitech MX Master 3S', 
    category: 'Myszki', 
    images: [
      "https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2025/7/pr_2025_7_16_8_18_16_480_00.jpg",
      "https://picsum.photos/seed/mx1/800/600",
      "https://picsum.photos/seed/mx2/800/600"
    ],
    specs: "Sensor 8000 DPI, Ciche kliknięcia, MagSpeed, Ergonomiczny kształt, USB-C, Bluetooth"
  },
  { 
    id: '2', 
    actionId: 'MOBESPTOR0003', 
    name: 'Lenovo Professional Product 3', 
    category: 'Słuchawki', 
    images: [
      "https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2025/7/pr_2025_7_16_8_18_16_480_00.jpg"
    ],
    specs: "Active Noise Cancelling, 40h pracy, Hi-Res Audio, Składana konstrukcja, Mikrofon z redukcją szumów"
  },
  { 
    id: '3', 
    actionId: 'MOBESPTOR0004', 
    name: 'ASUS ROG STRIX Z690-F', 
    category: 'Płyty główne', 
    images: [
      "https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2025/7/pr_2025_7_16_8_18_16_480_00.jpg"
    ],
    specs: "LGA1700, DDR5, PCIe 5.0, WiFi 6E, 18+1 faz zasilania, 4x M.2"
  },
  { 
    id: '4', 
    actionId: 'MOBESPTOR0005', 
    name: 'Samsung 980 PRO 2TB', 
    category: 'Dyski SSD', 
    images: [
      "https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2025/7/pr_2025_7_16_8_18_16_480_00.jpg"
    ],
    specs: "PCIe 4.0 NVMe, 7000MB/s odczyt, 5100MB/s zapis, Cache 2GB LPDDR4, 5 lat gwarancji"
  }
];

type Platform = 'Sferis' | 'Allegro' | 'Krakvet';
type LayoutType = 'image-left' | 'image-right' | 'image-top' | 'text-only' | 'image-background' | 'gallery-grid';
type DescriptionStyle = 'Professional' | 'Sales' | 'Storytelling' | 'Minimalist' | 'Technical';
type ContentType = 'text' | 'image' | 'video' | 'iframe';

interface CellContent {
  type: ContentType;
  content: string;
}

interface DescriptionBlock {
  id: string;
  backgroundColor: string;
  textColor: string;
  order: number;
  columns: number;
  rows: number;
  cells: Record<string, CellContent>;
}

interface MarketingDescriptionsProps {
  initialActionId?: string | null;
}

const MarketingDescriptions: React.FC<MarketingDescriptionsProps> = ({ initialActionId }) => {
  const [platform, setPlatform] = useState<Platform>('Sferis');
  const [layout, setLayout] = useState<LayoutType>('image-left');
  const [descStyle, setDescStyle] = useState<DescriptionStyle>('Professional');
  
  // Individual section layouts state
  const [sectionLayouts, setSectionLayouts] = useState<Record<number, LayoutType>>({});
  const [configActiveImageIndex, setConfigActiveImageIndex] = useState<number | 'global'>('global');

  // Gallery states
  const [productGallery, setProductGallery] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Styling Options
  const [options, setOptions] = useState({
    emojis: true,
    bolding: true,
    lists: true,
    seo: false
  });

  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null);
  const [useSpecs, setUseSpecs] = useState(true);
  const [attributes, setAttributes] = useState('Przykładowy benefit 1, Przykładowy benefit 2');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [descriptionMode, setDescriptionMode] = useState<'standard' | 'block'>('block');
  
  // New Block-based editor state
  const [blocks, setBlocks] = useState<DescriptionBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<DescriptionBlock | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const handleAddBlock = () => {
    const newBlock: DescriptionBlock = {
      id: `block-${Date.now()}`,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      order: blocks.length,
      columns: 1,
      rows: 1,
      cells: {
        '0-0': { type: 'text', content: '' }
      }
    };
    setEditingBlock(newBlock);
    setIsBlockModalOpen(true);
  };

  const handleEditBlock = (block: DescriptionBlock) => {
    setEditingBlock({ ...block });
    setIsBlockModalOpen(true);
  };

  const handleSaveBlock = () => {
    if (!editingBlock) return;
    
    setBlocks(prev => {
      const exists = prev.find(b => b.id === editingBlock.id);
      if (exists) {
        return prev.map(b => b.id === editingBlock.id ? editingBlock : b).sort((a, b) => a.order - b.order);
      }
      return [...prev, editingBlock].sort((a, b) => a.order - b.order);
    });
    setIsBlockModalOpen(false);
    setEditingBlock(null);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orders
    const tempOrder = newBlocks[index].order;
    newBlocks[index].order = newBlocks[targetIndex].order;
    newBlocks[targetIndex].order = tempOrder;

    setBlocks(newBlocks.sort((a, b) => a.order - b.order));
  };

  useEffect(() => {
    if (initialActionId) {
      const prod = MOCK_PRODUCTS.find(p => p.actionId === initialActionId);
      if (prod) {
        handleSelectProduct(prod);
      } else {
        setProductSearch(initialActionId);
      }
    }
  }, [initialActionId]);

  const platforms = [
    { name: 'Sferis', icon: <ShoppingBag size={18} />, color: 'bg-blue-600' },
    { name: 'Allegro', icon: <Store size={18} />, color: 'bg-orange-500' },
    { name: 'Krakvet', icon: <Dog size={18} />, color: 'bg-emerald-600' },
  ];

  const layouts = [
    { id: 'image-left', icon: <AlignLeft size={18} />, label: 'Zdjęcie Lewo' },
    { id: 'image-right', icon: <AlignRight size={18} />, label: 'Zdjęcie Prawo' },
    { id: 'image-top', icon: <ChevronUp size={18} />, label: 'Zdjęcie Góra' },
    { id: 'image-background', icon: <Maximize size={18} />, label: 'Pełna Szerokość' },
    { id: 'gallery-grid', icon: <LayoutGrid size={18} />, label: 'Grid Galerii' },
    { id: 'text-only', icon: <Type size={18} />, label: 'Brak Zdjęć' },
  ];

  const styles = [
    { id: 'Professional', label: 'Profesjonalny', icon: <Target size={16} /> },
    { id: 'Sales', label: 'Sprzedażowy', icon: <Zap size={16} /> },
    { id: 'Storytelling', label: 'Storytelling', icon: <PenTool size={16} /> },
    { id: 'Minimalist', label: 'Minimalistyczny', icon: <AlignLeft size={16} /> },
    { id: 'Technical', label: 'Techniczny', icon: <Settings2 size={16} /> },
  ];

  const filteredProducts = useMemo(() => {
    if (!productSearch) return [];
    return MOCK_PRODUCTS.filter(p => 
      p.actionId.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productSearch]);

  const handleSelectProduct = (p: typeof MOCK_PRODUCTS[0]) => {
    setSelectedProduct(p);
    setProductSearch(p.actionId);
    setProductGallery(p.images || []);
    setSelectedImageIndex(0);
    setShowSearchDropdown(false);
    
    // Reset section layouts
    const initialLayouts: Record<number, LayoutType> = {};
    (p.images || []).forEach((_, i) => {
      initialLayouts[i] = layout;
    });
    setSectionLayouts(initialLayouts);
    setConfigActiveImageIndex('global');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImage = event.target.result as string;
          const newIndex = productGallery.length;
          setProductGallery(prev => [...prev, newImage]);
          setSectionLayouts(prev => ({ ...prev, [newIndex]: layout }));
          // Auto switch to newly added image to let user configure it
          if (productGallery.length > 0) {
             setConfigActiveImageIndex(newIndex);
          }
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = productGallery.filter((_, i) => i !== index);
    setProductGallery(newGallery);
    // Cleanup layouts
    const newLayouts: Record<number, LayoutType> = {};
    newGallery.forEach((_, i) => {
      newLayouts[i] = sectionLayouts[i >= index ? i + 1 : i] || layout;
    });
    setSectionLayouts(newLayouts);
    if (selectedImageIndex >= newGallery.length) {
      setSelectedImageIndex(Math.max(0, newGallery.length - 1));
    }
    setConfigActiveImageIndex('global');
  };

  const handleGlobalLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    // Apply to all existing sections
    const updatedLayouts: Record<number, LayoutType> = {};
    productGallery.forEach((_, i) => {
      updatedLayouts[i] = newLayout;
    });
    setSectionLayouts(updatedLayouts);
  };

  const handleLayoutClick = (newLayout: LayoutType) => {
    if (configActiveImageIndex === 'global') {
      handleGlobalLayoutChange(newLayout);
    } else {
      handleSectionLayoutChange(configActiveImageIndex, newLayout);
    }
  };

  const handleSectionLayoutChange = (idx: number, newLayout: LayoutType) => {
    setSectionLayouts(prev => ({ ...prev, [idx]: newLayout }));
  };

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setIsLoading(true);
    try {
      const attrs = attributes.split(',').map(a => a.trim());
      const basePromptAttrs = [...attrs];
      
      if (useSpecs && selectedProduct.specs) {
        basePromptAttrs.push(`Specyfikacja techniczna: ${selectedProduct.specs}`);
      }

      const enrichedAttributes = [
        ...basePromptAttrs, 
        `Platforma docelowa: ${platform}`,
        `Kategoria: ${selectedProduct.category}`,
        `Liczba sekcji wizualnych: ${productGallery.length || 1}`
      ];
      
      const result = await generateProductDescription(selectedProduct.name, enrichedAttributes, descStyle, options);
      setGeneratedContent(result);
    } catch (error) {
      alert("Błąd generowania opisu.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOption = (opt: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [opt]: !prev[opt] }));
  };

  // Split generated content into logical sections for multi-image layout
  const contentSections = useMemo(() => {
    if (!generatedContent) return [];
    const sections = generatedContent.split('</p>').filter(s => s.trim().length > 0).map(s => s + '</p>');
    
    const result: string[] = [];
    const imagesCount = productGallery.length || 1;
    const sectionsPerImage = Math.max(1, Math.ceil(sections.length / imagesCount));
    
    for (let i = 0; i < imagesCount; i++) {
      const start = i * sectionsPerImage;
      const end = start + sectionsPerImage;
      result.push(sections.slice(start, end).join(''));
    }
    return result;
  }, [generatedContent, productGallery.length]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-black pb-20">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
        accept="image/*" 
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 uppercase italic">
            <Palette className="text-blue-600" size={36} />
            Kreator Opisów
          </h2>
          <p className="text-gray-500 font-medium">Twórz spójne i angażujące treści marketingowe dopasowane do Twojego kanału sprzedaży.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Platform Select */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm relative z-[110]">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">1. Wybierz Kanał Sprzedaży</h3>
            <div className="grid grid-cols-3 gap-3">
              {platforms.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setPlatform(p.name as Platform)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-3xl transition-all border ${
                    platform === p.name 
                      ? `${p.color} text-white border-transparent shadow-lg scale-105` 
                      : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-blue-200'
                  }`}
                >
                  {p.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Product Search & Selection */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm relative z-[100]">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">2. Wybierz Produkt (ACTIONID)</h3>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              <input 
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Wpisz kod ACTIONID..."
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
              />
              {selectedProduct && (
                <button 
                  onClick={() => { setSelectedProduct(null); setProductSearch(''); setProductGallery([]); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500"
                >
                  <X size={16} />
                </button>
              )}

              {showSearchDropdown && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                  {filteredProducts.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-blue-50 border-b border-gray-50 last:border-0 text-left transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
                        <ImageIcon size={18} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-tighter leading-none mb-1">{p.actionId}</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedProduct && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in zoom-in-95">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                   <CheckCircle2 size={24} />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Wybrany indeks</p>
                   <p className="text-xs font-black text-emerald-900 truncate uppercase">{selectedProduct.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Product Gallery Management */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">3. Galeria Produktu</h3>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                >
                  <Plus size={14}/>
                  <span className="text-[9px] font-black uppercase">Dodaj Zdjęcie</span>
                </button>
             </div>
             
             {productGallery.length > 0 ? (
               <div className="grid grid-cols-4 gap-3">
                  {productGallery.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group/thumb cursor-pointer ${selectedImageIndex === idx ? 'border-blue-600 ring-4 ring-blue-500/10' : 'border-gray-100 hover:border-blue-200'}`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                       <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx); }}
                            className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all"
                          >
                             <Trash2 size={12} />
                          </button>
                       </div>
                       {selectedImageIndex === idx && (
                         <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-md">
                            <Check size={8} strokeWidth={4} />
                         </div>
                       )}
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-8 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-300 gap-2">
                  <Camera size={32} strokeWidth={1.5} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Brak zdjęć</span>
               </div>
             )}
          </div>

          {/* 4. Style Selection */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">4. Styl Komunikacji</h3>
            <div className="grid grid-cols-1 gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setDescStyle(s.id as DescriptionStyle)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all ${
                    descStyle === s.id 
                      ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg' 
                      : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {s.icon}
                  <span className="text-[11px] font-black uppercase tracking-widest">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Styling Options */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">5. Opcje Formatowania</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => toggleOption('emojis')}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${options.emojis ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'}`}
              >
                <Smile size={18} />
                <span className="text-[10px] font-black uppercase">Emoji</span>
              </button>
              <button 
                onClick={() => toggleOption('bolding')}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${options.bolding ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'}`}
              >
                <Bold size={18} />
                <span className="text-[10px] font-black uppercase">Pogrubienia</span>
              </button>
              <button 
                onClick={() => toggleOption('lists')}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${options.lists ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'}`}
              >
                <ListIcon size={18} />
                <span className="text-[10px] font-black uppercase">Listy</span>
              </button>
              <button 
                onClick={() => toggleOption('seo')}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${options.seo ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'}`}
              >
                <Globe size={18} />
                <span className="text-[10px] font-black uppercase">SEO Opt.</span>
              </button>
            </div>
          </div>

          {/* 6. Layout Selection (Enhanced with image selector) */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">6. Struktura Wizualna</h3>
            
            {productGallery.length > 1 && (
              <div className="mb-6 space-y-3">
                 <div className="flex items-center justify-between px-1">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Wybierz zdjęcie do edycji układu:</p>
                   <button 
                      onClick={() => setConfigActiveImageIndex('global')}
                      className={`text-[8px] font-black uppercase px-2 py-1 rounded transition-all ${configActiveImageIndex === 'global' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                   >
                     Globalnie (Wszystkie)
                   </button>
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {productGallery.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setConfigActiveImageIndex(idx)}
                        className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${configActiveImageIndex === idx ? 'border-blue-600 scale-110 z-10 shadow-lg' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                      >
                         <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                         <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[7px] px-1 font-black leading-none">#{idx + 1}</span>
                      </button>
                    ))}
                 </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {layouts.map((l) => {
                const isActive = configActiveImageIndex === 'global' 
                  ? layout === l.id 
                  : (sectionLayouts[configActiveImageIndex as number] || layout) === l.id;
                
                return (
                  <button
                    key={l.id}
                    onClick={() => handleLayoutClick(l.id as LayoutType)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-inner font-bold' 
                        : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {l.icon}
                    <span className="text-[9px] font-black uppercase tracking-widest">{l.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
               <p className="text-[8px] text-gray-400 italic">
                 {configActiveImageIndex === 'global' 
                    ? 'Ustawienia zostaną zastosowane do wszystkich zdjęć.' 
                    : `Edytujesz układ tylko dla zdjęcia #${(configActiveImageIndex as number) + 1}.`}
               </p>
               {configActiveImageIndex !== 'global' && (
                 <button 
                  onClick={() => handleGlobalLayoutChange(sectionLayouts[configActiveImageIndex as number] || layout)}
                  className="flex items-center gap-1 text-[8px] font-black text-blue-600 uppercase hover:underline"
                 >
                   <Layers size={10} /> Zastosuj do wszystkich
                 </button>
               )}
            </div>
          </div>

          {/* 7. Input Data */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">7. Dane wejściowe dla AI</h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => setUseSpecs(!useSpecs)}
                disabled={!selectedProduct}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  useSpecs 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                    : 'bg-gray-50 border-gray-100 text-gray-400 grayscale opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                   <Database size={18} />
                   <span className="text-xs font-black uppercase tracking-widest text-left">Specyfikacja techniczna</span>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${useSpecs ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                   <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${useSpecs ? 'translate-x-4' : ''}`} />
                </div>
              </button>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Dodatkowe benefity</label>
                <textarea 
                  rows={3}
                  value={attributes}
                  onChange={(e) => setAttributes(e.target.value)}
                  placeholder="np. Limitowana edycja, 5 lat gwarancji..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading || !selectedProduct}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Generuj Opis AI
            </button>
          </div>

          {/* 8. Custom Blocks Management */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">8. Bloki Opisu (Manualne)</h3>
              <button 
                onClick={handleAddBlock}
                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={14}/>
                <span className="text-[9px] font-black uppercase">Dodaj Blok</span>
              </button>
            </div>

            <div className="space-y-3">
              {blocks.length === 0 ? (
                <div className="py-6 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-300 gap-2">
                  <Grid3X3 size={24} strokeWidth={1.5} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Brak bloków</span>
                </div>
              ) : (
                blocks.map((block, idx) => (
                  <div key={block.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black bg-white border border-gray-200">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Sekcja {block.columns}x{block.rows}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: block.backgroundColor }} />
                          <span className="text-[8px] font-bold text-gray-400 uppercase">{block.backgroundColor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveBlock(block.id, 'up')} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><ArrowUp size={14}/></button>
                      <button onClick={() => moveBlock(block.id, 'down')} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><ArrowDown size={14}/></button>
                      <button onClick={() => handleEditBlock(block)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><Settings2 size={14}/></button>
                      <button onClick={() => handleDeleteBlock(block.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#1a2b4d] p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-blue-900/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Monitor size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Podgląd Real-Time</h4>
                <p className="text-sm font-black mt-0.5">{platform} / Styl: {descStyle} / {selectedProduct?.actionId || '---'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all" title="Kopiuj HTML">
                <Copy size={18} />
              </button>
              <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all" title="Zapisz do PIMM">
                <Save size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-gray-200 shadow-sm min-h-[800px] overflow-hidden flex flex-col relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
                  <RefreshCw className="animate-spin" size={32} />
                </div>
                <p className="text-sm font-black text-blue-900 uppercase tracking-widest">Model Gemini przetwarza dane...</p>
              </div>
            )}

            {descriptionMode === 'block' && blocks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95 duration-500">
                 <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-8 shadow-inner border border-blue-100">
                    <LayoutGrid size={48} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 uppercase tracking-[0.2em] mb-3">Kreator Blokowy</h3>
                 <p className="text-sm text-gray-500 max-w-sm mb-10 font-medium leading-relaxed">
                   Zacznij budować swój opis od podstaw. Dodawaj bloki, konfiguruj ich układ, kolory i zawartość, aby stworzyć unikalną prezentację produktu.
                 </p>
                 <button 
                   onClick={handleAddBlock}
                   className="flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95"
                 >
                   <Plus size={20} />
                   Dodaj Pierwszy Blok Opisu
                 </button>
              </div>
            ) : !generatedContent && !isLoading && descriptionMode === 'standard' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4 opacity-50 p-20 text-center">
                 <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Package size={48} strokeWidth={1} />
                 </div>
                 <p className="text-lg font-black uppercase tracking-widest text-gray-400">Skonfiguruj parametry i wygeneruj treść</p>
                 <p className="text-sm font-medium text-gray-300 max-w-xs mt-2">Kreator wykorzysta wybrany kanał sprzedaży i styl komunikacji do stworzenia idealnego opisu.</p>
              </div>
            ) : (
              <div className="p-12 animate-in fade-in duration-700">
                {/* Header info */}
                <div className="mb-10 space-y-2">
                   <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight leading-none">
                     {selectedProduct?.name || 'Nazwa Produktu'}
                   </h1>
                   <div className="flex items-center gap-3">
                      <span className="h-1 w-20 bg-blue-600 rounded-full" />
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded tracking-widest border border-blue-100">Styl: {descStyle}</span>
                      <span className={`px-2 py-0.5 ${platforms.find(p => p.name === platform)?.color} text-white text-[8px] font-black uppercase rounded tracking-widest`}>KANAŁ: {platform}</span>
                   </div>
                </div>

                {/* Multi-Section Content Rendering */}
                <div className="space-y-16">
                  {descriptionMode === 'standard' ? (
                    <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed marketing-output bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                      <div dangerouslySetInnerHTML={{ __html: generatedContent || '' }} />
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {blocks.map((block) => (
                        <div 
                          key={block.id} 
                          className="w-full overflow-hidden"
                          style={{ backgroundColor: block.backgroundColor, color: block.textColor }}
                        >
                          <div 
                            className="grid gap-8 p-12 max-w-7xl mx-auto"
                            style={{ 
                              gridTemplateColumns: `repeat(${block.columns}, 1fr)`,
                              gridTemplateRows: `repeat(${block.rows}, 1fr)`
                            }}
                          >
                            {Array.from({ length: block.rows }).map((_, r) => (
                              Array.from({ length: block.columns }).map((_, c) => {
                                const cell = block.cells[`${r}-${c}`];
                                if (!cell) return <div key={`${r}-${c}`} />;
                                
                                return (
                                  <div key={`${r}-${c}`} className="flex items-center justify-center">
                                    {cell.type === 'text' && (
                                      <div className="prose prose-sm max-w-none w-full" style={{ color: block.textColor }}>
                                        <div dangerouslySetInnerHTML={{ __html: cell.content || '' }} />
                                      </div>
                                    )}
                                    {cell.type === 'image' && cell.content && (
                                      <img src={cell.content} className="max-w-full h-auto rounded-2xl shadow-lg" alt="Block Content" />
                                    )}
                                    {cell.type === 'video' && cell.content && (
                                      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
                                        <iframe 
                                          src={cell.content.replace('watch?v=', 'embed/')} 
                                          className="w-full h-full border-0"
                                          allowFullScreen
                                        />
                                      </div>
                                    )}
                                    {cell.type === 'iframe' && cell.content && (
                                      <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                        <iframe src={cell.content} className="w-full h-full border-0" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Technical Tags at the bottom */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-10 border-t border-gray-100">
                   {(useSpecs && selectedProduct ? selectedProduct.specs.split(',').slice(0, 8) : attributes.split(',').slice(0, 8)).map((attr, i) => (
                     <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <Zap size={14} className="text-blue-500 shrink-0" />
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest leading-none">{attr.trim()}</span>
                     </div>
                   ))}
                </div>

                {/* Platform Specific Branding Overlay */}
                <div className="mt-20 pt-10 border-t border-gray-50 flex items-center justify-between text-gray-400">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Model: Gemini 3 Flash / Optimized for {platform}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                         <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50 leading-none">Template Engine</span>
                         <span className="text-[10px] font-black text-blue-600">PIMM v2.4 PRO</span>
                      </div>
                      <div className="w-px h-8 bg-gray-100" />
                      <div className="flex items-center gap-2">
                         <Target size={16} />
                         <span className="text-[10px] font-black uppercase tracking-tighter">AI Precision High</span>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* BOTTOM TOGGLE BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl p-1.5 flex items-center gap-1 animate-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setDescriptionMode('standard')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
            descriptionMode === 'standard' 
              ? 'bg-[#1e293b] text-white shadow-lg' 
              : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          <AlignLeft size={16} />
          Opis Standardowy
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button 
          onClick={() => setDescriptionMode('block')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
            descriptionMode === 'block' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          <LayoutGrid size={16} />
          Opis Blokowy
        </button>
      </div>

      {/* BLOCK EDITOR MODAL */}
      {isBlockModalOpen && editingBlock && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
            <div className="p-6 bg-[#1a2b4d] text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 leading-none">Edytor Sekcji</h3>
                  <p className="text-sm font-black mt-1.5">Konfiguracja bloku opisu</p>
                </div>
              </div>
              <button onClick={() => setIsBlockModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24}/></button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Settings */}
              <div className="w-80 border-r border-gray-100 p-6 overflow-y-auto custom-scrollbar space-y-8 bg-gray-50/30">
                {/* Colors */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Kolor tła</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={editingBlock.backgroundColor}
                        onChange={e => setEditingBlock({...editingBlock, backgroundColor: e.target.value})}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                      />
                      <input 
                        type="text"
                        value={editingBlock.backgroundColor}
                        onChange={e => setEditingBlock({...editingBlock, backgroundColor: e.target.value})}
                        className="flex-1 h-10 px-3 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Kolor tekstu</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={editingBlock.textColor}
                        onChange={e => setEditingBlock({...editingBlock, textColor: e.target.value})}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                      />
                      <input 
                        type="text"
                        value={editingBlock.textColor}
                        onChange={e => setEditingBlock({...editingBlock, textColor: e.target.value})}
                        className="flex-1 h-10 px-3 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Order */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Kolejność (Order)</label>
                  <input 
                    type="number"
                    value={editingBlock.order}
                    onChange={e => setEditingBlock({...editingBlock, order: parseInt(e.target.value) || 0})}
                    className="w-full h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold"
                  />
                </div>

                {/* Grid Layout Selector */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Wybierz Układ Siatki</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { c: 1, r: 1 }, { c: 2, r: 1 }, { c: 3, r: 1 }, { c: 4, r: 1 },
                      { c: 1, r: 2 }, { c: 2, r: 2 }, { c: 3, r: 2 }, { c: 4, r: 2 }
                    ].map((grid, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const newCells: Record<string, CellContent> = {};
                          for(let r=0; r<grid.r; r++) {
                            for(let c=0; c<grid.c; c++) {
                              newCells[`${r}-${c}`] = editingBlock.cells[`${r}-${c}`] || { type: 'text', content: '' };
                            }
                          }
                          setEditingBlock({...editingBlock, columns: grid.c, rows: grid.r, cells: newCells});
                        }}
                        className={`aspect-square border-2 rounded-lg flex flex-col overflow-hidden transition-all ${editingBlock.columns === grid.c && editingBlock.rows === grid.r ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                      >
                        <div className="flex-1 grid gap-0.5 p-1" style={{ gridTemplateColumns: `repeat(${grid.c}, 1fr)`, gridTemplateRows: `repeat(${grid.r}, 1fr)` }}>
                          {Array.from({ length: grid.c * grid.r }).map((_, j) => (
                            <div key={j} className={`rounded-sm ${editingBlock.columns === grid.c && editingBlock.rows === grid.r ? 'bg-blue-600' : 'bg-gray-200'}`} />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Kolumny</label>
                      <input 
                        type="number"
                        min="1"
                        max="12"
                        value={editingBlock.columns}
                        onChange={e => {
                          const c = parseInt(e.target.value) || 1;
                          const newCells = { ...editingBlock.cells };
                          setEditingBlock({...editingBlock, columns: c, cells: newCells});
                        }}
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Wiersze</label>
                      <input 
                        type="number"
                        min="1"
                        max="12"
                        value={editingBlock.rows}
                        onChange={e => {
                          const r = parseInt(e.target.value) || 1;
                          const newCells = { ...editingBlock.cells };
                          setEditingBlock({...editingBlock, rows: r, cells: newCells});
                        }}
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Cell Content Editor */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wypełnij Komórki</h4>
                  <div className="space-y-4">
                    {Array.from({ length: editingBlock.rows }).map((_, r) => (
                      Array.from({ length: editingBlock.columns }).map((_, c) => {
                        const cellKey = `${r}-${c}`;
                        const cell = editingBlock.cells[cellKey] || { type: 'text', content: '' };
                        return (
                          <div key={cellKey} className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-sm">
                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Komórka [Wiersz: {r + 1}, Kolumna: {c + 1}]</p>
                            <div>
                              <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Typ zawartości</label>
                              <select 
                                value={cell.type}
                                onChange={e => {
                                  const newCells = { ...editingBlock.cells };
                                  newCells[cellKey] = { ...cell, type: e.target.value as ContentType };
                                  setEditingBlock({...editingBlock, cells: newCells});
                                }}
                                className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none"
                              >
                                <option value="text">Tekst</option>
                                <option value="image">Zdjęcie</option>
                                <option value="video">Film</option>
                                <option value="iframe">Iframe</option>
                              </select>
                            </div>
                            {cell.type === 'text' ? (
                              <textarea 
                                value={cell.content}
                                onChange={e => {
                                  const newCells = { ...editingBlock.cells };
                                  newCells[cellKey] = { ...cell, content: e.target.value };
                                  setEditingBlock({...editingBlock, cells: newCells});
                                }}
                                placeholder="Wpisz treść opisu..."
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none h-24 resize-none"
                              />
                            ) : (
                              <input 
                                type="text"
                                value={cell.content}
                                onChange={e => {
                                  const newCells = { ...editingBlock.cells };
                                  newCells[cellKey] = { ...cell, content: e.target.value };
                                  setEditingBlock({...editingBlock, cells: newCells});
                                }}
                                placeholder={cell.type === 'image' ? "URL zdjęcia..." : cell.type === 'video' ? "URL filmu..." : "URL Iframe..."}
                                className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none"
                              />
                            )}
                          </div>
                        );
                      })
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Area */}
              <div className="flex-1 bg-gray-100 p-12 overflow-y-auto custom-scrollbar flex items-center justify-center">
                <div 
                  className="w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden min-h-[400px]"
                  style={{ backgroundColor: editingBlock.backgroundColor, color: editingBlock.textColor }}
                >
                  <div 
                    className="grid gap-4 p-8 h-full"
                    style={{ 
                      gridTemplateColumns: `repeat(${editingBlock.columns}, 1fr)`,
                      gridTemplateRows: `repeat(${editingBlock.rows}, 1fr)`
                    }}
                  >
                    {Array.from({ length: editingBlock.rows }).map((_, r) => (
                      Array.from({ length: editingBlock.columns }).map((_, c) => {
                        const cell = editingBlock.cells[`${r}-${c}`];
                        if (!cell) return <div key={`${r}-${c}`} />;
                        
                        return (
                          <div key={`${r}-${c}`} className="flex items-center justify-center min-h-[100px]">
                            {cell.type === 'text' && (
                              <div className="prose prose-sm max-w-none w-full" style={{ color: editingBlock.textColor }}>
                                <div dangerouslySetInnerHTML={{ __html: cell.content || '<p class="opacity-30 italic">Brak treści...</p>' }} />
                              </div>
                            )}
                            {cell.type === 'image' && (
                              cell.content ? (
                                <img src={cell.content} className="max-w-full max-h-full object-contain rounded-xl" alt="Cell" />
                              ) : (
                                <div className="w-full h-full bg-gray-200/20 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300/30">
                                  <ImageIcon size={32} className="opacity-20" />
                                  <span className="text-[10px] font-black uppercase opacity-20">Zdjęcie</span>
                                </div>
                              )
                            )}
                            {cell.type === 'video' && (
                              <div className="w-full aspect-video bg-black/10 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300/30">
                                <Video size={32} className="opacity-20" />
                                <span className="text-[10px] font-black uppercase opacity-20">Film</span>
                              </div>
                            )}
                            {cell.type === 'iframe' && (
                              <div className="w-full h-full bg-indigo-500/5 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-indigo-300/20">
                                <FileCode size={32} className="opacity-20" />
                                <span className="text-[10px] font-black uppercase opacity-20">Iframe</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setIsBlockModalOpen(false)} className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Anuluj</button>
              <button onClick={handleSaveBlock} className="px-10 py-3 bg-[#107c41] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0d6334] transition-all flex items-center gap-2 shadow-lg shadow-green-200">
                <Save size={16}/> Zapisz i Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .marketing-output strong {
          color: #1a2b4d;
          font-weight: 800;
        }
        .marketing-output ul {
          list-style-type: none;
          padding-left: 0;
          margin-top: 1rem;
        }
        .marketing-output li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .marketing-output li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #2563eb;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MarketingDescriptions;
