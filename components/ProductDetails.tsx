import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, ChevronDown, ChevronRight, Database, 
  X, Edit3, Save, Plus, Trash2, Clock, 
  FileText, Monitor, Layout, PanelRightClose, PanelRightOpen, 
  Loader2, Camera, Ruler, Paperclip, Check, Globe, Trash, 
  Maximize2, GripVertical, ShoppingBag, Store, Laptop, File, Upload,
  Download, FileWarning, Eye, ImageIcon, ChevronsDownUp, ChevronsUpDown,
  Star, RefreshCw, Copy, FileSpreadsheet, Search, History, ChevronUp, AlertCircle,
  CheckCircle2, FileType, Bot, User, ListFilter, PlusCircle, FileUp, Palette, Bold, Sparkles, Link,
  ArrowUp, ArrowDown, Image
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { extractSpecsFromFile } from '../services/geminiService';

interface ProductDetailsProps {
  product: {
    actionId: string;
    ean: string;
    partNumber: string;
    name: string;
    category: string;
    group: string;
    subgroup: string;
    image?: string;
  };
  onBack: () => void;
  onNavigateToMarketing?: (actionId: string) => void;
  highlightedAttributes?: string[]; 
}

const CURRENT_USER = "Łukasz Glegolski";

interface AuditInfo {
  value: string;
  modifiedBy: string | null;
  modifiedAt: string | null;
}

interface SpecItem {
  id: string;
  label: string;
  value: string;
  numericValue?: number;
  unit?: string;
  modifiedBy: string | null;
  modifiedAt: string | null;
}

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  addedAt: string;
  url: string;
}

interface GalleryItem {
  id: string;
  type: 'image' | 'pdf';
  url: string;
  name?: string;
  isMain: boolean;
}

interface SpecSection {
  id: string;
  title: string;
  items: SpecItem[];
  files: AttachedFile[];
}

const LANGUAGES = [
  { code: 'PL', name: 'Polski' }, { code: 'EN', name: 'Angielski' }, { code: 'DE', name: 'Niemiecki' },
  { code: 'FR', name: 'Francuski' }, { code: 'ES', name: 'Hiszpański' }, { code: 'IT', name: 'Włoski' },
  { code: 'NL', name: 'Holenderski' }, { code: 'PT', name: 'Portugalski' }, { code: 'SV', name: 'Szwedzki' },
  { code: 'DA', name: 'Duński' }, { code: 'FI', name: 'Fiński' }, { code: 'NO', name: 'Norweski' }
];

const UNIT_GROUPS: Record<string, string[]> = {
  length: ['mm', 'cm', 'm', 'cale'],
  weight: ['g', 'kg', 'lb'],
  storage: ['MB', 'GB', 'TB'],
  frequency: ['Hz', 'kHz', 'MHz', 'GHz']
};

const CONVERSION_RATES: Record<string, number> = {
  mm: 1, cm: 10, m: 1000, cale: 25.4,
  g: 1, kg: 1000, lb: 453.59,
  MB: 1, GB: 1024, TB: 1048576,
  Hz: 1, kHz: 1000, MHz: 1000000, GHz: 1000000000
};

const DICTIONARIES = {
  Brands: ['Dell', 'Lenovo', 'HP', 'Apple', 'Asus', 'Samsung', 'Microsoft'],
  ProductTypes: ['Notebook', 'Desktop', 'Tablet', 'Monitor', 'Workstation'],
  Countries: ['China', 'Poland', 'Germany', 'USA', 'Vietnam', 'Ireland'],
  SpecSections: [
    'KONSTRUKCJA', 'EKRAN', 'PROCESOR', 'PAMIĘĆ RAM', 'DYSK TWARDY', 
    'KOMUNIKACJA', 'ZŁĄCZA', 'BATERIA', 'AUDIO', 'WYMIARY I WAGA', 
    'OPROGRAMOWANIE', 'GWARANCJA', 'BEZPIECZEŃSTWO', 'MULTIMEDIA', 
    'CERTYFIKATY', 'PARAMETRY ŚRODOWISKOWE', 'AKCESORIA W ZESTAWIE'
  ],
  SpecAttributes: [
    { label: 'Typ produktu', unitGroup: null },
    { label: 'Kolor produktu', unitGroup: null },
    { label: 'Przekątna', unitGroup: 'length' },
    { label: 'Rozdzielczość', unitGroup: null },
    { label: 'Model procesora', unitGroup: null },
    { label: 'Pojemność RAM', unitGroup: 'storage' },
    { label: 'Pojemność dysku', unitGroup: 'storage' },
    { label: 'Waga produktu', unitGroup: 'weight' },
    { label: 'Wysokość', unitGroup: 'length' },
    { label: 'Szerokość', unitGroup: 'length' },
    { label: 'Głębokość', unitGroup: 'length' },
    { label: 'Taktowanie procesora', unitGroup: 'frequency' },
    { label: 'System operacyjny', unitGroup: null },
    { label: 'Powłoka matrycy', unitGroup: null },
    { label: 'Typ dysku', unitGroup: null }
  ]
};

const MOCK_OTHER_PRODUCTS = [
  { actionId: 'MOBESPTOR0002', name: 'Apple MacBook Air M3 2024' },
  { actionId: 'MOBESPTOR0005', name: 'Lenovo Legion 5 Pro Gen 8' },
  { actionId: 'MOBESPTOR0012', name: 'Asus Zenbook 14 OLED' }
];

const AuditBadge = ({ data }: { data: AuditInfo | SpecItem }) => {
  if (!data.modifiedBy) return null;
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full group/audit relative cursor-help">
      <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">MOD</span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white p-3 rounded-xl text-[9px] font-bold opacity-0 group-hover/audit:opacity-100 transition-all pointer-events-none z-50 shadow-2xl border border-white/10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1">
            <span className="text-white/40 uppercase">Użytkownik</span>
            <span className="text-blue-400">{data.modifiedBy}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40 uppercase">Data</span>
            <span>{data.modifiedAt}</span>
          </div>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
      </div>
    </div>
  );
};

