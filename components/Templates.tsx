
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ClipboardList, Plus, Search, MoreVertical, FileText, 
  CheckCircle2, Edit, Layers, ArrowRight, Sparkles, Bot, 
  ChevronDown, RefreshCw, Archive, ArrowLeft, GripVertical, 
  Trash2, Monitor, Settings2, Database, Layout, Save, Upload, PlusCircle,
  Hash, Type, List, CheckSquare, SortAsc, Filter as FilterIcon,
  GripHorizontal, Info, Tag, Undo2, Eye, Brain, X
} from 'lucide-react';

interface TemplateField {
  id: string;
  label: string;
  type: 'Liczba' | 'Tekst' | 'Lista' | 'Checkbox';
  unitGroup?: string;
  unit?: string;
  required: boolean;
  isAiGenerated?: boolean;
  isModified?: boolean;
  originalAiData?: {
    label: string;
    type: 'Liczba' | 'Tekst' | 'Lista' | 'Checkbox';
    unitGroup?: string;
  };
}

interface TemplateSection {
  id: string;
  title: string;
  fields: TemplateField[];
  isAiGenerated?: boolean;
}

interface Template {
  id: string;
  name: string;
  category: string;
  author: string;
  lastEdited: string;
  status: 'active' | 'editing';
  fieldsCount: number;
  assignedProducts: number;
  type: 'ai' | 'user';
  sections?: TemplateSection[];
}

const UNIT_DICTIONARY: Record<string, string[]> = {
  'length': ['mm', 'cm', 'm', 'cale'],
  'frequency': ['Hz', 'kHz', 'MHz', 'GHz'],
  'weight': ['g', 'kg', 't'],
  'storage': ['MB', 'GB', 'TB'],
  'angle': ['°'],
  'speed': ['fps', 'Gbit/s']
};

const SECTION_DICTIONARY = [
  { name: 'CECHY', mapping: 'Mapuje ogólne cechy konstrukcyjne, materiały i wykończenie.' },
  { name: 'PROCESOR', mapping: 'Szuka słów kluczowych: CPU, rdzenie, taktowanie, model procesora.' },
  { name: 'EKRAN', mapping: 'Identyfikuje przekątną ("), rozdzielczość (px) oraz typ matrycy.' },
  { name: 'PAMIĘĆ RAM', mapping: 'Szuka wartości w GB/MB z sufiksami RAM, DDR.' },
  { name: 'DYSK TWARDY', mapping: 'Mapuje pojemności SSD/HDD oraz typy interfejsów.' },
  { name: 'KOMUNIKACJA', mapping: 'Wykrywa moduły Wi-Fi, Bluetooth, NFC, 5G.' },
  { name: 'ZŁĄCZA', mapping: 'Zlicza porty USB, HDMI, Jack, RJ-45.' },
  { name: 'BATERIA', mapping: 'Szuka pojemności mAh lub Wh oraz czasu pracy.' },
  { name: 'WYMIARY I WAGA', mapping: 'Wyciąga wymiary zewnętrzne i wagę netto/brutto.' },
  { name: 'DODATKI', mapping: 'Mapuje akcesoria w zestawie i funkcje specjalne.' }
];

const ATTRIBUTE_DICTIONARY = [
  { label: 'Materiał korpusu', type: 'Tekst', unitGroup: null, mapping: 'Identyfikuje nazwy materiałów: aluminium, plastik, stop magnezu.' },
  { label: 'Wersja oprogramowania', type: 'Tekst', unitGroup: null, mapping: 'Wykrywa numery wersji i nazwy systemów operacyjnych.' },
  { label: 'Gwarancja producenta', type: 'Liczba', unitGroup: 'length', mapping: 'Mapuje okres gwarancji podany w miesiącach lub latach.' },
  { label: 'Typ złącza', type: 'Lista', unitGroup: null, mapping: 'Wybiera z predefiniowanej listy standardów złączy.' },
  { label: 'Długość przewodu', type: 'Liczba', unitGroup: 'length', mapping: 'Szuka wartości długości w opisach kabli i zasilaczy.' },
  { label: 'Pojemność akumulatora', type: 'Liczba', unitGroup: 'storage', mapping: 'Wychwytuje jednostki Wh lub mAh w specyfikacji zasilania.' },
  { label: 'Rozdzielczość video', type: 'Lista', unitGroup: null, mapping: 'Mapuje standardy: 4K, 8K, Full HD, HD Ready.' }
];

