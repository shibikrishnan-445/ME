import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadDemoSME } from '../services/api';
import { useToast } from './ToastContext';
import { WhatIfScenarioInput } from '../types';

export type NavTab = 
  | 'dashboard'
  | 'analytics'
  | 'inventory'
  | 'insights'
  | 'simulator'
  | 'assistant'
  | 'customers'
  | 'alerts'
  | 'decisions'
  | 'reports'
  | 'data'
  | 'settings';

interface BusinessContextType {
  businessId: string;
  businessName: string;
  isDemoMode: boolean;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  simulatorPreset: WhatIfScenarioInput | null;
  setSimulatorPreset: (preset: WhatIfScenarioInput | null) => void;
  handleLoadDemo: () => Promise<void>;
  isLoadingDemo: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businessId, setBusinessId] = useState<string>('biz_urbankart_demo');
  const [businessName, setBusinessName] = useState<string>('UrbanKart Retail');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [simulatorPreset, setSimulatorPreset] = useState<WhatIfScenarioInput | null>(null);
  const [isLoadingDemo, setIsLoadingDemo] = useState<boolean>(false);
  const { showToast } = useToast();

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLoadDemo = async () => {
    try {
      setIsLoadingDemo(true);
      const res = await loadDemoSME();
      setBusinessId(res.businessId || 'biz_urbankart_demo');
      setBusinessName('UrbanKart Retail');
      setIsDemoMode(true);
      triggerRefresh();
      showToast('Demo SME Loaded', 'UrbanKart Retail populated with 6 products, intentional anomalies & health metrics.', 'success');
      setActiveTab('dashboard');
    } catch (err: any) {
      showToast('Error Loading Demo', err.message, 'error');
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        businessId,
        businessName,
        isDemoMode,
        activeTab,
        setActiveTab,
        refreshKey,
        triggerRefresh,
        simulatorPreset,
        setSimulatorPreset,
        handleLoadDemo,
        isLoadingDemo
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used within BusinessProvider');
  return ctx;
}
