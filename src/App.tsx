import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  LogOut, 
  PlusCircle, 
  Package, 
  Search, 
  Mail, 
  Phone, 
  User, 
  Tag, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  FileDown, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Euro, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  Camera, 
  UploadCloud, 
  Trash2, 
  X, 
  Maximize2, 
  ArrowRight, 
  CreditCard, 
  Banknote, 
  Receipt, 
  Percent,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export type PaymentMethod = 'Efectiu' | 'VISA';
export type PhysicalCondition = 'Nou' | 'Bon estat' | 'Ús moderat';
export type CommercialStatus = 'Dipositat' | 'Venut' | 'Retornat al propietari';

export interface MarketItem {
  id: string;
  code: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  category: string;
  description: string;
  condition: PhysicalCondition;
  price: number;
  imageUrl?: string;
  status: CommercialStatus;
  paymentMethod?: PaymentMethod | null;
  createdAt: string;
}

// 17 official categories
export const OFFICIAL_CATEGORIES = [
  'ALPINISME',
  'BARRANQUISME',
  'BIBLIOGRAFIA',
  'CAÇA',
  'CALÇAT',
  'CAMPING /CAMPER',
  'CICLISME',
  'COMPLEMENTS/ ACCESSORIS',
  'ESCALADA',
  'ESQUÍ',
  'MTB',
  'KAYAK',
  'PESCA',
  'ROBA',
  'RUNNING/ TREKKING',
  'SNOWBOARD',
  'TELEMARK'
] as const;

// Fallback high-mountain image if an item has no photo
const FALLBACK_MOUNTAIN_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';

// 4 simulated items meeting the price rule (150€, 45€, 35€, 20€) with states and categories
const INITIAL_MOCK_DATA: MarketItem[] = [
  {
    id: 'mock-1',
    code: 'MAT-001',
    sellerName: 'Marc Solé Roig',
    sellerPhone: '620 45 12 88',
    sellerEmail: 'marc.sole.pirineus@gmail.com',
    category: 'ESQUÍ',
    description: 'Esquís Dynafit Blacklight 88 (172 cm) amb fixacions Speed Turn i pells',
    condition: 'Bon estat',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80',
    status: 'Dipositat',
    paymentMethod: null,
    createdAt: '2026-10-06T09:15:00'
  },
  {
    id: 'mock-2',
    code: 'MAT-002',
    sellerName: 'Anna Farré Cardona',
    sellerPhone: '654 89 21 03',
    sellerEmail: 'anna.farre.alpinisme@outlook.com',
    category: 'CALÇAT',
    description: 'Botes semirígides La Sportiva Trango Tech GTX Talla 39 soles Vibram',
    condition: 'Bon estat',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    status: 'Venut',
    paymentMethod: 'VISA',
    createdAt: '2026-10-06T10:00:00'
  },
  {
    id: 'mock-3',
    code: 'MAT-003',
    sellerName: 'Jordi Vilalta Pons',
    sellerPhone: '611 78 40 92',
    sellerEmail: 'jordi.vilalta.boi@gmail.com',
    category: 'ROBA',
    description: 'Jaqueta impermeable tècnica de muntanya transpirable talla L',
    condition: 'Nou',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
    status: 'Venut',
    paymentMethod: 'Efectiu',
    createdAt: '2026-10-06T10:45:00'
  },
  {
    id: 'mock-4',
    code: 'MAT-004',
    sellerName: 'Mireia Torrelles Boí',
    sellerPhone: '639 12 77 45',
    sellerEmail: 'mireia.torrelles.ribagorca@yahoo.es',
    category: 'COMPLEMENTS/ ACCESSORIS',
    description: 'Motxilla tècnica d\'alpinisme 30L amb porta-piolets i casc',
    condition: 'Ús moderat',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    status: 'Retornat al propietari',
    paymentMethod: null,
    createdAt: '2026-10-06T11:20:00'
  }
];

// Helper: Compress user photo to Base64 using HTML5 Canvas for safe LocalStorage storage
const compressImageToBase64 = (
  file: File,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Check if a price string or number ends in 0 or 5 (positive integer)
export const isValidRoundedPrice = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num <= 0) return false;
  if (!Number.isInteger(num)) return false;
  return num % 5 === 0;
};

// Official Geometric Mountains Logo Component (Black and White with sharp triangles & snow)
function GeometricMountainLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background badge circle */}
        <circle cx="50" cy="50" r="48" fill="#000000" stroke="#FFFFFF" strokeWidth="2.5" />
        
        {/* Main Central Mountain Peak */}
        <polygon points="50,16 78,80 22,80" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="2" />
        {/* Snow cap of main peak */}
        <polygon points="50,16 61,42 50,38 39,42" fill="#FFFFFF" />
        
        {/* Left Secondary Geometric Peak */}
        <polygon points="32,38 52,80 12,80" fill="#000000" stroke="#FFFFFF" strokeWidth="1.8" />
        <polygon points="32,38 40,54 32,51 24,54" fill="#FFFFFF" />
        
        {/* Right Secondary Geometric Peak */}
        <polygon points="68,42 88,80 48,80" fill="#262626" stroke="#FFFFFF" strokeWidth="1.8" />
        <polygon points="68,42 76,57 68,54 60,57" fill="#FFFFFF" />
        
        {/* Ridge shadow facets */}
        <polygon points="50,16 50,80 22,80" fill="#0D0D0D" opacity="0.6" />
        <polygon points="32,38 32,80 12,80" fill="#000000" opacity="0.5" />
      </svg>
    </div>
  );
}