const DEFAULT_STRUCTURES: Record<string, TemplateSection[]> = {
  "Kamery": [
    { id: 'cam-s1', title: 'WYDAJNOŚĆ', isAiGenerated: true, fields: [
      { id: 'f-cam-1', label: 'Model', type: 'Tekst', required: true, isAiGenerated: true, originalAiData: { label: 'Model', type: 'Tekst' } },
      { id: 'f-cam-2', label: 'Przeznaczenie', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Przeznaczenie', type: 'Lista' } },
      { id: 'f-cam-3', label: 'Sposób łączności', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Sposób łączności', type: 'Lista' } },
      { id: 'f-cam-4', label: 'PTZ', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'PTZ', type: 'Checkbox' } },
      { id: 'f-cam-5', label: 'Tryb dzienny / nocny', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'Tryb dzienny / nocny', type: 'Checkbox' } },
      { id: 'f-cam-6', label: 'Podczerwień (IR) Filtr odcięcia', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'Podczerwień (IR) Filtr odcięcia', type: 'Checkbox' } }
    ]},
    { id: 'cam-s2', title: 'KONSTRUKCJA', isAiGenerated: true, fields: [
      { id: 'f-cam-7', label: 'Układ', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Układ', type: 'Lista' } },
      { id: 'f-cam-8', label: 'Typ mocowania', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Typ mocowania', type: 'Lista' } },
      { id: 'f-cam-9', label: 'Kolor produktu', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Kolor produktu', type: 'Lista' } },
      { id: 'f-cam-10', label: 'Diody LED', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'Diody LED', type: 'Checkbox' } }
    ]},
    { id: 'cam-s3', title: 'KAMERA', isAiGenerated: true, fields: [
      { id: 'f-cam-11', label: 'Kąt widzenia obiektywu, w poziomie', type: 'Liczba', unitGroup: 'angle', unit: '°', required: false, isAiGenerated: true, originalAiData: { label: 'Kąt widzenia obiektywu, w poziomie', type: 'Liczba', unitGroup: 'angle' } },
      { id: 'f-cam-12', label: 'Kąt widzenia obiektywu, w pionie', type: 'Liczba', unitGroup: 'angle', unit: '°', required: false, isAiGenerated: true, originalAiData: { label: 'Kąt widzenia obiektywu, w pionie', type: 'Liczba', unitGroup: 'angle' } },
      { id: 'f-cam-13', label: 'Kąt widzenia soczewki, przekątna', type: 'Liczba', unitGroup: 'angle', unit: '°', required: false, isAiGenerated: true, originalAiData: { label: 'Kąt widzenia soczewki, przekątna', type: 'Liczba', unitGroup: 'angle' } }
    ]},
    { id: 'cam-s4', title: 'MATRYCA ŚWIATŁOCZUŁA', isAiGenerated: true, fields: [
      { id: 'f-cam-14', label: 'Liczba czujników', type: 'Liczba', required: false, isAiGenerated: true, originalAiData: { label: 'Liczba czujników', type: 'Liczba' } },
      { id: 'f-cam-15', label: 'Wielkość czujnika CCD', type: 'Tekst', required: false, isAiGenerated: true, originalAiData: { label: 'Wielkość czujnika CCD', type: 'Tekst' } },
      { id: 'f-cam-16', label: 'Typ przetwornika obrazu', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Typ przetwornika obrazu', type: 'Lista' } }
    ]},
    { id: 'cam-s5', title: 'SYSTEM OBIEKTYWÓW', isAiGenerated: true, fields: [
      { id: 'f-cam-17', label: 'Maksymalna przysłona', type: 'Liczba', required: false, isAiGenerated: true, originalAiData: { label: 'Maksymalna przysłona', type: 'Liczba' } },
      { id: 'f-cam-18', label: 'Długość stałej ogniskowej', type: 'Liczba', unitGroup: 'length', unit: 'mm', required: false, isAiGenerated: true, originalAiData: { label: 'Długość stałej ogniskowej', type: 'Liczba', unitGroup: 'length' } }
    ]},
    { id: 'cam-s6', title: 'TRYB NOCNY', isAiGenerated: true, fields: [
      { id: 'f-cam-19', label: 'Tryb nocny', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'Tryb nocny', type: 'Checkbox' } },
      { id: 'f-cam-20', label: 'Odległość widzenia nocnego (Night Vision)', type: 'Liczba', unitGroup: 'length', unit: 'm', required: false, isAiGenerated: true, originalAiData: { label: 'Odległość widzenia nocnego (Night Vision)', type: 'Liczba', unitGroup: 'length' } },
      { id: 'f-cam-21', label: 'Typ diody LED', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Typ diody LED', type: 'Lista' } },
      { id: 'f-cam-22', label: 'Długość fali podczerwieni', type: 'Liczba', unitGroup: 'frequency', unit: 'nm', required: false, isAiGenerated: true, originalAiData: { label: 'Długość fali podczerwieni', type: 'Liczba', unitGroup: 'frequency' } }
    ]},
    { id: 'cam-s7', title: 'VIDEO', isAiGenerated: true, fields: [
      { id: 'f-cam-23', label: 'Maksymalna rozdzielczość', type: 'Tekst', required: true, isAiGenerated: true, originalAiData: { label: 'Maksymalna rozdzielczość', type: 'Tekst' } },
      { id: 'f-cam-24', label: 'Suma megapikseli', type: 'Liczba', required: false, isAiGenerated: true, originalAiData: { label: 'Suma megapikseli', type: 'Liczba' } },
      { id: 'f-cam-25', label: 'Obsługiwane formaty plików wideo', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Obsługiwane formaty plików wideo', type: 'Lista' } },
      { id: 'f-cam-26', label: 'Ilość klatek', type: 'Liczba', unitGroup: 'speed', unit: 'fps', required: false, isAiGenerated: true, originalAiData: { label: 'Ilość klatek', type: 'Liczba', unitGroup: 'speed' } }
    ]},
    { id: 'cam-s8', title: 'AUDIO', isAiGenerated: true, fields: [
      { id: 'f-cam-27', label: 'Wbudowane głośniki', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'Wbudowane głośniki', type: 'Checkbox' } },
      { id: 'f-cam-28', label: 'System dźwięku', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'System dźwięku', type: 'Lista' } },
      { id: 'f-cam-29', label: 'Wbudowany mikrofon', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'Wbudowany mikrofon', type: 'Checkbox' } }
    ]},
    { id: 'cam-s9', title: 'SIEĆ', isAiGenerated: true, fields: [
      { id: 'f-cam-30', label: 'Przewodowa sieć LAN', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'Przewodowa sieć LAN', type: 'Checkbox' } },
      { id: 'f-cam-31', label: 'Rodzaj interfejsu sieci Ethernet', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Rodzaj interfejsu sieci Ethernet', type: 'Lista' } },
      { id: 'f-cam-32', label: 'Standardy komunikacyjne', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Standardy komunikacyjne', type: 'Lista' } }
    ]}
  ],
  "Dyski SSD": [
    { id: 'ssd-s1', title: 'CECHY', isAiGenerated: true, fields: [
      { id: 'f-ssd-1', label: 'Pojemność pamięci SSD', type: 'Liczba', unitGroup: 'storage', unit: 'GB', required: true, isAiGenerated: true, originalAiData: { label: 'Pojemność pamięci SSD', type: 'Liczba', unitGroup: 'storage' } },
      { id: 'f-ssd-2', label: 'Typ dysku SSD', type: 'Lista', required: true, isAiGenerated: true, originalAiData: { label: 'Typ dysku SSD', type: 'Lista' } },
      { id: 'f-ssd-3', label: 'Interfejs', type: 'Lista', required: true, isAiGenerated: true, originalAiData: { label: 'Interfejs', type: 'Lista' } },
      { id: 'f-ssd-4', label: 'NVMe', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'NVMe', type: 'Checkbox' } },
      { id: 'f-ssd-5', label: 'Typ TLC', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Typ TLC', type: 'Lista' } },
      { id: 'f-ssd-6', label: 'Przeznaczenie', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Przeznaczenie', type: 'Lista' } },
      { id: 'f-ssd-7', label: 'Szyfrowanie sprzętu', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'Szyfrowanie sprzętu', type: 'Checkbox' } },
      { id: 'f-ssd-8', label: 'Szybkość przesyłania danych', type: 'Tekst', required: false, isAiGenerated: true, originalAiData: { label: 'Szybkość przesyłania danych', type: 'Tekst' } }
    ]},
    { id: 'ssd-s2', title: 'WAGA I ROZMIARY', isAiGenerated: true, fields: [
      { id: 'f-ssd-9', label: 'Wysokość produktu', type: 'Liczba', unitGroup: 'length', unit: 'mm', required: false, isAiGenerated: true, originalAiData: { label: 'Wysokość produktu', type: 'Liczba', unitGroup: 'length' } }
    ]}
  ],
  "Kable": [
    { id: 's1', title: 'CECHY', isAiGenerated: true, fields: [
      { id: 'f1', label: 'Długość kabla', type: 'Liczba', unitGroup: 'length', unit: 'm', required: true, isAiGenerated: true, originalAiData: { label: 'Długość kabla', type: 'Liczba', unitGroup: 'length' } },
      { id: 'f2', label: 'Typ przewodu', type: 'Lista', required: true, isAiGenerated: true, originalAiData: { label: 'Typ przewodu', type: 'Lista' } },
      { id: 'f3', label: 'Rozmiar złącza 1', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Rozmiar złącza 1', type: 'Lista' } },
      { id: 'f4', label: 'Rozmiar złącza 2', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Rozmiar złącza 2', type: 'Lista' } },
      { id: 'f5', label: 'Rodzaj złącza', type: 'Tekst', required: false, isAiGenerated: true, originalAiData: { label: 'Rodzaj złącza', type: 'Tekst' } },
      { id: 'f6', label: 'Kolor produktu', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Kolor produktu', type: 'Lista' } }
    ]},
    { id: 's2', title: 'SZCZEGÓŁY TECHNICZNE', isAiGenerated: true, fields: [
      { id: 'f7', label: 'Złącze(a)', type: 'Liczba', required: false, isAiGenerated: true, originalAiData: { label: 'Złącze(a)', type: 'Liczba' } },
      { id: 'f8', label: 'Połączenie z pc', type: 'Checkbox', required: false, isAiGenerated: true, originalAiData: { label: 'Połączenie z pc', type: 'Checkbox' } }
    ]}
  ],
  "Notebooki": [
    { id: 's1', title: 'EKRAN', isAiGenerated: true, fields: [
      { id: 'f1', label: 'Przekątna ekranu', type: 'Liczba', unitGroup: 'length', unit: 'cm', required: true, isAiGenerated: true, originalAiData: { label: 'Przekątna ekranu', type: 'Liczba', unitGroup: 'length' } },
      { id: 'f2', label: 'Rozdzielczość', type: 'Lista', required: true, isAiGenerated: true, originalAiData: { label: 'Rozdzielczość', type: 'Lista' } },
      { id: 'f3', label: 'Typ matrycy', type: 'Lista', required: false, isAiGenerated: true, originalAiData: { label: 'Typ matrycy', type: 'Lista' } }
    ]},
    { id: 's2', title: 'PROCESOR', isAiGenerated: true, fields: [
      { id: 'f4', label: 'Model procesora', type: 'Tekst', required: true, isAiGenerated: true, originalAiData: { label: 'Model procesora', type: 'Tekst' } },
      { id: 'f5', label: 'Liczba rdzeni', type: 'Liczba', required: true, isAiGenerated: true, originalAiData: { label: 'Liczba rdzeni', type: 'Liczba' } },
      { id: 'f6', label: 'Taktowanie', type: 'Liczba', unitGroup: 'frequency', unit: 'GHz', required: true, isAiGenerated: true, originalAiData: { label: 'Taktowanie', type: 'Liczba', unitGroup: 'frequency' } }
    ]}
  ]
};

const templateData = [
  { name: "Kable", count: 1935 },
  { name: "Notebooki", count: 692 },
  { name: "Dyski SSD", count: 1046 },
  { name: "Karma", count: 4130 },
  { name: "Meble do przechowywania", count: 1513 },
  { name: "Kamery", count: 1183 },
  { name: "Komputery", count: 907 },
  { name: "Myszy", count: 570 },
  { name: "Klawiatury", count: 421 },
  { name: "Tablety", count: 307 },
];

const mockTemplates: Template[] = templateData.map((item, index) => {
  const isAI = index % 3 !== 0;
  return {
    id: `F-${(index + 1).toString().padStart(3, '0')}`,
    name: item.name,
    category: index % 2 === 0 ? "Elektronika / Akcesoria" : "Dom i Ogród",
    author: isAI ? "System AI (Gemini)" : "Łukasz Glegolski",
    lastEdited: `2024-03-${(15 - (index % 10)).toString().padStart(2, '0')} 10:00`,
    status: index % 7 === 0 ? 'editing' : 'active',
    fieldsCount: DEFAULT_STRUCTURES[item.name]?.reduce((acc, s) => acc + s.fields.length, 0) || 5,
    assignedProducts: item.count,
    type: isAI ? 'ai' : 'user',
    sections: DEFAULT_STRUCTURES[item.name] || [
      { id: 's-def', title: 'PARAMETRY OGÓLNE', isAiGenerated: true, fields: [
        { id: 'f-def-1', label: 'Model', type: 'Tekst', required: true, isAiGenerated: true, originalAiData: { label: 'Model', type: 'Tekst' } },
        { id: 'f-def-2', label: 'Gwarancja', type: 'Liczba', required: false, isAiGenerated: true, originalAiData: { label: 'Gwarancja', type: 'Liczba' } }
      ]}
    ]
  };
});

type SortOption = 'name_asc' | 'products_desc';
type FilterOption = 'all' | 'ai' | 'user';

const Templates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const [filterType, setFilterType] = useState<FilterOption>('all');
  
  // States for enhanced functionality
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [draggedFieldInfo, setDraggedFieldInfo] = useState<{ sectionId: string, fieldId: string } | null>(null);
  const [activeMappingPreview, setActiveMappingPreview] = useState<{ name: string, mapping: string } | null>(null);
  const [showAddAttributeDropdown, setShowAddAttributeDropdown] = useState<string | null>(null); // sectionId

  const handleEditClick = (template: Template) => {
    setEditingTemplate(JSON.parse(JSON.stringify(template)));
  };

  const handleUpdateSectionTitle = (id: string, newTitle: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections?.map(s => s.id === id ? { ...s, title: newTitle } : s)
    });
  };

  const handleRemoveSection = (sectionId: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections?.filter(s => s.id !== sectionId)
    });
  };

  const handleAddSection = (title: string) => {
    if (!editingTemplate) return;
    const newSection: TemplateSection = {
      id: `s-${Date.now()}`,
      title: title.toUpperCase(),
      fields: [],
      isAiGenerated: false
    };
    setEditingTemplate({
      ...editingTemplate,
      sections: [...(editingTemplate.sections || []), newSection]
    });
  };

  const handleAddFieldToSection = (sectionId: string, attr: typeof ATTRIBUTE_DICTIONARY[0]) => {
    if (!editingTemplate) return;
    const newField: TemplateField = {
      id: `f-${Date.now()}`,
      label: attr.label,
      type: attr.type as any,
      unitGroup: attr.unitGroup || undefined,
      unit: attr.unitGroup ? UNIT_DICTIONARY[attr.unitGroup][0] : undefined,
      required: false,
      isAiGenerated: false,
      isModified: true
    };

    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections?.map(s => 
        s.id === sectionId ? { ...s, fields: [...s.fields, newField] } : s
      )
    });
    setShowAddAttributeDropdown(null);
  };

  const handleUpdateFieldLabel = (sectionId: string, fieldId: string, newLabel: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections?.map(s => 
        s.id === sectionId ? {
          ...s,
          fields: s.fields.map(f => {
            if (f.id === fieldId) {
              return { ...f, label: newLabel, isModified: true };
            }
            return f;
          })
        } : s
      )
    });
  };

  const handleRestoreAiVersion = (sectionId: string, fieldId: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections?.map(s => 
        s.id === sectionId ? {
          ...s,
          fields: s.fields.map(f => {
            if (f.id === fieldId && f.originalAiData) {
              return { 
                ...f, 
                label: f.originalAiData.label, 
                type: f.originalAiData.type,
                unitGroup: f.originalAiData.unitGroup,
                isModified: false 
              };
            }
            return f;
          })
        } : s
      )
    });
  };

  const handleRemoveField = (sectionId: string, fieldId: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections?.map(s => 
        s.id === sectionId ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) } : s
      )
    });
  };

  const handleUpdateUnit = (sectionId: string, fieldId: string, newUnit: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections?.map(s => 
        s.id === sectionId ? {
          ...s,
          fields: s.fields.map(f => f.id === fieldId ? { ...f, unit: newUnit, isModified: true } : f)
        } : s
      )
    });
  };

  const handleSaveStructure = () => {
    if (!editingTemplate) return;
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...editingTemplate, status: 'active', lastEdited: new Date().toLocaleString() } : t));
    setEditingTemplate(null);
  };

  // Drag and Drop Logic
  const onSectionDragStart = (id: string) => setDraggedSectionId(id);
  const onSectionDrop = (targetId: string) => {
    if (!editingTemplate || !draggedSectionId || draggedSectionId === targetId) return;
    const sections = [...(editingTemplate.sections || [])];
    const draggedIdx = sections.findIndex(s => s.id === draggedSectionId);
    const targetIdx = sections.findIndex(s => s.id === targetId);
    const [draggedItem] = sections.splice(draggedIdx, 1);
    sections.splice(targetIdx, 0, draggedItem);
    setEditingTemplate({ ...editingTemplate, sections });
    setDraggedSectionId(null);
  };

  const onFieldDragStart = (sectionId: string, fieldId: string) => setDraggedFieldInfo({ sectionId, fieldId });
  const onFieldDrop = (targetSectionId: string, targetFieldId: string) => {
    if (!editingTemplate || !draggedFieldInfo) return;
    const sections = [...(editingTemplate.sections || [])];
    const sourceSection = sections.find(s => s.id === draggedFieldInfo.sectionId);
    if (!sourceSection) return;
    const fieldIdx = sourceSection.fields.findIndex(f => f.id === draggedFieldInfo.fieldId);
    const [draggedField] = sourceSection.fields.splice(fieldIdx, 1);
    const targetSection = sections.find(s => s.id === targetSectionId);
    if (!targetSection) return;
    const targetFieldIdx = targetSection.fields.findIndex(f => f.id === targetFieldId);
    targetSection.fields.splice(targetFieldIdx, 0, draggedField);
    setEditingTemplate({ ...editingTemplate, sections });
    setDraggedFieldInfo(null);
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'Liczba': return <Hash size={14} className="text-blue-500" />;
      case 'Tekst': return <Type size={14} className="text-emerald-500" />;
      case 'Lista': return <List size={14} className="text-amber-500" />;
      case 'Checkbox': return <CheckSquare size={14} className="text-rose-500" />;
      default: return null;
    }
  };

  const processedTemplates = useMemo(() => {
    let result = [...templates];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (filterType !== 'all') result = result.filter(t => t.type === filterType);
    if (sortBy === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'products_desc') result.sort((a, b) => b.assignedProducts - a.assignedProducts);
    return result;
  }, [templates, searchQuery, filterType, sortBy]);

  if (editingTemplate) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 pb-20">
        {/* Mapping Preview Modal */}
        {activeMappingPreview && (
          <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 bg-[#1a2b4d] text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Brain className="text-blue-400" size={24} />
                      <h3 className="text-sm font-black uppercase tracking-widest">Mapowanie Logiczne AI</h3>
                   </div>
                   <button onClick={() => setActiveMappingPreview(null)} className="p-1 hover:bg-white/10 rounded-lg"><X size={20}/></button>
                </div>
                <div className="p-10 space-y-6">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Obiekt słownikowy</p>
                      <p className="text-lg font-black text-gray-900">{activeMappingPreview.name}</p>
                   </div>
                   <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                      <p className="text-sm font-bold text-blue-900 leading-relaxed italic">"{activeMappingPreview.mapping}"</p>
                   </div>
                   <p className="text-[10px] text-gray-400 font-medium leading-relaxed">System AI automatycznie wyszukuje te frazy w dostarczonych opisach produktów, aby automatycznie uzupełnić parametry techniczne.</p>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                   <button onClick={() => setActiveMappingPreview(null)} className="px-8 py-3 bg-[#1a2b4d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Zamknij</button>
                </div>
             </div>
          </div>
        )}

        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-[60] rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingTemplate(null)} className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-all">
              <ArrowLeft size={18} />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">PROJEKTOWANIE STRUKTURY FORMATKI</span>
              <h2 className="text-[14px] font-black text-gray-700 uppercase">{editingTemplate.name} <span className="text-gray-300 ml-2 font-mono">[{editingTemplate.id}]</span></h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleSaveStructure} className="flex items-center gap-2 px-5 py-2.5 bg-[#107c41] text-white rounded-xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-green-200 hover:bg-green-700 transition-all">
               <Save size={16} /> ZAPISZ STRUKTURĘ
             </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center text-center border-dashed border-indigo-200 bg-indigo-50/5">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4">
                 <Settings2 size={32} />
              </div>
              <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Edytor struktur technicznych</h3>
              <p className="text-xs text-gray-400 max-w-md mt-2">Dostosuj kolejność i nazewnictwo atrybutów. Elementy oznaczone tagiem <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[8px] font-black uppercase mx-1 shadow-sm">AI</span> zostały wygenerowane automatycznie.</p>
            </div>

            <div className="space-y-4">
              {editingTemplate.sections?.map((section) => (
                <div 
                  key={section.id} 
                  draggable 
                  onDragStart={() => onSectionDragStart(section.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onSectionDrop(section.id)}
                  className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group/sec transition-all ${draggedSectionId === section.id ? 'opacity-30 border-dashed border-indigo-400' : ''}`}
                >
                   <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center gap-3 flex-1">
                        <GripVertical size={18} className="text-gray-300 cursor-grab active:cursor-grabbing shrink-0" />
                        <div className="flex items-center gap-2">
                           <input 
                             value={section.title} 
                             onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                             className="bg-transparent text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] outline-none border-b border-transparent focus:border-indigo-400 min-w-[200px]"
                           />
                           {section.isAiGenerated && (
                             <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-600 border border-indigo-700 rounded text-[8px] font-black text-white uppercase tracking-tighter shadow-sm" title="Sekcja wygenerowana przez AI">
                               AI
                             </div>
                           )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 relative">
                         <button 
                           onClick={() => setShowAddAttributeDropdown(showAddAttributeDropdown === section.id ? null : section.id)}
                           className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${showAddAttributeDropdown === section.id ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}
                           title="Dodaj atrybut z listy"
                         >
                           <Plus size={14}/> Atrybut
                         </button>
                         {showAddAttributeDropdown === section.id && (
                           <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                              <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wybierz atrybut</span>
                                 <button onClick={() => setShowAddAttributeDropdown(null)}><X size={12} className="text-gray-400"/></button>
                              </div>
                              <div className="max-h-64 overflow-y-auto custom-scrollbar py-1">
                                 {ATTRIBUTE_DICTIONARY.map(attr => (
                                   <button 
                                      key={attr.label} 
                                      onClick={() => handleAddFieldToSection(section.id, attr)}
                                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-all border-b border-gray-50 last:border-0"
                                   >
                                      <p className="text-[11px] font-bold text-gray-700 leading-none mb-1">{attr.label}</p>
                                      <div className="flex items-center gap-2">
                                         <span className="text-[8px] font-black text-gray-300 uppercase">{attr.type}</span>
                                      </div>
                                   </button>
                                 ))}
                              </div>
                           </div>
                         )}
                         <button 
                           onClick={() => handleRemoveSection(section.id)}
                           className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                           title="Usuń sekcję"
                          >
                           <Trash2 size={14}/>
                         </button>
                      </div>
                   </div>
                   <div className="p-6 space-y-2">
                      {section.fields.map((field) => (
                        <div 
                          key={field.id} 
                          draggable
                          onDragStart={() => onFieldDragStart(section.id, field.id)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => onFieldDrop(section.id, field.id)}
                          className={`grid grid-cols-12 gap-4 items-center p-3 border border-transparent hover:border-indigo-100 hover:bg-indigo-50/10 rounded-xl transition-all group/item ${draggedFieldInfo?.fieldId === field.id ? 'opacity-20 border-dashed border-indigo-400' : ''}`}
                        >
                          <div className="col-span-1 text-gray-200 flex justify-center">
                             <GripVertical size={14} className="cursor-grab active:cursor-grabbing" />
                          </div>
                          <div className="col-span-4">
                            <div className="flex items-center gap-2">
                               <input 
                                  value={field.label}
                                  onChange={(e) => handleUpdateFieldLabel(section.id, field.id, e.target.value)}
                                  className="text-[11px] font-bold text-gray-700 bg-transparent border-b border-transparent focus:border-indigo-400 outline-none w-full"
                               />
                               {field.isAiGenerated && !field.isModified && (
                                 <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[8px] font-black uppercase shadow-sm shrink-0">AI</span>
                               )}
                               {field.isModified && field.originalAiData && (
                                 <button 
                                    onClick={() => handleRestoreAiVersion(section.id, field.id)}
                                    className="p-1 text-amber-500 hover:bg-amber-50 rounded-md transition-all shrink-0" 
                                    title="Przywróć wersję wygenerowaną przez AI"
                                 >
                                    <Undo2 size={12} />
                                 </button>
                               )}
                            </div>
                          </div>
                          <div className="col-span-2">
                             <div className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-100 rounded-lg shadow-sm">
                                {getFieldIcon(field.type)}
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{field.type}</span>
                             </div>
                          </div>
                          <div className="col-span-4">
                             {field.unitGroup && (
                               <div className="flex items-center gap-2">
                                  <div className="relative group/unit">
                                    <select 
                                      value={field.unit}
                                      onChange={(e) => handleUpdateUnit(section.id, field.id, e.target.value)}
                                      className="appearance-none bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest outline-none pr-7 cursor-pointer hover:bg-indigo-100 transition-all"
                                    >
                                      {UNIT_DICTIONARY[field.unitGroup].map(u => (
                                        <option key={u} value={u}>{u}</option>
                                      ))}
                                    </select>
                                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                                  </div>
                                  <span className="text-[8px] font-bold text-gray-300 uppercase">Grupa: {field.unitGroup}</span>
                               </div>
                             )}
                          </div>
                          <div className="col-span-1 flex justify-end">
                             <button onClick={() => handleRemoveField(section.id, field.id)} className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover/item:opacity-100"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      ))}
                      {section.fields.length === 0 && (
                        <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl text-[10px] text-gray-400 font-bold uppercase tracking-widest italic flex flex-col items-center gap-2">
                           <Layers size={20} className="opacity-20"/>
                           Sekcja jest pusta. Dodaj atrybuty.
                        </div>
                      )}
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4 space-y-6 sticky top-[100px] h-fit">
             <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Layout size={16} className="text-indigo-500" /> Słownik Sekcji
                </h4>
                <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                   {SECTION_DICTIONARY.map(sec => (
                     <div 
                        key={sec.name} 
                        className="flex items-center justify-between p-3 bg-gray-50/30 rounded-xl hover:bg-indigo-50 group/attr transition-all border border-transparent hover:border-indigo-100"
                      >
                        <div className="flex flex-col gap-0.5">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{sec.name}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover/attr:opacity-100 transition-opacity">
                           <button onClick={() => setActiveMappingPreview({ name: sec.name, mapping: sec.mapping })} className="p-1 text-indigo-400 hover:bg-white rounded-lg transition-all" title="Podgląd mapowania AI"><Eye size={14}/></button>
                           <button onClick={() => handleAddSection(sec.name)} className="p-1 text-indigo-600 hover:bg-white rounded-lg transition-all" title="Dodaj do formatki"><Plus size={16}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Database size={16} className="text-indigo-500" /> Słownik Atrybutów
                  </h4>
                </div>
                <div className="relative mb-4">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input placeholder="Filtruj atrybuty..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold outline-none" />
                </div>
                <div className="space-y-1 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                   {ATTRIBUTE_DICTIONARY.map(attr => (
                     <div key={attr.label} className="flex flex-col p-3 bg-gray-50/30 rounded-xl hover:bg-indigo-50 cursor-default group/attr transition-all border border-transparent hover:border-indigo-100">
                        <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[10px] font-bold text-gray-700 leading-none">{attr.label}</span>
                           <div className="flex items-center gap-1 opacity-0 group-hover/attr:opacity-100 transition-opacity">
                             <button onClick={() => setActiveMappingPreview({ name: attr.label, mapping: attr.mapping })} className="p-1 text-indigo-400 hover:bg-white rounded-lg" title="Podgląd mapowania AI"><Eye size={14}/></button>
                             {editingTemplate.sections?.length ? (
                               <div className="relative group/drop">
                                 <button className="p-1 text-indigo-600 hover:bg-white rounded-lg"><Plus size={16}/></button>
                                 <div className="absolute right-0 top-full mt-1 hidden group-drop-hover:block bg-white border border-gray-200 shadow-2xl rounded-xl z-[100] w-48 overflow-hidden">
                                    <div className="p-2 bg-gray-50 text-[8px] font-black text-gray-400 uppercase">Dodaj do sekcji:</div>
                                    {editingTemplate.sections.map(s => (
                                      <button key={s.id} onClick={() => handleAddFieldToSection(s.id, attr)} className="w-full text-left px-3 py-2 text-[9px] font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border-b border-gray-50 last:border-0">{s.title}</button>
                                    ))}
                                 </div>
                               </div>
                             ) : null}
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1.5">
                              {getFieldIcon(attr.type)}
                              <span className="text-[8px] font-black text-gray-300 uppercase">{attr.type}</span>
                           </div>
                           {attr.unitGroup && <span className="text-[8px] font-black text-blue-400 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-blue-100">Gr: {attr.unitGroup}</span>}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-black">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Formatki Produktowe</h2>
          <p className="text-sm text-gray-500 mt-1">Definicje struktur danych dla różnych typów produktów.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1a2b4d] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10 whitespace-nowrap">
          <Plus size={18} strokeWidth={3} />
          Nowa formatka
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Wszystkie formatki</p>
            <h4 className="text-2xl font-black text-gray-900">{templates.length}</h4>
         </div>
         <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Aktywne
            </p>
            <h4 className="text-2xl font-black text-emerald-900">{templates.filter(t => t.status === 'active').length}</h4>
         </div>
         <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none flex items-center gap-1.5">
              <Edit size={12} /> W edycji
            </p>
            <h4 className="text-2xl font-black text-amber-900">{templates.filter(t => t.status === 'editing').length}</h4>
         </div>
         <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none flex items-center gap-1.5">
              <Sparkles size={12} /> Wygenerowane AI
            </p>
            <h4 className="text-2xl font-black text-indigo-900">{templates.filter(t => t.type === 'ai').length}</h4>
         </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm sticky top-0 z-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Szukaj formatek (np. Kable, Notebooki)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-bold"
            />
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                <SortAsc size={16} className="text-gray-400" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-[11px] font-black uppercase tracking-widest text-gray-600 outline-none cursor-pointer"
                >
                   <option value="name_asc">Nazwa (A-Z)</option>
                   <option value="products_desc">Najwięcej indeksów</option>
                </select>
             </div>

             <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                <FilterIcon size={16} className="text-gray-400" />
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterOption)}
                  className="bg-transparent text-[11px] font-black uppercase tracking-widest text-gray-600 outline-none cursor-pointer"
                >
                   <option value="all">Wszyscy autorzy</option>
                   <option value="ai">System AI</option>
                   <option value="user">Użytkownicy</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {processedTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden group flex flex-col">
            <div className={`p-8 border-b border-gray-50 ${template.type === 'ai' ? 'bg-indigo-50/20' : 'bg-gray-50/30'}`}>
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl shadow-inner border ${
                    template.type === 'ai' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white border-gray-100 text-gray-600'
                }`}>
                  {template.type === 'ai' ? <Bot size={24} /> : <ClipboardList size={24} />}
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  template.status === 'active' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
                }`}>
                  {template.status === 'active' ? 'Aktywna' : 'Projekt'}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded uppercase tracking-widest">{template.id}</span>
                    {template.type === 'ai' && (
                      <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                        AI
                      </span>
                    )}
                </div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">{template.name}</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{template.category}</p>
              </div>
            </div>

            <div className="p-8 space-y-4 flex-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Pola</span>
                   <span className="text-gray-900 font-black">{template.fieldsCount}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Produkty (Indeksy)</span>
                   <span className="text-emerald-600 font-black text-[13px]">{template.assignedProducts.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleEditClick(template)}
              className={`w-full py-5 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group/btn ${
                template.type === 'ai' ? 'bg-indigo-50/50 text-indigo-600 hover:bg-indigo-600 hover:text-white' : 'bg-gray-50 text-gray-500 hover:bg-[#1a2b4d] hover:text-white'
              }`}
            >
              Edytuj formatkę
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {processedTemplates.length === 0 && (
         <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
               <Search size={32} />
            </div>
            <h3 className="text-base font-black text-gray-800 uppercase italic">Nie znaleziono formatek</h3>
            <p className="text-xs text-gray-500 font-medium">Spróbuj zmienić parametry wyszukiwania lub filtry.</p>
         </div>
      )}
    </div>
  );
};

export default Templates;
