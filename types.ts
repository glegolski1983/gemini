
import React from 'react';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  status: 'published' | 'draft' | 'pending';
  price: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  group: string;
  lang: string;
  email: string;
  phone: string;
  type: 'ACTION' | 'DOSTAWCA';
  status: 'AKTYWNY' | 'NIEAKTYWNY';
  approval: 'ZAAKCEPTOWANY' | 'OCZEKUJĄCY';
  mfa: boolean;
  method: string;
  lastLogin: string;
  createdDate: string;
  editDate: string;
}

export interface ChangeLog {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  entityType: 'PRODUKT' | 'FORMATKA' | 'JEDNOSTKA' | 'UZYTKOWNIK' | 'SYSTEM' | 'PRODUCENT';
  entityName: string;
  action: 'EDYCJA' | 'DODANIE' | 'USUNIĘCIE' | 'SYNC' | 'AI_GEN';
  details: string;
  oldValue?: string;
  newValue?: string;
}

export enum MenuSection {
  DASHBOARD = 'DASHBOARD',
  PRODUCTS = 'PRODUKTY',
  MARKETING_DESCRIPTIONS = 'OPISY MARKETINGOWE',
  PRODUCERS = 'NAZWY PRODUCENTÓW',
  FORMATKI = 'FORMATKI',
  DICTIONARIES = 'SEKCJE I ATRYBUTY',
  FILTERS = 'FILTRY',
  IMPORTER = 'IMPORTER OPISÓW',
  GRAPH_DB = 'BAZA GRAFOWA',
  COMPATIBILITY = 'KOMPATYBILNOŚCI',
  SEMANTIC_SEARCH = 'SZUKANIE SEMANTYCZNE',
  UNITS = 'JEDNOSTKI MIARY',
  USERS = 'UŻYTKOWNICY',
  CHANGE_LOGS = 'LOGOWANIE ZMIAN'
}