const SortableSpecItem = ({ 
  item, 
  sectionId, 
  availableUnits,
  editingField,
  tempValue,
  setTempValue,
  setEditingField,
  logEdit,
  handleUnitChange
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
    backgroundColor: isDragging ? 'rgba(239, 246, 255, 0.5)' : 'transparent',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`grid grid-cols-12 gap-6 items-center group/item hover:bg-blue-50/20 p-3 rounded-2xl transition-all border border-transparent hover:border-blue-100 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="col-span-4 flex items-center gap-3">
        <div {...attributes} {...listeners} className="p-1 text-slate-200 group-hover/item:text-blue-400 transition-colors cursor-grab active:cursor-grabbing">
          <GripVertical size={16} />
        </div>
        <span className="text-[12px] font-black text-slate-400 uppercase tracking-tight">{item.label}</span>
        <AuditBadge data={item} />
      </div>
      <div className="col-span-7 flex items-center gap-4">
        {editingField === `spec-${item.id}` ? (
          <div className="flex gap-3 w-full animate-in fade-in zoom-in-95">
              <input autoFocus value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1 bg-white border-2 border-blue-400 rounded-xl px-4 py-2 text-[12px] font-bold outline-none text-black shadow-lg shadow-blue-500/10" />
              <button onClick={() => logEdit(item.id, tempValue, 'spec', { sectionId: sectionId, itemId: item.id })} className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all"><Check size={16}/></button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
              <span className="text-[13px] font-black text-gray-800">{item.value || '---'}</span>
              {item.unit && (
                <div className="flex items-center gap-1 group/uom relative">
                  <select 
                    value={item.unit}
                    onChange={(e) => handleUnitChange(sectionId, item.id, e.target.value)}
                    className="appearance-none bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100 outline-none pr-8 shadow-sm"
                  >
                    {availableUnits.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                </div>
              )}
          </div>
        )}
      </div>
      <div className="col-span-1 flex justify-end">
        <button onClick={() => { setEditingField(`spec-${item.id}`); setTempValue(item.value); }} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg shadow-sm opacity-0 group-hover/item:opacity-100 transition-all"><Edit3 size={18}/></button>
      </div>
    </div>
  );
};

const SortableSection = ({ 
  section, 
  specSearchQuery, 
  expandedSections, 
  setExpandedSections, 
  activeAddAttrSection, 
  setActiveAddAttrSection, 
  attrSearchInAdd, 
  setAttrSearchInAdd, 
  handleAddAttributeToSection, 
  openPdfUpload, 
  handleRemoveSection,
  removeFile,
  editingField,
  tempValue,
  setTempValue,
  setEditingField,
  logEdit,
  handleUnitChange,
  sensors,
  handleItemDragEnd
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
  };

  const filteredItems = section.items.filter((item: any) => 
    item.label.toLowerCase().includes(specSearchQuery.toLowerCase()) || 
    item.value.toLowerCase().includes(specSearchQuery.toLowerCase())
  );

  if (specSearchQuery && filteredItems.length === 0) return null;

  return (
    <div ref={setNodeRef} style={style} className={`border border-slate-100 rounded-[2rem] group/sec overflow-hidden shadow-sm bg-white transition-all hover:shadow-md text-black mb-6 last:mb-0 ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex items-center bg-gray-50/40 px-8 py-5 border-b border-gray-50">
        <div {...attributes} {...listeners} className="p-1.5 text-slate-300 hover:text-blue-400 transition-colors mr-3 cursor-grab active:cursor-grabbing">
          <GripVertical size={20} />
        </div>
        <button onClick={() => setExpandedSections((prev: string[]) => prev.includes(section.id) ? prev.filter(id => id !== section.id) : [...prev, section.id])} className="flex-1 flex items-center text-left">
          {expandedSections.includes(section.id) ? <ChevronDown size={24} className="text-blue-500 mr-4" /> : <ChevronRight size={24} className="text-slate-300 mr-4" />}
          <span className="text-[14px] font-black text-gray-700 uppercase tracking-[0.15em]">{section.title}</span>
          {specSearchQuery && <span className="ml-4 px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black rounded-full uppercase">Znaleziono: {filteredItems.length}</span>}
        </button>
        <div className="flex items-center gap-2 opacity-0 group-hover/sec:opacity-100 transition-opacity">
          <div className="relative">
            <button onClick={() => setActiveAddAttrSection(activeAddAttrSection === section.id ? null : section.id)} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2" title="Dodaj atrybut z listy">
              <PlusCircle size={16}/><span className="text-[10px] font-black uppercase">Atrybut</span>
            </button>
            {activeAddAttrSection === section.id && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Szukaj w słowniku..."
                      value={attrSearchInAdd}
                      onChange={(e) => setAttrSearchInAdd(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold outline-none"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar py-1">
                  {DICTIONARIES.SpecAttributes.filter(a => a.label.toLowerCase().includes(attrSearchInAdd.toLowerCase())).map((attr, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleAddAttributeToSection(section.id, attr)}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-gray-50 last:border-0 transition-colors group/row"
                    >
                      <p className="text-[11px] font-bold text-gray-700 leading-none group-hover/row:text-emerald-700">{attr.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-black text-gray-400 uppercase">{attr.unitGroup ? `Gr: ${attr.unitGroup}` : 'Brak jednostki'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => openPdfUpload(section.id)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2" title="Dodaj PDF">
            <Plus size={16}/><FileType size={16}/>
          </button>
          <button onClick={() => handleRemoveSection(section.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash size={16}/></button>
        </div>
      </div>
      {expandedSections.includes(section.id) && (
        <div className="px-8 py-6 bg-white space-y-6">
          <div className="px-10 space-y-4">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleItemDragEnd(e, section.id)}
            >
              <SortableContext 
                items={filteredItems.map((i: any) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredItems.map((item: any) => {
                  const unitGroupKey = DICTIONARIES.SpecAttributes.find(a => a.label === item.label)?.unitGroup;
                  const availableUnits = unitGroupKey ? UNIT_GROUPS[unitGroupKey] : [];

                  return (
                    <SortableSpecItem 
                      key={item.id}
                      item={item}
                      sectionId={section.id}
                      availableUnits={availableUnits}
                      editingField={editingField}
                      tempValue={tempValue}
                      setTempValue={setTempValue}
                      setEditingField={setEditingField}
                      logEdit={logEdit}
                      handleUnitChange={handleUnitChange}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
            {filteredItems.length === 0 && specSearchQuery && (
              <div className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                Brak dopasowań w tej sekcji
              </div>
            )}
          </div>

          {/* Section PDF files */}
          {section.files.length > 0 && (
            <div className="pt-6 mt-4 border-t border-slate-50 px-12">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                <FileType size={14} className="text-blue-500" /> ZAŁĄCZONE DOKUMENTY TECHNICZNE ({section.files.length})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.files.map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group/file hover:bg-blue-50/30 transition-all hover:border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl text-rose-500 shadow-sm border border-rose-50">
                        <FileType size={22} />
                      </div>
                      <div>
                        <p className="text-[12px] font-black text-gray-700 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{file.size} • Dodano: {file.addedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover/file:opacity-100 transition-all">
                      <button className="p-2 text-blue-500 hover:bg-white rounded-xl shadow-sm transition-all"><Download size={18}/></button>
                      <button onClick={() => removeFile(section.id, file.id)} className="p-2 text-rose-500 hover:bg-white rounded-xl shadow-sm transition-all"><Trash size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onNavigateToMarketing }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSystemTab, setActiveSystemTab] = useState<'BAZA' | 'NAZWY' | 'GPSR' | 'WEE' | 'PIKT'>('NAZWY');
  const [specLang, setSpecLang] = useState('PL');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isAiFileModalOpen, setIsAiFileModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'SPEC' | 'MARKETING'>('SPEC');
  const [isLogsVisible, setIsLogsVisible] = useState(true);
  const [specSearchQuery, setSpecSearchQuery] = useState('');
  const [activeAddAttrSection, setActiveAddAttrSection] = useState<string | null>(null);
  const [attrSearchInAdd, setAttrSearchInAdd] = useState('');
  
  const [activeGalleryChannel, setActiveGalleryChannel] = useState<'Sferis' | 'Krakvet' | 'Allegro' | 'Global'>('Global');
  const [channelGalleries, setChannelGalleries] = useState<Record<string, GalleryItem[]>>({
    Global: product.image ? [{ id: '1', type: 'image', url: product.image, isMain: true }] : [],
    Sferis: product.image ? [{ id: '1', type: 'image', url: product.image, isMain: true }] : [],
    Krakvet: product.image ? [{ id: '1', type: 'image', url: product.image, isMain: true }] : [],
    Allegro: product.image ? [{ id: '1', type: 'image', url: product.image, isMain: true }] : [],
  });
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const aiFileInputRef = useRef<HTMLInputElement>(null);
  const addSectionRef = useRef<HTMLDivElement>(null);
  const [activePdfSectionId, setActivePdfSectionId] = useState<string | null>(null);

  const [mainNames, setMainNames] = useState<Record<string, AuditInfo>>({
    system: { value: product.name, modifiedBy: null, modifiedAt: null },
    offer: { value: `Laptop ${product.name} - i5-10210U, 16GB RAM, 256GB SSD, Ekran 15.6" FHD`, modifiedBy: null, modifiedAt: null },
    allegro: { value: `${product.name} i5-10210U 16GB 256GB SSD FHD W11 Pro`, modifiedBy: null, modifiedAt: null },
    sferis: { value: `Laptop ${product.name} | 15.6" FHD | i5-10210U | 16GB | 256GB SSD`, modifiedBy: null, modifiedAt: null }
  });

  const [localizedNames, setLocalizedNames] = useState<Record<string, { system: AuditInfo, offer: AuditInfo }>>(
    LANGUAGES.reduce((acc, lang) => ({
      ...acc,
      [lang.code]: {
        system: { value: `${product.name} - Edition 2024`, modifiedBy: null, modifiedAt: null },
        offer: { value: `${product.name} - Edition 2024 - ${lang.name} Version`, modifiedBy: null, modifiedAt: null }
      }
    }), {})
  );

  const [systemParams, setSystemParams] = useState<Record<string, AuditInfo>>({
    ProductNumber: { value: 'PERESPMYS0001', modifiedBy: null, modifiedAt: null },
    ProductVersion: { value: '1.0', modifiedBy: null, modifiedAt: null },
    Brand: { value: 'Asus', modifiedBy: null, modifiedAt: null },
    BarcodeCollection: { value: '5903241238491', modifiedBy: null, modifiedAt: null },
    Battery100Wh: { value: 'Nie', modifiedBy: null, modifiedAt: null },
    CNCode: { value: '84713000', modifiedBy: null, modifiedAt: null },
    InstalledBattery: { value: 'Tak', modifiedBy: null, modifiedAt: null },
    LooseBattery: { value: 'Nie', modifiedBy: null, modifiedAt: null },
    PIMProductId: { value: 'PIM-5510-X', modifiedBy: null, modifiedAt: null },
    ProductType: { value: 'Notebook', modifiedBy: null, modifiedAt: null },
    CountryOfOrigin: { value: 'China', modifiedBy: null, modifiedAt: null },
    Width: { value: '359.1 mm', modifiedBy: null, modifiedAt: null },
    Height: { value: '19.9 mm', modifiedBy: null, modifiedAt: null },
    Depth: { value: '236.3 mm', modifiedBy: null, modifiedAt: null },
  });

  const [localizedSpecs, setLocalizedSpecs] = useState<Record<string, SpecSection[]>>(
    LANGUAGES.reduce((acc: Record<string, SpecSection[]>, lang) => ({
      ...acc,
      [lang.code]: lang.code === 'PL' ? [
        { id: 's1', title: 'KONSTRUKCJA', files: [], items: [
          { id: 'i1', label: 'Typ produktu', value: 'Laptop', modifiedBy: null, modifiedAt: null },
          { id: 'i2', label: 'Kolor produktu', value: 'Szary', modifiedBy: null, modifiedAt: null },
          { id: 'i10', label: 'Materiał obudowy', value: 'Aluminium', modifiedBy: null, modifiedAt: null }
        ] },
        { id: 's2', title: 'EKRAN', files: [], items: [
          { id: 'i20', label: 'Przekątna', value: '39.6', numericValue: 39.6, unit: 'cm', modifiedBy: null, modifiedAt: null },
          { id: 'i21', label: 'Rozdzielczość', value: '1920 x 1080 (Full HD)', modifiedBy: null, modifiedAt: null }
        ] },
        { id: 's4', title: 'WYMIARY I WAGA', files: [], items: [
          { id: 'i3', label: 'Waga produktu', value: '1.8', numericValue: 1.8, unit: 'kg', modifiedBy: null, modifiedAt: null },
          { id: 'i32', label: 'Wysokość', value: '21', numericValue: 21, unit: 'mm', modifiedBy: null, modifiedAt: null }
        ] }
      ] : []
    }), {} as Record<string, SpecSection[]>)
  );

  const [productLogs, setProductLogs] = useState([
    { id: 1, user: "Łukasz Glegolski", action: "EDYCJA", detail: "Zmiana opisu Allegro", date: "2024-03-20 14:15" },
    { id: 2, user: "System AI", action: "AI_GEN", detail: "Wygenerowano nową sekcję: EKRAN", date: "2024-03-19 09:30" },
  ]);

  const [expandedSections, setExpandedSections] = useState<string[]>(['s1', 's2', 's4']);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalizedSpecs(prev => {
        const currentSpecs = prev[specLang];
        const oldIndex = currentSpecs.findIndex(s => s.id === active.id);
        const newIndex = currentSpecs.findIndex(s => s.id === over.id);
        return {
          ...prev,
          [specLang]: arrayMove(currentSpecs, oldIndex, newIndex)
        };
      });
    }
  };

  const handleItemDragEnd = (event: DragEndEvent, sectionId: string) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalizedSpecs(prev => {
        const updated = { ...prev };
        const sIdx = updated[specLang].findIndex(s => s.id === sectionId);
        if (sIdx !== -1) {
          const items = updated[specLang][sIdx].items;
          const oldIndex = items.findIndex(i => i.id === active.id);
          const newIndex = items.findIndex(i => i.id === over.id);
          updated[specLang][sIdx].items = arrayMove(items, oldIndex, newIndex);
        }
        return updated;
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addSectionRef.current && !addSectionRef.current.contains(event.target as Node)) {
        setShowAddSectionMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyFromOther = (otherActionId: string) => {
    const confirmCopy = confirm(`Czy na pewno chcesz skopiować opisy z produktu ${otherActionId}? Obecne opisy zostaną nadpisane.`);
    if (confirmCopy) {
      const now = new Date().toLocaleString('pl-PL');
      setMainNames(prev => ({
        ...prev,
        offer: { value: `[KOPIA] Skopiowano z ${otherActionId}`, modifiedBy: CURRENT_USER, modifiedAt: now }
      }));
      setIsCopyModalOpen(false);
      alert("Skopiowano dane. Możesz teraz przystąpić do ich edycji.");
    }
  };

  const handleAiFileExtraction = async (file: File) => {
    setIsExtracting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result?.toString().split(',')[1];
        if (base64) {
          const currentSpecs = localizedSpecs[specLang] || [];
          const extracted = await extractSpecsFromFile(
            base64, 
            file.type, 
            currentSpecs.map(s => s.title)
          );
          
          setLocalizedSpecs(prev => {
            const newSpecs = [...(prev[specLang] || [])];
            extracted.forEach((extSection: any) => {
              const existingIdx = newSpecs.findIndex(s => s.title.toUpperCase() === extSection.title.toUpperCase());
              if (existingIdx > -1) {
                extSection.items.forEach((extItem: any) => {
                  const itemExists = newSpecs[existingIdx].items.some(i => i.label.toLowerCase() === extItem.label.toLowerCase());
                  if (!itemExists) {
                    newSpecs[existingIdx].items.push({
                      id: `ai-${Math.random().toString(36).substr(2, 9)}`,
                      label: extItem.label,
                      value: extItem.value,
                      unit: extItem.unit || null,
                      modifiedBy: 'AI Extraction',
                      modifiedAt: new Date().toLocaleString('pl-PL')
                    });
                  }
                });
              } else {
                newSpecs.push({
                  id: `ai-sec-${Math.random().toString(36).substr(2, 9)}`,
                  title: extSection.title.toUpperCase(),
                  files: [],
                  items: extSection.items.map((i: any) => ({
                    id: `ai-${Math.random().toString(36).substr(2, 9)}`,
                    label: i.label,
                    value: i.value,
                    unit: i.unit || null,
                    modifiedBy: 'AI Extraction',
                    modifiedAt: new Date().toLocaleString('pl-PL')
                  }))
                });
              }
            });
            return { ...prev, [specLang]: newSpecs };
          });

          // Log the action
          const now = new Date().toLocaleString('pl-PL');
          setProductLogs(prev => [{
            id: Date.now(),
            user: CURRENT_USER,
            action: "AI_EXTRACT",
            detail: `Wyodrębniono parametry z pliku: ${file.name}`,
            date: now
          }, ...prev]);

          setIsAiFileModalOpen(false);
          alert("Specyfikacja została pomyślnie wyodrębniona i dodana.");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas przetwarzania pliku.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleExportToExcel = async () => {
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsExporting(false);
    alert(`Eksport specyfikacji technicznej (${specLang}) do formatu XLSX zakończony pomyślnie.`);
  };

  const logEdit = (fieldKey: string, newValue: string, type: 'main' | 'system' | 'sidebar' | 'spec', extra?: any) => {
    const now = new Date().toLocaleString('pl-PL');
    const update = { value: newValue, modifiedBy: CURRENT_USER, modifiedAt: now };

    const newLog = {
      id: Date.now(),
      user: CURRENT_USER,
      action: "EDYCJA",
      detail: `Zmiana: ${fieldKey}${extra?.langCode ? ` [${extra.langCode}]` : ''}`,
      date: now
    };
    setProductLogs(prev => [newLog, ...prev]);

    if (type === 'main') {
      setMainNames(prev => ({ ...prev, [fieldKey]: update }));
    } else if (type === 'system') {
      setSystemParams(prev => ({ ...prev, [fieldKey]: update }));
    } else if (type === 'sidebar') {
      const { langCode, nameType } = extra;
      setLocalizedNames(prev => ({
        ...prev,
        [langCode]: {
          ...prev[langCode],
          [nameType]: update
        }
      }));
    } else if (type === 'spec') {
      const updated = { ...localizedSpecs };
      const sIdx = updated[specLang].findIndex(s => s.id === extra.sectionId);
      const iIdx = updated[specLang][sIdx].items.findIndex(i => i.id === extra.itemId);
      const item = updated[specLang][sIdx].items[iIdx];
      
      const numValue = parseFloat(newValue.toString());
      updated[specLang][sIdx].items[iIdx] = { 
        ...item, 
        value: newValue, 
        numericValue: !isNaN(numValue) ? numValue : undefined,
        modifiedBy: CURRENT_USER, 
        modifiedAt: now 
      };
      setLocalizedSpecs(updated);
    }
    setEditingField(null);
  };

  const handleUnitChange = (sectionId: string, itemId: string, newUnit: string) => {
    const now = new Date().toLocaleString('pl-PL');
    const updated = { ...localizedSpecs };
    const sIdx = updated[specLang].findIndex(s => s.id === sectionId);
    const iIdx = updated[specLang][sIdx].items.findIndex(i => i.id === itemId);
    const item = updated[specLang][sIdx].items[iIdx];

    if (item.numericValue && item.unit) {
      const fromRate = CONVERSION_RATES[item.unit];
      const toRate = CONVERSION_RATES[newUnit];
      if (fromRate && toRate) {
        const baseValue = item.numericValue * fromRate;
        const newValue = parseFloat((baseValue / toRate).toFixed(2));
        updated[specLang][sIdx].items[iIdx] = {
          ...item,
          unit: newUnit,
          numericValue: newValue,
          value: newValue.toString(),
          modifiedBy: CURRENT_USER,
          modifiedAt: now
        };
        setLocalizedSpecs(updated);
      }
    }
  };

  const handleAddSection = (title: string) => {
    const newSection: SpecSection = { id: `s-${Date.now()}`, title, items: [], files: [] };
    setLocalizedSpecs(prev => ({ ...prev, [specLang]: [...prev[specLang], newSection] }));
    setExpandedSections(prev => [...prev, newSection.id]);
    setShowAddSectionMenu(false);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (!confirm("Usunąć całą sekcję?")) return;
    setLocalizedSpecs(prev => ({
      ...prev,
      [specLang]: prev[specLang].filter(s => s.id !== sectionId)
    }));
  };

  const handleAddAttributeToSection = (sectionId: string, attr: { label: string, unitGroup: string | null }) => {
    const now = new Date().toLocaleString('pl-PL');
    const updated = { ...localizedSpecs };
    const sIdx = updated[specLang].findIndex(s => s.id === sectionId);
    if (sIdx !== -1) {
      const newItem: SpecItem = {
        id: `i-${Date.now()}`,
        label: attr.label,
        value: '',
        unit: attr.unitGroup ? UNIT_GROUPS[attr.unitGroup][0] : undefined,
        modifiedBy: CURRENT_USER,
        modifiedAt: now
      };
      updated[specLang][sIdx].items = [...updated[specLang][sIdx].items, newItem];
      setLocalizedSpecs(updated);
      
      const newLog = {
        id: Date.now(),
        user: CURRENT_USER,
        action: "DODANIE",
        detail: `Dodano atrybut: ${attr.label} do sekcji ${updated[specLang][sIdx].title}`,
        date: now
      };
      setProductLogs(prev => [newLog, ...prev]);
    }
    setActiveAddAttrSection(null);
    setAttrSearchInAdd('');
  };

  const openPdfUpload = (sectionId: string) => {
    setActivePdfSectionId(sectionId);
    pdfInputRef.current?.click();
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activePdfSectionId) {
      const newFile: AttachedFile = {
        id: `pdf-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: 'application/pdf',
        addedAt: new Date().toLocaleDateString('pl-PL'),
        url: '#'
      };
      const updated = { ...localizedSpecs };
      const sIdx = updated[specLang].findIndex(s => s.id === activePdfSectionId);
      if (sIdx !== -1) {
        updated[specLang][sIdx].files = [...updated[specLang][sIdx].files, newFile];
        setLocalizedSpecs(updated);
      }
      setActivePdfSectionId(null);
    }
  };

  const removeFile = (sectionId: string, fileId: string) => {
    const updated = { ...localizedSpecs };
    const sIdx = updated[specLang].findIndex(s => s.id === sectionId);
    if (sIdx !== -1) {
      updated[specLang][sIdx].files = updated[specLang][sIdx].files.filter(f => f.id !== fileId);
      setLocalizedSpecs(updated);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newItem: GalleryItem = {
            id: `img-${Date.now()}`,
            type: 'image',
            url: e.target!.result as string,
            isMain: channelGalleries[activeGalleryChannel].length === 0
          };
          setChannelGalleries(prev => ({
            ...prev,
            [activeGalleryChannel]: [...prev[activeGalleryChannel], newItem]
          }));
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleAddFromUrl = () => {
    if (!imageUrlInput.trim()) return;
    const newItem: GalleryItem = {
      id: `url-${Date.now()}`,
      type: 'image',
      url: imageUrlInput,
      isMain: channelGalleries[activeGalleryChannel].length === 0
    };
    setChannelGalleries(prev => ({
      ...prev,
      [activeGalleryChannel]: [...prev[activeGalleryChannel], newItem]
    }));
    setImageUrlInput('');
    setShowUrlInput(false);
  };

  const handlePdfToGallery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newItem: GalleryItem = {
        id: `pdf-${Date.now()}`,
        type: 'pdf',
        url: '#', // In real app, this would be a URL to the uploaded file
        name: file.name,
        isMain: false
      };
      setChannelGalleries(prev => ({
        ...prev,
        [activeGalleryChannel]: [...prev[activeGalleryChannel], newItem]
      }));
    }
  };

  const removeGalleryItem = (id: string) => {
    setChannelGalleries(prev => ({
      ...prev,
      [activeGalleryChannel]: prev[activeGalleryChannel].filter(item => item.id !== id)
    }));
  };

  const setMainPhoto = (id: string) => {
    setChannelGalleries(prev => ({
      ...prev,
      [activeGalleryChannel]: prev[activeGalleryChannel].map(item => ({
        ...item,
        isMain: item.id === id
      }))
    }));
  };

  const moveGalleryItem = (id: string, direction: 'up' | 'down') => {
    const currentGallery = [...channelGalleries[activeGalleryChannel]];
    const index = currentGallery.findIndex(item => item.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentGallery.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [currentGallery[index], currentGallery[targetIndex]] = [currentGallery[targetIndex], currentGallery[index]];

    setChannelGalleries(prev => ({
      ...prev,
      [activeGalleryChannel]: currentGallery
    }));
  };

  const expandAll = () => setExpandedSections(localizedSpecs[specLang].map(s => s.id));
  const collapseAll = () => setExpandedSections([]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-black transition-all duration-300">
      {/* Hidden inputs */}
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
      <input type="file" ref={pdfInputRef} onChange={handlePdfToGallery} className="hidden" accept="application/pdf" />
      <input type="file" ref={aiFileInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleAiFileExtraction(file);
      }} className="hidden" accept=".pdf,.txt,.doc,.docx,.xls,.xlsx" />

      {/* MODAL: Copy Product Data */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 text-black">
              <div className="p-6 bg-[#1e293b] text-white flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Copy size={20} className="text-blue-400" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Kopiuj opisy z innego produktu</h3>
                 </div>
                 <button onClick={() => setIsCopyModalOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6">
                 <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                    <input 
                      type="text" 
                      placeholder="Szukaj po nazwie lub ActionID..." 
                      className="w-full h-10 pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-black"
                    />
                 </div>
                 <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {MOCK_OTHER_PRODUCTS.map(p => (
                      <button 
                        key={p.actionId}
                        onClick={() => handleCopyFromOther(p.actionId)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl transition-all group"
                      >
                         <div className="text-left">
                            <p className="text-xs font-black text-slate-900 leading-tight">{p.name}</p>
                            <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-tighter">{p.actionId}</p>
                         </div>
                         <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </button>
                    ))}
                 </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                 <button onClick={() => setIsCopyModalOpen(false)} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Zamknij</button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-blue-500 uppercase tracking-[0.2em] leading-none mb-2 italic">
              KATALOG PRODUKTÓW / EDYCJA TREŚCI
            </span>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none drop-shadow-sm">
                {product.name}
              </h2>
              <div className="px-3 py-1 bg-slate-100 border border-gray-200 rounded-lg">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID SYST: </span>
                <span className="text-[11px] font-black text-blue-600">{product.actionId}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigateToMarketing?.(product.actionId)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <Palette size={20} /> OPIS MARKETINGOWY
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-[#107c41] text-white rounded-xl text-[12px] font-black uppercase tracking-wider shadow-xl shadow-green-200/50 hover:bg-[#0d6334] hover:-translate-y-0.5 transition-all active:translate-y-0">
            <Save size={20} /> ZAPISZ ZMIANY
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-12 gap-6 relative text-black">
        <div className={`transition-all duration-500 flex flex-col gap-6 ${isSidebarOpen ? 'col-span-8' : 'col-span-12'}`}>
          
          {/* MULTI-CHANNEL GALLERY SECTION */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Image size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none mb-1">GALERIA ZDJĘĆ I PLIKÓW</h3>
                  <p className="text-xs text-slate-400 font-medium">Zarządzanie multimediami per kanał sprzedaży.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                {['Global', 'Sferis', 'Krakvet', 'Allegro'].map(channel => (
                  <button
                    key={channel}
                    onClick={() => setActiveGalleryChannel(channel as any)}
                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeGalleryChannel === channel ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-10">
              {/* Main Preview */}
              <div className="col-span-12 lg:col-span-5">
                <div className="aspect-square bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex items-center justify-center p-12 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 pointer-events-none"></div>
                  {channelGalleries[activeGalleryChannel].find(i => i.isMain) ? (
                    <div className="relative z-10 flex flex-col items-center gap-8">
                      {channelGalleries[activeGalleryChannel].find(i => i.isMain)?.type === 'image' ? (
                        <img 
                          src={channelGalleries[activeGalleryChannel].find(i => i.isMain)?.url} 
                          alt={product.name} 
                          className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-700 hover:scale-105" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <FileType size={80} className="text-rose-500" />
                          <p className="text-sm font-black text-slate-800 uppercase">{channelGalleries[activeGalleryChannel].find(i => i.isMain)?.name}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-300">
                      <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest">Brak zdjęcia głównego</p>
                    </div>
                  )}
                  <div className="absolute top-8 right-8 px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-20">
                    GŁÓWNE
                  </div>
                </div>
              </div>

              {/* Gallery Grid & Controls */}
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1 italic">Lista multimediów</span>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      Elementy w kanale: {activeGalleryChannel} ({channelGalleries[activeGalleryChannel].length})
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowUrlInput(!showUrlInput)} className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm" title="Dodaj z linku">
                      <Link size={20} />
                    </button>
                    <button onClick={() => pdfInputRef.current?.click()} className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Dodaj PDF">
                      <FileType size={20} />
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                      <Plus size={18} /> DODAJ ZDJĘCIE
                    </button>
                  </div>
                </div>

                {showUrlInput && (
                  <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex gap-4 animate-in slide-in-from-top-4 duration-500 shadow-inner">
                    <div className="flex-1 relative">
                      <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                      <input 
                        type="text" 
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Wklej bezpośredni link do zdjęcia (URL)..." 
                        className="w-full h-12 pl-12 pr-4 bg-white border border-indigo-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      />
                    </div>
                    <button onClick={handleAddFromUrl} className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Dodaj</button>
                  </div>
                )}

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                  {channelGalleries[activeGalleryChannel].map((item, index) => (
                    <div key={item.id} className={`group relative aspect-square rounded-[2rem] border-2 transition-all overflow-hidden ${item.isMain ? 'border-blue-500 ring-8 ring-blue-500/5' : 'border-slate-100 hover:border-blue-200'}`}>
                      {item.type === 'image' ? (
                        <img src={item.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-rose-50 flex flex-col items-center justify-center p-4 text-center">
                          <FileType size={32} className="text-rose-500 mb-2" />
                          <span className="text-[9px] font-black text-rose-700 uppercase break-all line-clamp-2 leading-tight">{item.name}</span>
                        </div>
                      )}
                      
                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                        <div className="flex gap-2">
                          <button onClick={() => moveGalleryItem(item.id, 'up')} className="p-2 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl transition-all active:scale-90" title="Przesuń wcześniej"><ArrowUp size={16}/></button>
                          <button onClick={() => moveGalleryItem(item.id, 'down')} className="p-2 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl transition-all active:scale-90" title="Przesuń później"><ArrowDown size={16}/></button>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setMainPhoto(item.id)} className={`p-2 rounded-xl transition-all active:scale-90 ${item.isMain ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 hover:bg-white text-white hover:text-blue-600'}`} title="Ustaw jako główne"><Star size={16} fill={item.isMain ? 'currentColor' : 'none'}/></button>
                          <button onClick={() => removeGalleryItem(item.id)} className="p-2 bg-white/10 hover:bg-rose-600 text-white rounded-xl transition-all active:scale-90" title="Usuń"><Trash size={16}/></button>
                        </div>
                      </div>

                      {item.isMain && (
                        <div className="absolute top-3 left-3 p-1.5 bg-blue-600 text-white rounded-xl shadow-xl">
                          <Star size={12} fill="currentColor" />
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white rounded-lg text-[9px] font-black tracking-tighter">
                        POZ. {index + 1}
                      </div>
                    </div>
                  ))}
                  {channelGalleries[activeGalleryChannel].length === 0 && (
                    <div className="col-span-full py-20 border-4 border-dashed border-slate-50 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
                      <ImageIcon size={64} className="mb-6 opacity-10" />
                      <p className="text-xs font-black uppercase tracking-[0.2em]">Galeria dla kanału {activeGalleryChannel} jest pusta</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN NAMES AND DESCRIPTIONS SECTION */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none mb-1">GŁÓWNE NAZWY I OPISY</h3>
                  <p className="text-xs text-slate-400 font-medium">Zarządzanie kluczowymi danymi wyświetlanymi w sklepach i na aukcjach.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-6 py-3 rounded-2xl shadow-inner">
                <Layout size={20} className="text-blue-500" />
                <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1 text-blue-400 italic">Typ produktu (Formatka)</p>
                   <p className="text-sm font-black uppercase italic tracking-tighter leading-none text-blue-900">{systemParams.ProductType.value}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {(Object.entries(mainNames) as [string, AuditInfo][]).map(([key, data]) => {
                const isSystem = key === 'system';
                const currentEditKey = `main-${key}`;
                const isEditing = editingField === currentEditKey;

                return (
                  <div key={key} className="space-y-2 group relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 overflow-hidden">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">NAZWA {key}</span>
                        <AuditBadge data={data} />
                      </div>
                      {!isSystem && !isEditing && (
                        <button 
                          onClick={() => { setEditingField(currentEditKey); setTempValue(data.value); }}
                          className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Edit3 size={14}/>
                        </button>
                      )}
                    </div>
                    <div className={`p-5 bg-white border-2 rounded-2xl min-h-[70px] text-[11px] font-bold text-slate-700 leading-snug transition-all ${isEditing ? 'border-blue-500 bg-blue-50/30 shadow-lg shadow-blue-500/10' : 'border-slate-50 group-hover:border-slate-200'}`}>
                      {isEditing ? (
                        <div className="flex flex-col gap-3">
                          <textarea 
                            autoFocus 
                            value={tempValue} 
                            onChange={(e) => setTempValue(e.target.value)} 
                            className="w-full bg-transparent outline-none resize-none min-h-[80px]" 
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingField(null)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-[9px] uppercase font-black text-slate-500 hover:bg-slate-200">Anuluj</button>
                            <button onClick={() => logEdit(key, tempValue, 'main')} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] uppercase font-black hover:bg-blue-700 shadow-md">Zapisz</button>
                          </div>
                        </div>
                      ) : <span className="break-words">{data.value}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
              <button 
                onClick={() => setIsAiFileModalOpen(true)}
                className="flex items-center gap-3 px-8 py-3.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:-translate-y-0.5 transition-all shadow-sm active:translate-y-0"
              >
                <Bot size={18} /> WYGENERUJ OPIS ZA POMOCĄ AI Z PLIKU
              </button>
              <button 
                onClick={() => setIsCopyModalOpen(true)}
                className="flex items-center gap-3 px-8 py-3.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:-translate-y-0.5 transition-all shadow-sm active:translate-y-0"
              >
                <Copy size={18} /> KOPIUJ OPIS Z INNEGO PRODUKTU
              </button>
            </div>
          </div>

          {/* DETAILED SPECIFICATION / MARKETING DESCRIPTION SECTION */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex flex-col gap-8 bg-slate-50/20">
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-8">
                  <button 
                    onClick={() => setActiveDetailTab('SPEC')}
                    className={`flex items-center gap-4 transition-all group ${activeDetailTab === 'SPEC' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${activeDetailTab === 'SPEC' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      <Monitor size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className={`text-lg font-black uppercase tracking-tight leading-none mb-1 ${activeDetailTab === 'SPEC' ? 'text-slate-800' : 'text-slate-500'}`}>SPECYFIKACJA TECHNICZNA</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Parametry z formatki</p>
                    </div>
                  </button>

                  <div className="h-10 w-px bg-slate-200" />

                  <button 
                    onClick={() => setActiveDetailTab('MARKETING')}
                    className={`flex items-center gap-4 transition-all group ${activeDetailTab === 'MARKETING' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${activeDetailTab === 'MARKETING' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      <Palette size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className={`text-lg font-black uppercase tracking-tight leading-none mb-1 ${activeDetailTab === 'MARKETING' ? 'text-slate-800' : 'text-slate-500'}`}>OPIS MARKETINGOWY</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Treści sprzedażowe</p>
                    </div>
                  </button>
                </div>

                {activeDetailTab === 'SPEC' ? (
                  <div className="flex items-center gap-3">
                    <div className="relative mr-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Wyszukaj atrybut..."
                        value={specSearchQuery}
                        onChange={(e) => setSpecSearchQuery(e.target.value)}
                        className="h-12 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all w-64"
                      />
                    </div>
                    <button 
                      onClick={handleExportToExcel}
                      disabled={isExporting}
                      className="flex items-center gap-3 px-6 py-3 border-2 border-emerald-100 text-emerald-600 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm disabled:opacity-50"
                    >
                      {isExporting ? <RefreshCw className="animate-spin" size={16}/> : <FileSpreadsheet size={16} />}
                      EKSPORTUJ
                    </button>
                    <div className="flex bg-white p-1.5 rounded-xl border border-slate-100 shadow-inner">
                      <button onClick={expandAll} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Rozwiń wszystkie"><ChevronsUpDown size={18} /></button>
                      <div className="w-[1px] bg-slate-100 mx-1"></div>
                      <button onClick={collapseAll} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Zwiń wszystkie"><ChevronsDownUp size={18} /></button>
                    </div>
                    <button onClick={() => setShowAddSectionMenu(!showAddSectionMenu)} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-200/50 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0">
                      <Plus size={20} /> DODAJ SEKCJĘ
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-200/50 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:translate-y-0">
                      <Sparkles size={20} /> GENERUJ AI
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => setSpecLang(l.code)} className={`px-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${specLang === l.code ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-lg shadow-slate-900/20' : 'bg-white text-slate-400 border-slate-50 hover:border-blue-200 hover:text-blue-600'}`}>{l.code}</button>
                ))}
              </div>
            </div>

            <div className="p-8">
              {activeDetailTab === 'SPEC' ? (
                <div className="space-y-6">
                  {localizedSpecs[specLang]?.length > 0 ? (
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleSectionDragEnd}
                    >
                      <SortableContext 
                        items={localizedSpecs[specLang].map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {localizedSpecs[specLang]?.map((section) => (
                          <SortableSection 
                            key={section.id}
                            section={section}
                            specSearchQuery={specSearchQuery}
                            expandedSections={expandedSections}
                            setExpandedSections={setExpandedSections}
                            activeAddAttrSection={activeAddAttrSection}
                            setActiveAddAttrSection={setActiveAddAttrSection}
                            attrSearchInAdd={attrSearchInAdd}
                            setAttrSearchInAdd={setAttrSearchInAdd}
                            handleAddAttributeToSection={handleAddAttributeToSection}
                            openPdfUpload={openPdfUpload}
                            handleRemoveSection={handleRemoveSection}
                            removeFile={removeFile}
                            editingField={editingField}
                            tempValue={tempValue}
                            setTempValue={setTempValue}
                            setEditingField={setEditingField}
                            logEdit={logEdit}
                            handleUnitChange={handleUnitChange}
                            sensors={sensors}
                            handleItemDragEnd={handleItemDragEnd}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-slate-300 gap-4 bg-slate-50/30 rounded-[3rem] border border-dashed border-slate-200">
                        <Monitor size={64} className="opacity-10" />
                        <span className="text-[14px] font-black uppercase tracking-[0.3em] italic opacity-40">Brak danych specyfikacji dla wybranego języka</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-[2.5rem] p-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                          <FileType size={20} />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Edytor Treści Marketingowej ({specLang})</h4>
                      </div>
                      <div className="flex items-center gap-2">
                         <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Bold size={18}/></button>
                         <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ListFilter size={18}/></button>
                         <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ImageIcon size={18}/></button>
                      </div>
                    </div>
                    <textarea 
                      className="w-full min-h-[400px] bg-white border border-slate-200 rounded-[2rem] p-8 text-sm font-medium leading-relaxed text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-inner"
                      placeholder="Wpisz lub wygeneruj opis marketingowy dla tego produktu..."
                      defaultValue={`<p><strong>${product.name}</strong> to nowoczesne rozwiązanie dla wymagających użytkowników. Dzięki zaawansowanej technologii i ergonomicznemu designowi, produkt ten wyznacza nowe standardy w kategorii ${product.category}.</p><ul><li>Wysoka wydajność i niezawodność</li><li>Intuicyjna obsługa</li><li>Eleganckie wykończenie</li></ul>`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Słowa kluczowe SEO</p>
                      <div className="flex flex-wrap gap-2">
                        {['laptop', 'wydajność', 'design', 'praca zdalna'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full border border-slate-100">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Status Treści</p>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-black text-slate-700 uppercase">Wymaga weryfikacji</span>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ostatnia zmiana</p>
                      <div className="flex items-center gap-3 text-slate-500">
                        <User size={14} />
                        <span className="text-xs font-bold">Łukasz Glegolski</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HISTORIA ZMIAN PRODUKTU PANEL - DELICATE THEME */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl overflow-hidden relative group transition-all mb-24">
             <div className="absolute right-0 top-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000">
                <History size={220} className="text-slate-900" />
             </div>
             <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center shadow-inner">
                       <History size={40} className="text-slate-400" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black uppercase italic tracking-tight leading-none mb-2 text-slate-800">Audyt i historia zmian</h3>
                       <p className="text-sm text-slate-400 font-medium max-w-sm">Pełny rejestr operacji wykonanych na tym produkcie w systemie PIMM.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsLogsVisible(!isLogsVisible)}
                    className="px-6 py-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200 active:scale-95 flex items-center gap-3 shadow-sm"
                >
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">{isLogsVisible ? 'Ukryj rejestr' : 'Pokaż rejestr'}</span>
                    {isLogsVisible ? <ChevronUp size={24} className="text-slate-400"/> : <ChevronDown size={24} className="text-slate-400"/>}
                </button>
             </div>

             {isLogsVisible && (
                <div className="relative z-10 animate-in slide-in-from-top-4 duration-500 bg-slate-50/50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
                    <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-slate-100">
                        {productLogs.map(log => (
                            <tr key={log.id} className="hover:bg-white transition-all group">
                            <td className="px-10 py-6 w-64">
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-slate-700 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                      <User size={14} className="text-slate-300" /> {log.user}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-2 mt-1"><Clock size={12}/> {log.date}</span>
                                </div>
                            </td>
                            <td className="px-10 py-6 w-40">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                    log.action === 'EDYCJA' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                    log.action === 'AI_GEN' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                    'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                    {log.action}
                                </span>
                            </td>
                            <td className="px-10 py-6">
                                <p className="text-[13px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors leading-relaxed">{log.detail}</p>
                            </td>
                            <td className="px-10 py-6 text-right">
                                <button 
                                    className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 shadow-sm"
                                >
                                    Detale
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
             )}
          </div>

        </div>

        {/* SIDEBAR SYSTEM PARAMS - LOWERED AS REQUESTED */}
        <div className={`transition-all duration-500 fixed right-0 top-[135px] h-[calc(100vh-135px)] bg-white border-l border-slate-200 shadow-2xl z-[50] flex flex-col text-black ${isSidebarOpen ? 'w-[500px]' : 'w-16 overflow-hidden'}`}>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white border border-slate-200 shadow-2xl hover:text-blue-600 transition-all active:scale-90 ${isSidebarOpen ? '-translate-x-full rounded-l-2xl' : 'translate-x-2 rounded-2xl w-12 h-12 flex items-center justify-center'}`}>{isSidebarOpen ? <PanelRightClose size={28} /> : <PanelRightOpen size={28} />}</button>
           <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-10 pt-12">
              <div className="flex items-center gap-5 mb-10">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0 border border-emerald-100"><Database size={24} /></div>
                 <div>
                    <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">PARAMETRY SYSTEMOWE</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Baza danych PIMM Core</p>
                 </div>
              </div>
              <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem] mb-10 shrink-0 border border-slate-100 shadow-inner">
                 {['BAZA', 'NAZWY', 'GPSR', 'WEE', 'PIKT'].map(tab => (
                    <button key={tab} onClick={() => setActiveSystemTab(tab as any)} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeSystemTab === tab ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-400 hover:text-emerald-600 hover:bg-white/50'}`}>{tab}</button>
                 ))}
              </div>
              
              {activeSystemTab === 'BAZA' && (
                <div className="space-y-2">
                   {(Object.entries(systemParams) as [string, AuditInfo][]).map(([key, data]) => {
                     const currentEditKey = `sys-${key}`;
                     /* // Fixed error: changed from 'editingId' to 'editingField' as it was referring to an undefined variable. */
                     const isEditing = editingField === currentEditKey;

                     return (
                      <div key={key} className="group hover:bg-blue-50/30 p-5 rounded-[1.5rem] transition-all border border-transparent hover:border-blue-100">
                          <div className="grid grid-cols-2 items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-gray-400 flex items-center gap-2 uppercase tracking-tighter"><Paperclip size={14} className="text-gray-300" />{key}</span>
                                <AuditBadge data={data} />
                            </div>
                            <div className="flex items-center justify-between gap-3 overflow-hidden">
                                {isEditing ? (
                                  <div className="flex gap-2 w-full animate-in zoom-in-95">
                                    {['Brand', 'ProductType', 'CountryOfOrigin'].includes(key) ? (
                                      <select 
                                        className="flex-1 bg-white border-2 border-blue-400 rounded-xl text-[12px] p-2.5 font-black outline-none text-black shadow-lg" 
                                        onChange={(e) => logEdit(key, e.target.value, 'system')} 
                                        defaultValue={data.value}
                                      >
                                        {(key === 'Brand' ? DICTIONARIES.Brands : key === 'ProductType' ? DICTIONARIES.ProductTypes : DICTIONARIES.Countries).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                      </select>
                                    ) : (
                                      <input 
                                        autoFocus 
                                        className="flex-1 border-2 border-blue-400 rounded-xl p-2.5 text-[12px] font-black outline-none text-black w-full shadow-lg" 
                                        onBlur={(e) => logEdit(key, e.target.value, 'system')} 
                                        defaultValue={data.value} 
                                      />
                                    )}
                                  </div>
                                ) : <span className="text-[12px] font-black text-slate-900 truncate">{data.value}</span>}
                                {!isEditing && (
                                  <button onClick={() => { setEditingField(currentEditKey); setTempValue(data.value); }} className="opacity-0 group-hover:opacity-100 p-2.5 text-blue-500 bg-white rounded-xl shadow-sm transition-all shrink-0">
                                    <Edit3 size={14} />
                                  </button>
                                )}
                            </div>
                          </div>
                      </div>
                     );
                   })}
                </div>
              )}

              {activeSystemTab === 'NAZWY' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                   {LANGUAGES.map(lang => {
                     const names = localizedNames[lang.code];
                     return (
                      <div key={lang.code} className="bg-slate-50/30 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all group/lang">
                          <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner border border-indigo-100">
                                <Globe size={20} />
                            </div>
                            <span className="text-[14px] font-black text-slate-900 uppercase tracking-[0.1em]">{lang.name} ({lang.code})</span>
                          </div>
                          <div className="p-8 space-y-8">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0 italic">Nazwa Systemowa (Max 54)</label>
                                    <AuditBadge data={names.system} />
                                  </div>
                                  {editingField !== `sidebar-${lang.code}-system` && (
                                    <button 
                                      onClick={() => { setEditingField(`sidebar-${lang.code}-system`); setTempValue(names.system.value); }}
                                      className="p-1.5 text-indigo-400 hover:bg-white rounded-lg transition-all opacity-0 group-lang-hover:opacity-100 shrink-0 shadow-sm"
                                    >
                                      <Edit3 size={14}/>
                                    </button>
                                  )}
                                </div>
                                <div className={`p-4 bg-white border-2 rounded-[1.25rem] text-[12px] font-black text-gray-700 shadow-inner break-words transition-all ${editingField === `sidebar-${lang.code}-system` ? 'ring-4 ring-indigo-500/10 border-indigo-500' : 'border-slate-50'}`}>
                                  {editingField === `sidebar-${lang.code}-system` ? (
                                    <div className="flex flex-col gap-3">
                                      <textarea 
                                        autoFocus 
                                        value={tempValue} 
                                        onChange={(e) => setTempValue(e.target.value)} 
                                        className="w-full bg-transparent outline-none resize-none min-h-[60px]" 
                                      />
                                      <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingField(null)} className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] uppercase font-black text-slate-500">Anuluj</button>
                                        <button onClick={() => logEdit('system', tempValue, 'sidebar', { langCode: lang.code, nameType: 'system' })} className="px-4 py-1 bg-indigo-600 text-white rounded-lg text-[9px] uppercase font-black shadow-md">Zapisz</button>
                                      </div>
                                    </div>
                                  ) : names.system.value}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0 italic">Nazwa Ofertowa</label>
                                    <AuditBadge data={names.offer} />
                                  </div>
                                  {editingField !== `sidebar-${lang.code}-offer` && (
                                    <button 
                                      onClick={() => { setEditingField(`sidebar-${lang.code}-offer`); setTempValue(names.offer.value); }}
                                      className="p-1.5 text-indigo-400 hover:bg-white rounded-lg transition-all opacity-0 group-lang-hover:opacity-100 shrink-0 shadow-sm"
                                    >
                                      <Edit3 size={14}/>
                                    </button>
                                  )}
                                </div>
                                <div className={`p-4 bg-white border-2 rounded-[1.25rem] text-[12px] font-black text-gray-700 shadow-inner break-words transition-all ${editingField === `sidebar-${lang.code}-offer` ? 'ring-4 ring-indigo-500/10 border-indigo-500' : 'border-slate-50'}`}>
                                  {editingField === `sidebar-${lang.code}-offer` ? (
                                    <div className="flex flex-col gap-3">
                                      <textarea 
                                        autoFocus 
                                        value={tempValue} 
                                        onChange={(e) => setTempValue(e.target.value)} 
                                        className="w-full bg-transparent outline-none resize-none min-h-[60px]" 
                                      />
                                      <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingField(null)} className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] uppercase font-black text-slate-500">Anuluj</button>
                                        <button onClick={() => logEdit('offer', tempValue, 'sidebar', { langCode: lang.code, nameType: 'offer' })} className="px-4 py-1 bg-indigo-600 text-white rounded-lg text-[9px] uppercase font-black shadow-md">Zapisz</button>
                                      </div>
                                    </div>
                                  ) : names.offer.value}
                                </div>
                            </div>
                          </div>
                      </div>
                     );
                   })}
                </div>
              )}
           </div>
        </div>
      </div>
      {/* AI FILE EXTRACTION MODAL */}
      {isAiFileModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-emerald-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">AI Ekstrakcja z Pliku</h3>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Wygeneruj specyfikację na podstawie pliku producenta</p>
                </div>
              </div>
              <button onClick={() => setIsAiFileModalOpen(false)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div 
                onClick={() => aiFileInputRef.current?.click()}
                className={`border-4 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-6 transition-all cursor-pointer group ${isExtracting ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/30'}`}
              >
                {isExtracting ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 size={64} className="text-emerald-500 animate-spin" />
                    <div className="text-center">
                      <p className="text-lg font-black text-slate-800 uppercase tracking-tight">Przetwarzanie pliku...</p>
                      <p className="text-sm text-slate-500 font-medium">AI analizuje treść i dopasowuje parametry do formatki.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <FileUp size={40} />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-slate-800 uppercase tracking-tight">Kliknij lub przeciągnij plik</p>
                      <p className="text-sm text-slate-500 font-medium">Obsługiwane formaty: PDF, TXT, DOCX, XLSX</p>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={24} />
                <div className="space-y-1">
                  <p className="text-xs font-black text-amber-800 uppercase tracking-widest">Wskazówka</p>
                  <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                    AI najlepiej radzi sobie z plikami tekstowymi i PDF. System automatycznie spróbuje dopasować dane do istniejących sekcji (EKRAN, PROCESOR itp.). Jeśli sekcja nie istnieje, zostanie utworzona nowa.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsAiFileModalOpen(false)}
                className="px-8 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;