export default function App() {
  // Navigation views: 'public' (default) | 'organization'
  const [currentView, setCurrentView] = useState<'public' | 'organization'>('public');

  // Security state
  const [isOrgAuthenticated, setIsOrgAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fira_muntanya_org_auth_v7') === 'true';
    } catch {
      return false;
    }
  });

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);

  // Market items in LocalStorage
  const [items, setItems] = useState<MarketItem[]>(() => {
    try {
      const saved = localStorage.getItem('fira_muntanya_mercat_items_v7');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error carregant LocalStorage:', e);
    }
    return INITIAL_MOCK_DATA;
  });

  // Save items to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('fira_muntanya_mercat_items_v7', JSON.stringify(items));
    } catch (e) {
      console.error('Error desant LocalStorage:', e);
    }
  }, [items]);

  // Save auth state
  useEffect(() => {
    try {
      localStorage.setItem('fira_muntanya_org_auth_v7', String(isOrgAuthenticated));
    } catch {
      // Ignore
    }
  }, [isOrgAuthenticated]);

  // Organization active sub-tab
  const [orgTab, setOrgTab] = useState<'inventory' | 'register'>('inventory');

  // Registration Form State
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerPhone: '',
    sellerEmail: '',
    category: OFFICIAL_CATEGORIES[0] as string,
    description: '',
    condition: 'Bon estat' as PhysicalCondition,
    price: '',
    imagePreview: '' as string
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);

  // Lightbox Modal for enlarged photo viewing
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; code: string; category: string } | null>(null);

  // Auto-generate next code: MAT-001, MAT-002...
  const generateNextCode = (existingItems: MarketItem[]): string => {
    let maxNum = 0;
    existingItems.forEach((it) => {
      const match = it.code.match(/MAT-(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const nextNum = maxNum > 0 ? maxNum + 1 : existingItems.length + 1;
    return `MAT-${String(nextNum).padStart(3, '0')}`;
  };

  const [autoCode, setAutoCode] = useState<string>(() => generateNextCode(items));

  useEffect(() => {
    setAutoCode(generateNextCode(items));
  }, [items]);

  // Email Notification Modal State
  const [emailModalItem, setEmailModalItem] = useState<MarketItem | null>(null);
  const [copiedEmailText, setCopiedEmailText] = useState<boolean>(false);

  // Public Catalog Filters
  const [publicSearch, setPublicSearch] = useState<string>('');
  const [publicCategoryFilter, setPublicCategoryFilter] = useState<string>('Tots');

  // Organization Combined Filters
  const [orgSearch, setOrgSearch] = useState<string>('');
  const [orgPaymentFilter, setOrgPaymentFilter] = useState<string>('Tots');
  const [orgStatusFilter, setOrgStatusFilter] = useState<string>('Tots');

  // Strict email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Handle Photo selection & Base64 conversion
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Si us plau, selecciona un arxiu d\'imatge vàlid (JPEG, PNG, WebP, etc.).');
      return;
    }

    try {
      setIsProcessingImage(true);
      const base64Image = await compressImageToBase64(file);
      setFormData((prev) => ({ ...prev, imagePreview: base64Image }));
    } catch (err) {
      console.error('Error processant la foto:', err);
      alert('Hi ha hagut un problema processant la fotografia.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, imagePreview: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Organization Login Handlers
  const handleOpenOrgView = () => {
    if (isOrgAuthenticated) {
      setCurrentView('organization');
    } else {
      setPasswordInput('');
      setPasswordError(null);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'fira2026') {
      setIsOrgAuthenticated(true);
      setShowPasswordModal(false);
      setPasswordError(null);
      setCurrentView('organization');
    } else {
      setPasswordError('Contrasenya incorrecta. Torna-ho a provar.');
    }
  };

  const handleLogout = () => {
    setIsOrgAuthenticated(false);
    setCurrentView('public');
  };

  // Form submission with MANDATORY PRICE VALIDATION (ENDS IN 0 OR 5)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.sellerName.trim()) {
      errors.sellerName = 'El nom del venedor és obligatori.';
    }
    if (!formData.sellerPhone.trim()) {
      errors.sellerPhone = 'El telèfon de contacte és obligatori.';
    }
    if (!formData.sellerEmail.trim()) {
      errors.sellerEmail = 'El correu electrònic és OBLIGATORI.';
    } else if (!isValidEmail(formData.sellerEmail)) {
      errors.sellerEmail = 'Introdueix una adreça de correu vàlida (ex: usuari@domini.cat).';
    }
    if (!formData.description.trim()) {
      errors.description = 'La descripció / marca és obligatòria.';
    }

    // MANDATORY PRICE VALIDATION: Must end in 0 or 5
    if (!formData.price.trim()) {
      errors.price = 'El preu de venda és obligatori.';
    } else if (!isValidRoundedPrice(formData.price)) {
      errors.price = '⚠️ El preu ha de ser arrodonit i acabar en 0 o en 5 euros (Ex: 10, 15, 20, 25...)';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const numPrice = parseInt(formData.price, 10);

    const newItem: MarketItem = {
      id: `mat-${Date.now()}`,
      code: autoCode,
      sellerName: formData.sellerName.trim(),
      sellerPhone: formData.sellerPhone.trim(),
      sellerEmail: formData.sellerEmail.trim(),
      category: formData.category,
      description: formData.description.trim(),
      condition: formData.condition,
      price: numPrice,
      imageUrl: formData.imagePreview || FALLBACK_MOUNTAIN_IMAGE,
      status: 'Dipositat',
      paymentMethod: null,
      createdAt: new Date().toISOString()
    };

    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    setRegistrationSuccess(`Material "${newItem.description}" registrat correctament a El Pont de Suert amb el codi ${newItem.code} per ${newItem.price} €!`);

    // Reset form
    setFormData({
      sellerName: '',
      sellerPhone: '',
      sellerEmail: '',
      category: OFFICIAL_CATEGORIES[0],
      description: '',
      condition: 'Bon estat',
      price: '',
      imagePreview: ''
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => {
      setRegistrationSuccess(null);
    }, 6000);
  };

  // Change commercial status in table
  const handleStatusChange = (itemId: string, newStatus: CommercialStatus) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        if (newStatus === 'Venut') {
          return {
            ...it,
            status: newStatus,
            paymentMethod: it.paymentMethod || 'Efectiu'
          };
        } else {
          return {
            ...it,
            status: newStatus,
            paymentMethod: null
          };
        }
      })
    );
  };

  // Change payment method directly
  const handlePaymentMethodChange = (itemId: string, method: PaymentMethod) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, paymentMethod: method } : it))
    );
  };

  // Catalan email content based on status
  const getEmailContent = (item: MarketItem) => {
    let subject = '';
    let body = '';

    const price = item.price;
    const netAmount = price * 0.90;

    if (item.status === 'Venut') {
      subject = `[4a Fira Muntanya Alta Ribagorça] El teu producte ${item.code} s'ha venut!`;
      body = `Hola ${item.sellerName}, el teu producte ${item.description} s'ha venut. El preu final era de ${price.toFixed(2)}€. Descomptant el 10% de comissió de la fira, ja pots passar a recollir el teu import net de ${netAmount.toFixed(2)}€ pel punt de control d'El Pont de Suert.

Detalls de l'operació:
• Codi d'article: ${item.code}
• Categoria: ${item.category}
• Preu final de venda: ${price.toFixed(2)} €
• Mètode de pagament rebut: ${item.paymentMethod || 'Efectiu / VISA'}
• Comissió de la fira (10%): ${(price * 0.10).toFixed(2)} €
• Import net a liquidar (90%): ${netAmount.toFixed(2)} €
• Punt de recollida de la liquidació: El Pont de Suert (Pavelló Poliesportiu)

Horaris d'atenció: de 10:00 h a 20:00 h. Presenta el teu document d'identitat o justificant de registre.

Moltes gràcies per participar al Mercat de Segona Mà de la 4a Fira de Muntanya de l'Alta Ribagorça!

Atentament,
L'equip organitzador de la Fira de Muntanya
El Pont de Suert`;
    } else if (item.status === 'Retornat al propietari') {
      subject = `[4a Fira Muntanya Alta Ribagorça] Recollida de material no venut (${item.code})`;
      body = `Hola ${item.sellerName},

T'informem des de l'organització del Mercat de Segona Mà de la 4a Fira de Muntanya de l'Alta Ribagorça que la fira ha finalitzat i el teu material no s'ha venut en aquesta edició:

• Codi d'article: ${item.code}
• Producte: ${item.description} (${item.category})
• Estat de conservació: ${item.condition}
• Punt de recollida: El Pont de Suert (Magatzem central)

Pots passar a recollir el teu material pel punt de control d'El Pont de Suert abans del tancament definitiu mostrant el teu rebut de registre o DNI.

Moltes gràcies per la teva confiança i participació!

Atentament,
L'equip organitzador de la Fira de Muntanya
El Pont de Suert`;
    } else {
      subject = `[4a Fira Muntanya Alta Ribagorça] Estat del teu material ${item.code}`;
      body = `Hola ${item.sellerName},

T'informem que el teu material ${item.description} (${item.code}) continua en dipòsit i a la venda a la seu única d'El Pont de Suert.

Preu de venda al públic: ${price.toFixed(2)} € (Import net a percebre: ${netAmount.toFixed(2)} €)

T'avisarem tan bon punt es vengui o si cal recollir-lo un cop finalitzi la fira.

Atentament,
Organització de la 4a Fira de Muntanya d'El Pont de Suert`;
    }

    return { subject, body };
  };

  const handleNotifySeller = (item: MarketItem) => {
    const { subject, body } = getEmailContent(item);
    if (item.status === 'Venut' || item.status === 'Retornat al propietari') {
      const mailtoUrl = `mailto:${encodeURIComponent(item.sellerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    }
    setEmailModalItem(item);
  };

  const handleCopyEmailText = () => {
    if (!emailModalItem) return;
    const { subject, body } = getEmailContent(emailModalItem);
    const fullText = `Destinatari: ${emailModalItem.sellerEmail}\nAssumpte: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedEmailText(true);
      setTimeout(() => setCopiedEmailText(false), 2500);
    });
  };

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'Codi',
      'Categoria',
      'Descripció',
      'Estat Físic',
      'Preu Venda (€)',
      'Situació Comercial',
      'Mètode Pagament',
      'Comissió Fira 10% (€)',
      'Import Net Venedor 90% (€)',
      'Seu Custòdia',
      'Nom Venedor',
      'Telèfon',
      'Correu Electrònic',
      'Data Registre'
    ];

    const rows = items.map((it) => {
      const comm = it.price * 0.10;
      const net = it.price * 0.90;
      return [
        `"${it.code}"`,
        `"${it.category}"`,
        `"${it.description.replace(/"/g, '""')}"`,
        `"${it.condition}"`,
        it.price.toFixed(2),
        `"${it.status}"`,
        `"${it.paymentMethod || '-'}"`,
        comm.toFixed(2),
        net.toFixed(2),
        `"El Pont de Suert"`,
        `"${it.sellerName.replace(/"/g, '""')}"`,
        `"${it.sellerPhone}"`,
        `"${it.sellerEmail}"`,
        `"${new Date(it.createdAt).toLocaleDateString('ca-ES')}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventari_4a_fira_muntanya_pont_de_suert_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetMockData = () => {
    if (confirm('Vols restablir les 4 dades simulades de partida (150€, 45€, 35€, 20€)?')) {
      setItems(INITIAL_MOCK_DATA);
    }
  };

  // FINANCIAL KPIS IN REAL TIME:
  const soldItems = items.filter((i) => i.status === 'Venut');
  const totalSoldRevenue = soldItems.reduce((acc, curr) => acc + curr.price, 0);

  // Recaptat en Efectiu (€)
  const cashSoldItems = soldItems.filter((i) => i.paymentMethod === 'Efectiu');
  const cashRevenue = cashSoldItems.reduce((acc, curr) => acc + curr.price, 0);

  // Recaptat com a VISA (€)
  const visaSoldItems = soldItems.filter((i) => i.paymentMethod === 'VISA');
  const visaRevenue = visaSoldItems.reduce((acc, curr) => acc + curr.price, 0);

  // Benefici de l'Organització (10% del total venut)
  const totalOrgCommission = totalSoldRevenue * 0.10;

  // Dades pel gràfic de barres Recharts: comparativa de volum de vendes (€) Efectiu vs VISA
  const salesPaymentChartData = [
    {
      metode: 'Efectiu',
      euros: cashRevenue,
      vendes: cashSoldItems.length,
      fill: '#10b981', // Verd maragda
    },
    {
      metode: 'VISA',
      euros: visaRevenue,
      vendes: visaSoldItems.length,
      fill: '#2563eb', // Blau targeta
    },
  ];

  const cashSharePercent = totalSoldRevenue > 0 ? Math.round((cashRevenue / totalSoldRevenue) * 100) : 0;
  const visaSharePercent = totalSoldRevenue > 0 ? Math.round((visaRevenue / totalSoldRevenue) * 100) : 0;

  // General counts
  const totalArticlesCount = items.length;
  const depositedItems = items.filter((i) => i.status === 'Dipositat');

  // Filtered Public Catalog: ONLY items with status === 'Dipositat'
  const publicAvailableItems = items.filter((item) => {
    if (item.status !== 'Dipositat') return false; // Strictly hide sold/returned
    const matchesCategory =
      publicCategoryFilter === 'Tots' || item.category === publicCategoryFilter;
    const q = publicSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.code.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Filtered Organization Inventory (Combined Filter System)
  const orgFilteredItems = items.filter((item) => {
    // 1. Cercador per text (Codi, marca o venedor)
    const q = orgSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.code.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q) ||
      item.sellerEmail.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    // 2. Filtre per Mètode de Pagament (Tots / Efectiu / VISA)
    let matchesPayment = true;
    if (orgPaymentFilter === 'Efectiu') {
      matchesPayment = item.status === 'Venut' && item.paymentMethod === 'Efectiu';
    } else if (orgPaymentFilter === 'VISA') {
      matchesPayment = item.status === 'Venut' && item.paymentMethod === 'VISA';
    }

    // 3. Filtre per Estat del Material (Tots / Dipositat / Venut / Retornat al propietari)
    let matchesStatus = true;
    if (orgStatusFilter !== 'Tots') {
      matchesStatus = item.status === orgStatusFilter;
    }

    return matchesSearch && matchesPayment && matchesStatus;
  });

  // Dynamic price calculation helper for the form
  const parsedPrice = parseFloat(formData.price);
  const isInputPriceValid = isValidRoundedPrice(formData.price);
  const dynamicCommission = isInputPriceValid ? (parsedPrice * 0.10).toFixed(2) : '0.00';
  const dynamicNet = isInputPriceValid ? (parsedPrice * 0.90).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white font-sans relative">
      
      {/* CORPORATE PALETTE HEADER: NEGRE I GRIS FOSC + LOGOTIP OFICIAL GEOMÈTRIC EN BLANC I NEGRE (SENSE CAP TRAÇA DE BLAU) */}
      <header className="border-b-2 border-neutral-800 bg-black sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* LOGOTIP OFICIAL DE LES MUNTANYES GEOMÈTRIQUES EN BLANC I NEGRE + TEXTOS OFICIALS */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer select-none group" 
            onClick={() => setCurrentView('public')}
          >
            {/* Geometric Peaks Logo */}
            <div className="p-0.5 bg-black rounded-2xl border-2 border-white shadow-md group-hover:scale-105 transition-transform">
              <GeometricMountainLogo className="w-11 h-11" />
            </div>

            {/* Official Title Typography */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-white text-black px-2 py-0.5 rounded font-mono shadow-xs">
                  4a EDICIÓ
                </span>
                <span className="text-xs font-bold text-neutral-300 tracking-wider">
                  SEU ÚNICA: EL PONT DE SUERT
                </span>
              </div>
              <div className="flex flex-col leading-tight mt-0.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
                  FIRA DE MUNTANYA
                </span>
                <span className="text-xs sm:text-sm font-extrabold tracking-widest text-neutral-400 uppercase font-mono">
                  ALTA RIBAGORÇA
                </span>
              </div>
            </div>
          </div>

          {/* ESTRUCTURAL DARK BUTTONS (NO BLUE) */}
          <div className="flex items-center gap-2.5">
            {currentView === 'public' ? (
              <button
                onClick={handleOpenOrgView}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-orange-500"
              >
                <Lock className="w-4 h-4 text-orange-400" />
                <span>Anar a la Vista de l'Organització</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setCurrentView('public')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer hover:border-white"
                >
                  <Eye className="w-4 h-4 text-neutral-300" />
                  <span>Veure Catàleg Públic</span>
                </button>

                <button
                  onClick={handleLogout}
                  title="Tancar sessió de l'organització"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-950 hover:bg-black text-red-400 border border-red-500/80 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Tancar Sessió</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* VISTA 1: VISTA DE COMPRADORS EXTERNS (PÚBLICA - PER DEFECTE, FONS CLAR NET I CONTRAST) */}
      {currentView === 'public' && (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Banner in Dark Grey & White High Contrast */}
          <div className="relative rounded-3xl bg-neutral-900 text-white border-2 border-neutral-800 p-6 sm:p-8 shadow-xl overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black border border-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Mercat de Segona Mà • Catàleg Oficial en Viu
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Material Reutilitzat de Muntanya i Esports d'Aventura
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Descobreix el material d'ocasió revisat i disponible per a la venda a la 4a Fira de Muntanya de l'Alta Ribagorça. Tots els articles es troben i s'adquireixen exclusivament al punt central d'El Pont de Suert.
              </p>

              {/* REQUISIT SEU ÚNICA I PRIVADESA */}
              <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-200">
                <div className="inline-flex items-center gap-2 bg-black border border-neutral-700 px-3.5 py-2 rounded-xl text-orange-400 shadow-inner">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>📍 Punt de recollida i pagament: El Pont de Suert</span>
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Dades personals del venedor 100% privades
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar & 17 Categories Filter (Fons Blanc / Gris Clar) */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-4 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Text Search */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Cerca per article, marca, model, categoria o codi (ex: MAT-001)..."
                  value={publicSearch}
                  onChange={(e) => setPublicSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              {/* Live Count Indicator */}
              <div className="text-xs text-neutral-600 font-medium flex items-center gap-1.5 self-end sm:self-center">
                <Package className="w-4 h-4 text-neutral-800" />
                <span>
                  Mostrant <strong className="text-neutral-950 font-mono">{publicAvailableItems.length}</strong> articles disponibles
                </span>
              </div>
            </div>

            {/* 17 OFFICIAL CATEGORIES FILTER PILLS */}
            <div className="space-y-1.5 border-t border-neutral-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-orange-500" /> Categories Oficials (17):
                </span>
                {publicCategoryFilter !== 'Tots' && (
                  <button
                    onClick={() => setPublicCategoryFilter('Tots')}
                    className="text-[11px] text-orange-600 hover:text-orange-700 underline cursor-pointer font-semibold"
                  >
                    Mostrar totes
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
                <button
                  onClick={() => setPublicCategoryFilter('Tots')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all shrink-0 ${
                    publicCategoryFilter === 'Tots'
                      ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:text-neutral-950 hover:border-neutral-400'
                  }`}
                >
                  Totes ({items.filter((i) => i.status === 'Dipositat').length})
                </button>
                {OFFICIAL_CATEGORIES.map((cat) => {
                  const countInCat = items.filter((i) => i.status === 'Dipositat' && i.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setPublicCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                        publicCategoryFilter === cat
                          ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                          : 'bg-white border-neutral-300 text-neutral-700 hover:text-neutral-950 hover:border-neutral-400'
                      }`}
                    >
                      <span>{cat}</span>
                      {countInCat > 0 && (
                        <span className="text-[10px] bg-neutral-100 px-1.5 py-0.2 rounded-full text-neutral-900 font-mono border border-neutral-200">
                          {countInCat}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* GRID DE TARGETES VISUALS EN FONS BLANC NET AMB CONTRAST */}
          {publicAvailableItems.length === 0 ? (
            <div className="bg-white border-2 border-neutral-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3">
              <Package className="w-12 h-12 text-neutral-400 mx-auto" />
              <h3 className="text-base font-bold text-neutral-900">No hi ha material disponible amb aquest filtre</h3>
              <p className="text-xs text-neutral-600">
                Prova de canviar la categoria o el text cercat.
              </p>
              <button
                onClick={() => {
                  setPublicSearch('');
                  setPublicCategoryFilter('Tots');
                }}
                className="mt-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Restablir tots els filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publicAvailableItems.map((item, index) => {
                const photoSrc = item.imageUrl || FALLBACK_MOUNTAIN_IMAGE;

                return (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:border-neutral-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group animate-fade-in-scale"
                    style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
                  >
                    {/* FOTO PROMINENT A LA PART SUPERIOR */}
                    <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden border-b border-neutral-200">
                      <img
                        src={photoSrc}
                        alt={item.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_MOUNTAIN_IMAGE;
                        }}
                      />

                      {/* Photo Zoom trigger */}
                      <button
                        onClick={() =>
                          setLightboxImage({
                            url: photoSrc,
                            title: item.description,
                            code: item.code,
                            category: item.category
                          })
                        }
                        title="Ampliar fotografia"
                        className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/75 hover:bg-black text-white backdrop-blur-xs border border-white/20 transition-all opacity-90 group-hover:opacity-100"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Floating Code Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/90 backdrop-blur-xs border border-neutral-700 text-white font-mono font-bold text-xs shadow-md">
                        {item.code}
                      </div>

                      {/* Floating Condition Badge */}
                      <div className="absolute bottom-2.5 left-2.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs border ${
                            item.condition === 'Nou'
                              ? 'bg-neutral-900 text-emerald-300 border-neutral-700'
                              : item.condition === 'Bon estat'
                              ? 'bg-neutral-900 text-neutral-200 border-neutral-700'
                              : 'bg-neutral-900 text-amber-300 border-neutral-700'
                          }`}
                        >
                          {item.condition}
                        </span>
                      </div>
                    </div>

                    {/* DETALLS PÚBLICS */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Categoria Oficial */}
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                          {item.category}
                        </div>

                        {/* Descripció / Marca */}
                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors line-clamp-2 leading-snug mt-1">
                          {item.description}
                        </h4>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-neutral-200">
                        {/* Preu de Venda al Públic */}
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] uppercase font-bold text-neutral-500">Preu al públic</span>
                          <span className="text-2xl font-black text-neutral-950 font-mono">
                            {item.price.toFixed(2)} €
                          </span>
                        </div>

                        {/* TEXT FIX DE RECOLLIDA A SEU ÚNICA */}
                        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-[11px] text-neutral-800 flex items-center gap-2 shadow-xs">
                          <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                          <span className="font-semibold">📍 Punt de recollida i pagament: El Pont de Suert</span>
                        </div>

                        {/* PRIVADESA GARANTIDA */}
                        <div className="text-[10px] text-neutral-500 text-center">
                          Demana l'article amb el codi <strong className="text-neutral-900 font-mono">{item.code}</strong> al mostrador oficial.
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* VISTA 2: VISTA DE L'ORGANITZACIÓ (PRIVADA - PROTEGIDA PER CONTRASENYA "fira2026") */}
      {currentView === 'organization' && isOrgAuthenticated && (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Header de l'Organització (Negre i Gris Fosc) */}
          <div className="bg-neutral-900 text-white border-2 border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black border border-neutral-700 text-neutral-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> Panell Oficial d'Organització
                </span>
                <span className="text-xs text-neutral-400">Seu Única: El Pont de Suert • Comissió 10%</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Gestió Integral del Mercat i Liquidacions
              </h2>
            </div>

            {/* Sub-tab Switcher & Export CSV */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setOrgTab('inventory')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center gap-2 ${
                  orgTab === 'inventory'
                    ? 'bg-neutral-950 border-white text-white shadow-md'
                    : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4 text-neutral-300" />
                <span>Inventari General ({items.length})</span>
              </button>

              <button
                onClick={() => setOrgTab('register')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center gap-2 ${
                  orgTab === 'register'
                    ? 'bg-orange-600 border-orange-400 text-white shadow-md'
                    : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-orange-400" />
                <span>Registrar Material ({autoCode})</span>
              </button>

              <button
                onClick={handleExportCSV}
                title="Descarregar tot l'inventari en format CSV per a Excel"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-neutral-950 hover:bg-black text-white border-2 border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-neutral-500"
              >
                <FileDown className="w-4 h-4 text-orange-400" />
                <span>Exportar a CSV</span>
              </button>
            </div>
          </div>

          {/* TARGETES DE RESUM FINANCER (KPIS EN TEMPS REAL EN FONS BLANC I ALT CONTRAST) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Total Recaptat per Vendes */}
            <div className="bg-white border-2 border-neutral-300 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  Total Recaptat (Vendes)
                </div>
                <div className="text-2xl font-black text-neutral-950 font-mono">
                  {totalSoldRevenue.toFixed(2)} €
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  {soldItems.length} articles venuts ({totalArticlesCount} registrats)
                </div>
              </div>
            </div>

            {/* KPI 2: Recaptat en Efectiu (€) */}
            <div className="bg-white border-2 border-neutral-300 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-900">
                <Banknote className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  Recaptat en Efectiu
                </div>
                <div className="text-2xl font-black text-neutral-950 font-mono">
                  {cashRevenue.toFixed(2)} €
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  {cashSoldItems.length} vendes en metàl·lic
                </div>
              </div>
            </div>

            {/* KPI 3: Recaptat com a VISA (€) */}
            <div className="bg-white border-2 border-neutral-300 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-900">
                <CreditCard className="w-6 h-6 text-neutral-700" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  Recaptat com a VISA
                </div>
                <div className="text-2xl font-black text-neutral-950 font-mono">
                  {visaRevenue.toFixed(2)} €
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  {visaSoldItems.length} vendes amb targeta
                </div>
              </div>
            </div>

            {/* KPI 4: Benefici de l'Organització (10% del total venut) */}
            <div className="bg-white border-2 border-orange-500/80 rounded-2xl p-4 shadow-sm flex items-center gap-3 relative overflow-hidden">
              <div className="p-3 rounded-xl bg-orange-600 text-white">
                <Percent className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  Benefici Fira (10%)
                </div>
                <div className="text-2xl font-black text-orange-600 font-mono">
                  {totalOrgCommission.toFixed(2)} €
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Comissió del 10% del total venut
                </div>
              </div>

              <button
                onClick={handleResetMockData}
                title="Restablir dades d'exemple"
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-600 hover:text-black transition-all text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* GRÀFIC DE BARRES SENZILL (RECHARTS): COMPARATIVA EFECTIU VS VISA EN EUROS */}
          <div className="bg-white border-2 border-neutral-300 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
                    Volum de Vendes per Forma de Pagament (Efectiu vs VISA)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Comparativa gràfica del volum total recaptat en euros (€) segons la via de cobrament a El Pont de Suert
                  </p>
                </div>
              </div>

              {/* Indicadors percentuals i de volum */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Efectiu: <strong>{cashRevenue.toFixed(2)} €</strong> ({cashSharePercent}%)</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  <span>VISA: <strong>{visaRevenue.toFixed(2)} €</strong> ({visaSharePercent}%)</span>
                </div>
              </div>
            </div>

            {/* Contenidor Recharts */}
            <div className="w-full h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesPaymentChartData}
                  margin={{ top: 20, right: 30, left: 15, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="metode" 
                    tick={{ fill: '#1F2937', fontWeight: 700, fontSize: 13 }}
                    axisLine={{ stroke: '#D1D5DB' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280', fontSize: 12, fontFamily: 'monospace' }}
                    tickFormatter={(val: number) => `${val} €`}
                    axisLine={{ stroke: '#D1D5DB' }}
                    tickLine={false}
                    domain={[0, (dataMax: number) => Math.max(50, Math.ceil((dataMax * 1.25) / 10) * 10)]}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                    formatter={(value: any, _name: any, item: any) => [
                      `${Number(value).toFixed(2)} € (${item.payload.vendes} ${item.payload.vendes === 1 ? 'article venut' : 'articles venuts'})`,
                      'Volum'
                    ]}
                    contentStyle={{
                      backgroundColor: '#171717',
                      borderColor: '#404040',
                      borderRadius: '0.75rem',
                      color: '#ffffff',
                      fontSize: '12px',
                      padding: '8px 12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                    }}
                    labelStyle={{ color: '#F97316', fontWeight: 800, marginBottom: '2px' }}
                    itemStyle={{ color: '#ffffff', fontWeight: 600 }}
                  />
                  <Bar
                    dataKey="euros"
                    name="Volum (€)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={80}
                  >
                    {salesPaymentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Resum al peu del gràfic */}
            <div className="mt-2 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span><strong>{cashSoldItems.length}</strong> vendes en metàl·lic ({cashRevenue.toFixed(2)} €)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span><strong>{visaSoldItems.length}</strong> vendes per datàfon ({visaRevenue.toFixed(2)} €)</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500">Volum total venut: </span>
                <span className="font-mono font-bold text-neutral-900 text-sm">{totalSoldRevenue.toFixed(2)} €</span>
                <span className="text-orange-600 font-semibold ml-2">(Comissió 10%: {totalOrgCommission.toFixed(2)} €)</span>
              </div>
            </div>
          </div>

          {/* SUB-PESTANYA 1: FORMULARI DE REGISTRE EN FONS BLANC NET AMB VALIDACIÓ DE PREU */}
          {orgTab === 'register' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="bg-white border-2 border-neutral-300 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Alta de Material a El Pont de Suert
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900">
                      Formulari de Recepció, Fotografia i Validació de Preu
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">
                      Norma de preus: el preu ha de ser un número sencer acabat en 0 o en 5 (múltiple de 5).
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-500 block">Codi Assignat:</span>
                    <span className="text-base font-mono font-black text-neutral-950 bg-neutral-100 px-3 py-1 rounded-xl border border-neutral-300">
                      {autoCode}
                    </span>
                  </div>
                </div>
              </div>

              {registrationSuccess && (
                <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-900 shadow-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-neutral-900 text-sm">Registre completat amb èxit!</div>
                      <div className="text-xs text-emerald-700">{registrationSuccess}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setOrgTab('inventory')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shrink-0"
                  >
                    <span>Veure a l'inventari</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* FORMULARI EN FONS BLANC */}
              <form onSubmit={handleRegisterSubmit} className="bg-white border-2 border-neutral-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* PUJADA DE FOTO */}
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-orange-600" /> Foto del Producte (Mòbil / Arxiu)
                    </label>
                    <span className="text-[10px] text-neutral-600 bg-white border border-neutral-300 px-2 py-0.5 rounded font-mono">
                      Processament Base64
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="hidden"
                    id="product-photo-input"
                  />

                  {formData.imagePreview ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-neutral-300">
                      <div className="relative w-32 h-28 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-300 shrink-0">
                        <img
                          src={formData.imagePreview}
                          alt="Vista prèvia"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="text-xs font-bold text-emerald-700 flex items-center justify-center sm:justify-start gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fotografia carregada correctament
                        </div>
                        <p className="text-[11px] text-neutral-600">
                          S'emmagatzemarà a LocalStorage en format Base64 optimitzat.
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                          <label
                            htmlFor="product-photo-input"
                            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold cursor-pointer transition-all flex items-center gap-1"
                          >
                            <Camera className="w-3.5 h-3.5" /> Canviar Foto
                          </label>
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-red-600 text-xs font-semibold border border-neutral-300 transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="product-photo-input"
                      className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white hover:bg-neutral-50 transition-all text-center group"
                    >
                      <div className="p-3 rounded-full bg-neutral-100 group-hover:bg-neutral-200 text-neutral-600 group-hover:text-black transition-colors">
                        {isProcessingImage ? (
                          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <UploadCloud className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-neutral-800 group-hover:text-black block">
                          Fes una foto amb el mòbil o puja un fitxer
                        </span>
                        <span className="text-[11px] text-neutral-500 block mt-0.5">
                          Admet càmera directa i arxius JPG, PNG, WEBP
                        </span>
                      </div>
                    </label>
                  )}
                </div>

                {/* Dades Privades del Venedor */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2 mb-3 pb-2 border-b border-neutral-200">
                    <User className="w-4 h-4 text-neutral-800" /> Dades Privades del Venedor
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Nom i Cognoms del Venedor *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Marc Solé Roig"
                        value={formData.sellerName}
                        onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border ${
                          formErrors.sellerName ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900 focus:bg-white'
                        } text-neutral-900 text-sm focus:outline-none`}
                      />
                      {formErrors.sellerName && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.sellerName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Telèfon de Contacte *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                        <input
                          type="tel"
                          placeholder="Ex: 620 45 12 88"
                          value={formData.sellerPhone}
                          onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border ${
                            formErrors.sellerPhone ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900 focus:bg-white'
                          } text-neutral-900 text-sm focus:outline-none`}
                        />
                      </div>
                      {formErrors.sellerPhone && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.sellerPhone}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-900 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-orange-600" /> Correu Electrònic (OBLIGATORI per a notificacions) *
                        </span>
                        <span className="text-[10px] uppercase font-bold bg-neutral-100 text-neutral-700 border border-neutral-300 px-2 py-0.5 rounded">
                          Notificació automàtica
                        </span>
                      </label>
                      <input
                        type="email"
                        placeholder="Ex: venedor@correu.cat"
                        value={formData.sellerEmail}
                        onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border ${
                          formErrors.sellerEmail ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900 focus:bg-white'
                        } text-neutral-900 text-sm focus:outline-none`}
                      />
                      {formErrors.sellerEmail && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.sellerEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detalls del Material i VALIDACIÓ DE PREU OBLIGATÒRIA (0 O 5) */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2 mb-3 pb-2 border-b border-neutral-200">
                    <Tag className="w-4 h-4 text-neutral-800" /> Detalls del Material (17 Categories) i Preu
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* DESPLEGABLE AMB LES 17 CATEGORIES */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Categoria de Material (17 oficials) *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 font-semibold"
                      >
                        {OFFICIAL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* PREU DE VENDA AMB VALIDACIÓ ESTRICTA EN 0 O 5 */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1 flex items-center justify-between">
                        <span>Preu de Venda al Públic (€) *</span>
                        <span className="text-[10px] text-neutral-600 font-normal">
                          Acabat en 0 o 5
                        </span>
                      </label>
                      <div className="relative">
                        <Euro className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                        <input
                          type="number"
                          step="5"
                          min="5"
                          placeholder="Ex: 10, 15, 20, 25, 45, 150..."
                          value={formData.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({ ...formData, price: val });
                            if (val && !isValidRoundedPrice(val)) {
                              setFormErrors((prev) => ({
                                ...prev,
                                price: '⚠️ El preu ha de ser arrodonit i acabar en 0 o en 5 euros (Ex: 10, 15, 20, 25...)'
                              }));
                            } else {
                              setFormErrors((prev) => {
                                const newErr = { ...prev };
                                delete newErr.price;
                                return newErr;
                              });
                            }
                          }}
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-50 border ${
                            formErrors.price
                              ? 'border-red-500 ring-2 ring-red-500/20'
                              : 'border-neutral-300 focus:border-neutral-900 focus:bg-white'
                          } text-neutral-900 font-mono text-sm focus:outline-none`}
                        />
                      </div>

                      {/* Error message in RED as strictly requested */}
                      {formErrors.price && (
                        <div className="mt-1.5 p-2 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs font-semibold flex items-start gap-1.5">
                          <span>{formErrors.price}</span>
                        </div>
                      )}
                    </div>

                    {/* MOSTRA DE FORMA DINÀMICA: COMISSIÓ FIRA (10%) I IMPORT NET VENEDOR (90%) */}
                    <div className="sm:col-span-2 bg-neutral-50 p-4 rounded-xl border border-neutral-300 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center justify-between">
                        <span>Desglossament Financer en Viu (Comissió del 10%):</span>
                        {isInputPriceValid && (
                          <span className="text-emerald-700 font-mono flex items-center gap-1 font-bold">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Preu vàlid (múltiple de 5)
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white p-2.5 rounded-lg border border-neutral-300">
                          <span className="text-[10px] text-neutral-500 block font-semibold">Preu de Venda (100%)</span>
                          <span className="text-base font-black text-neutral-950 font-mono">
                            {isInputPriceValid ? `${parsedPrice.toFixed(2)} €` : '-- €'}
                          </span>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-orange-300">
                          <span className="text-[10px] text-orange-600 block font-bold">Comissió Fira (10%)</span>
                          <span className="text-base font-black text-orange-600 font-mono">
                            {dynamicCommission} €
                          </span>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-neutral-300">
                          <span className="text-[10px] text-neutral-700 block font-bold">Import Net Venedor (90%)</span>
                          <span className="text-base font-black text-neutral-900 font-mono">
                            {dynamicNet} €
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Descripció / Marca / Model / Talla *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Botes La Sportiva Nepal EVO GTX talla 43"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border ${
                          formErrors.description ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900 focus:bg-white'
                        } text-neutral-900 text-sm focus:outline-none`}
                      />
                      {formErrors.description && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.description}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Estat de Conservació del Material *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Nou', 'Bon estat', 'Ús moderat'] as PhysicalCondition[]).map((cond) => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => setFormData({ ...formData, condition: cond })}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                              formData.condition === cond
                                ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                            }`}
                          >
                            {cond}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTÓ D'ACCIÓ PRINCIPAL EN TARONJA (CALL TO ACTION) */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl font-black text-base text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 border-2 border-orange-500 shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5 text-white" />
                  <span>Donar d'Alta Material a El Pont de Suert ({autoCode})</span>
                </button>
              </form>
            </div>
          )}

          {/* SUB-PESTANYA 2: TAULA D'INVENTARI INTERN AMB FILTRATGE COMBINAT I GROC D'ACCENT A "VENUTS" */}
          {orgTab === 'inventory' && (
            <div className="space-y-4">
              
              {/* SISTEMA DE FILTRATGE COMBINAT EN FONS BLANC */}
              <div className="bg-white border-2 border-neutral-300 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between">
                
                {/* 1. Cercador per text (Codi, marca o venedor) */}
                <div className="relative w-full lg:max-w-xs">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Cercar per codi, marca o venedor..."
                    value={orgSearch}
                    onChange={(e) => setOrgSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white"
                  />
                </div>

                {/* 2. Filtre per Mètode de Pagament (Tots / Efectiu / VISA) */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-neutral-700 font-bold flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5 text-neutral-800" /> Pagament:
                  </span>
                  {(['Tots', 'Efectiu', 'VISA'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setOrgPaymentFilter(method)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                        orgPaymentFilter === method
                          ? 'bg-neutral-900 border-neutral-900 text-white'
                          : 'bg-white border-neutral-300 text-neutral-700 hover:text-black hover:border-neutral-400'
                      }`}
                    >
                      {method === 'Efectiu' && <Banknote className="w-3 h-3" />}
                      {method === 'VISA' && <CreditCard className="w-3 h-3" />}
                      <span>{method}</span>
                    </button>
                  ))}
                </div>

                {/* 3. Filtre per Estat del Material (Tots / Dipositat / Venut / Retornat al propietari) */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-neutral-700 font-bold">Estat:</span>
                  {(['Tots', 'Dipositat', 'Venut', 'Retornat al propietari'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrgStatusFilter(st)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        orgStatusFilter === st
                          ? st === 'Venut'
                            ? 'bg-amber-400 border-amber-500 text-neutral-950 font-black'
                            : 'bg-neutral-900 border-neutral-900 text-white'
                          : 'bg-white border-neutral-300 text-neutral-700 hover:text-black hover:border-neutral-400'
                      }`}
                    >
                      {st === 'Retornat al propietari' ? 'Retornat' : st === 'Tots' ? 'Tots els estats' : st}
                    </button>
                  ))}
                </div>

              </div>

              {/* TAULA D'INVENTARI INTERNA EN BLANC I CONTRAST */}
              <div className="bg-white border-2 border-neutral-300 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-neutral-900 border-b-2 border-neutral-800 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-3.5 px-3 text-center">Foto</th>
                        <th className="py-3.5 px-4">Codi</th>
                        <th className="py-3.5 px-4">Categoria / Descripció</th>
                        <th className="py-3.5 px-4">Dades Privades Venedor</th>
                        <th className="py-3.5 px-3 text-right">Preu Venda</th>
                        <th className="py-3.5 px-3 text-right text-orange-400">Comissió 10%</th>
                        <th className="py-3.5 px-3 text-right text-neutral-200">Net Venedor</th>
                        <th className="py-3.5 px-4">Estat & Pagament</th>
                        <th className="py-3.5 px-4 text-right">Acció</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {orgFilteredItems.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-neutral-500">
                            Cap article coincideix amb els filtres combinats.
                          </td>
                        </tr>
                      ) : (
                        orgFilteredItems.map((item) => {
                          const isSold = item.status === 'Venut';
                          const isReturned = item.status === 'Retornat al propietari';
                          const photoSrc = item.imageUrl || FALLBACK_MOUNTAIN_IMAGE;
                          const comm = item.price * 0.10;
                          const net = item.price * 0.90;

                          return (
                            <tr
                              key={item.id}
                              className={`transition-colors ${
                                // GROC: Marcador secundari d'accent, ressaltant visualment de forma subtil les files dels articles "Venuts"
                                isSold
                                  ? 'bg-amber-50/70 border-l-4 border-l-amber-400 hover:bg-amber-100/50'
                                  : isReturned
                                  ? 'bg-neutral-50/60 hover:bg-neutral-100/60'
                                  : 'hover:bg-neutral-50'
                              }`}
                            >
                              {/* MINIATURA FOTOGRÀFICA RODONA */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() =>
                                    setLightboxImage({
                                      url: photoSrc,
                                      title: item.description,
                                      code: item.code,
                                      category: item.category
                                    })
                                  }
                                  title="Clica per veure la foto ampliada"
                                  className="relative inline-block group cursor-pointer"
                                >
                                  <img
                                    src={photoSrc}
                                    alt={item.description}
                                    className={`w-11 h-11 rounded-full object-cover border-2 ${
                                      isSold ? 'border-amber-400' : 'border-neutral-300'
                                    } group-hover:border-neutral-900 shadow-sm transition-all`}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = FALLBACK_MOUNTAIN_IMAGE;
                                    }}
                                  />
                                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px]">
                                    <Maximize2 className="w-3 h-3" />
                                  </div>
                                </button>
                              </td>

                              {/* Codi */}
                              <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                                <span className="bg-neutral-100 border border-neutral-300 px-2.5 py-1 rounded-md">
                                  {item.code}
                                </span>
                              </td>

                              {/* Categoria & Descripció */}
                              <td className="py-3.5 px-4 max-w-xs">
                                <div className="font-bold text-neutral-900 text-xs sm:text-sm leading-snug">
                                  {item.description}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="text-[10px] bg-neutral-100 text-orange-600 font-bold border border-neutral-300 px-2 py-0.5 rounded">
                                    {item.category}
                                  </span>
                                  <span className="text-[10px] font-semibold bg-neutral-100 border border-neutral-300 text-neutral-700 px-2 py-0.5 rounded">
                                    {item.condition}
                                  </span>
                                  {isSold && (
                                    <span className="text-[10px] font-black bg-amber-400 text-black px-2 py-0.5 rounded shadow-xs">
                                      VENUT
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Dades Privades Venedor */}
                              <td className="py-3.5 px-4 min-w-[200px]">
                                <div className="font-semibold text-neutral-800 text-xs flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-neutral-500" />
                                  {item.sellerName}
                                </div>
                                <div className="text-[11px] text-neutral-600 flex items-center gap-1.5 mt-0.5">
                                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                                  {item.sellerPhone}
                                </div>
                                <div className="mt-1 flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                                  <span className="text-xs font-mono text-neutral-900 bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded break-all select-all">
                                    {item.sellerEmail}
                                  </span>
                                </div>
                              </td>

                              {/* DESGLOSSAMENT FINANCER */}
                              <td className="py-3.5 px-3 font-mono font-bold text-sm text-neutral-900 text-right whitespace-nowrap">
                                {item.price.toFixed(2)} €
                              </td>

                              <td className="py-3.5 px-3 font-mono font-bold text-xs text-orange-600 text-right whitespace-nowrap">
                                {comm.toFixed(2)} €
                              </td>

                              <td className="py-3.5 px-3 font-mono font-extrabold text-sm text-neutral-900 text-right whitespace-nowrap">
                                {net.toFixed(2)} €
                              </td>

                              {/* ESTAT & MÈTODE DE PAGAMENT */}
                              <td className="py-3.5 px-4 whitespace-nowrap space-y-1.5">
                                <select
                                  value={item.status}
                                  onChange={(e) =>
                                    handleStatusChange(item.id, e.target.value as CommercialStatus)
                                  }
                                  className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-none transition-colors w-full ${
                                    isSold
                                      ? 'bg-amber-300 text-black border-amber-400 font-black'
                                      : isReturned
                                      ? 'bg-neutral-100 border-neutral-300 text-neutral-700'
                                      : 'bg-neutral-900 border-neutral-800 text-white'
                                  }`}
                                >
                                  <option value="Dipositat">Dipositat (Públic)</option>
                                  <option value="Venut">Venut</option>
                                  <option value="Retornat al propietari">Retornat al propietari</option>
                                </select>

                                {/* SELECTOR DE MÈTODE DE PAGAMENT QUAN ÉS VENUT */}
                                {isSold && (
                                  <div className="flex items-center gap-1 pt-0.5">
                                    <button
                                      type="button"
                                      onClick={() => handlePaymentMethodChange(item.id, 'Efectiu')}
                                      className={`flex-1 px-2 py-1 rounded-lg text-[10px] font-black border transition-all flex items-center justify-center gap-1 ${
                                        item.paymentMethod === 'Efectiu'
                                          ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                                          : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                                      }`}
                                    >
                                      <Banknote className="w-3 h-3" />
                                      <span>Efectiu</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handlePaymentMethodChange(item.id, 'VISA')}
                                      className={`flex-1 px-2 py-1 rounded-lg text-[10px] font-black border transition-all flex items-center justify-center gap-1 ${
                                        item.paymentMethod === 'VISA'
                                          ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                                          : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                                      }`}
                                    >
                                      <CreditCard className="w-3 h-3" />
                                      <span>VISA</span>
                                    </button>
                                  </div>
                                )}
                              </td>

                              {/* BOTÓ D'ACCIÓ EN TARONJA: 📧 Generar Correu */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleNotifySeller(item)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer bg-orange-600 hover:bg-orange-500 text-white border border-orange-600"
                                  title={`Generar correu amb liquidació a ${item.sellerEmail}`}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>Generar Correu</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* MODAL LIGHTBOX PER VEURE LA FOTO AMPLIADA */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-neutral-950 border-2 border-neutral-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 bg-black border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-700">
                  {lightboxImage.code}
                </span>
                <span className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {lightboxImage.title}
                </span>
                <span className="text-[10px] text-orange-400 bg-black px-2 py-0.5 rounded border border-neutral-800 font-semibold">
                  {lightboxImage.category}
                </span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="p-3 bg-black text-center text-xs text-neutral-400 flex items-center justify-center gap-2 border-t border-neutral-850">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Custòdia a la seu única: <strong>El Pont de Suert</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: AUTENTICACIÓ PER CONTRASENYA ("fira2026") */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-neutral-300 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 text-neutral-900">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-neutral-900 text-white">
                  <Lock className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Accés de l'Organització</h3>
                  <p className="text-xs text-neutral-500">4a Fira de Muntanya • El Pont de Suert</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-neutral-400 hover:text-black p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Introdueix la contrasenya del sistema ("fira2026") per accedir al panell de control de l'organització.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Contrasenya d'Organitzador
                </label>
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    placeholder="Escriu la contrasenya..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 focus:border-neutral-900 text-neutral-900 text-sm focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <div className="mt-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all border border-neutral-300"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  Entrar al Panell
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VISTA PRÈVIA DEL CORREU / MAILTO */}
      {emailModalItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-neutral-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 text-neutral-900">
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-2xl ${
                    emailModalItem.status === 'Venut'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'bg-neutral-100 text-neutral-800 border border-neutral-300'
                  }`}
                >
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    Notificació per a Venedor ({emailModalItem.code})
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                        emailModalItem.status === 'Venut'
                          ? 'bg-amber-300 text-black border-amber-400 font-black'
                          : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                      }`}
                    >
                      {emailModalItem.status}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Destinatari: <strong>{emailModalItem.sellerName}</strong> ({emailModalItem.sellerEmail}) • Seu: <strong>El Pont de Suert</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEmailModalItem(null)}
                className="text-neutral-400 hover:text-black p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Desglossament financer de la liquidació */}
            {emailModalItem.status === 'Venut' && (
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-neutral-600 block font-semibold">Preu Final</span>
                  <span className="font-mono font-bold text-neutral-900">{emailModalItem.price.toFixed(2)} €</span>
                </div>
                <div>
                  <span className="text-[10px] text-orange-600 block font-semibold">Comissió Fira (10%)</span>
                  <span className="font-mono font-bold text-orange-600">-{(emailModalItem.price * 0.10).toFixed(2)} €</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-700 block font-semibold">Import Net a Recollir</span>
                  <span className="font-mono font-extrabold text-neutral-950">{(emailModalItem.price * 0.90).toFixed(2)} €</span>
                </div>
              </div>
            )}

            <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-300 text-xs">
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                <span className="font-bold text-neutral-600 uppercase">Para:</span>
                <span className="font-mono text-neutral-900 font-semibold">{emailModalItem.sellerEmail}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center border-t border-neutral-200 pt-2">
                <span className="font-bold text-neutral-600 uppercase">Assumpte:</span>
                <span className="font-semibold text-neutral-900">{getEmailContent(emailModalItem).subject}</span>
              </div>
              <div className="border-t border-neutral-200 pt-2">
                <span className="block font-bold text-neutral-600 uppercase mb-1.5">
                  Cos del Missatge Redactat en Català:
                </span>
                <div className="bg-white p-3 rounded-lg border border-neutral-300 font-mono text-neutral-800 text-[11px] leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {getEmailContent(emailModalItem).body}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={handleCopyEmailText}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedEmailText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copiat al porta-retalls!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-500" />
                    <span>Copiar text complet</span>
                  </>
                )}
              </button>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setEmailModalItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold border border-neutral-300"
                >
                  Tancar
                </button>
                <a
                  href={`mailto:${encodeURIComponent(emailModalItem.sellerEmail)}?subject=${encodeURIComponent(
                    getEmailContent(emailModalItem).subject
                  )}&body=${encodeURIComponent(getEmailContent(emailModalItem).body)}`}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Obrir al Gestor de Correu (Mailto)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CORPORATIU EN NEGRE I GRIS FOSC */}
      <footer className="border-t-2 border-neutral-800 bg-black py-4 px-4 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GeometricMountainLogo className="w-6 h-6" />
            <span className="font-bold text-white tracking-wide">
              4a FIRA DE MUNTANYA DE L'ALTA RIBAGORÇA • EL PONT DE SUERT
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            Preus arrodonits en 0 o 5 € • Comissió del 10% per a l'organització.
          </p>
        </div>
      </footer>
    </div>
  );
}
