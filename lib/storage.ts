import { ClientLead } from './types';

const STORAGE_KEY = 'fintech_client_leads';

/**
 * Safely read ClientLead array from localStorage
 * Handles SSR gracefully by checking if window is available
 */
export function getLeads(): ClientLead[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading leads from localStorage:', error);
    return [];
  }
}

/**
 * Save a new ClientLead to localStorage
 */
export function addLead(lead: ClientLead): boolean {
  if (typeof window === 'undefined') {
    console.warn('addLead: localStorage not available (SSR context)');
    return false;
  }

  try {
    const leads = getLeads();
    leads.push(lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    return true;
  } catch (error) {
    console.error('Error saving lead to localStorage:', error);
    return false;
  }
}

/**
 * Save entire ClientLead array to localStorage
 */
export function saveLeads(leads: ClientLead[]): boolean {
  if (typeof window === 'undefined') {
    console.warn('saveLeads: localStorage not available (SSR context)');
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    return true;
  } catch (error) {
    console.error('Error saving leads to localStorage:', error);
    return false;
  }
}

/**
 * Get a single lead by ID
 */
export function getLeadById(id: string): ClientLead | null {
  const leads = getLeads();
  return leads.find((lead) => lead.id === id) || null;
}

/**
 * Delete a lead by ID
 */
export function deleteLead(id: string): boolean {
  if (typeof window === 'undefined') {
    console.warn('deleteLead: localStorage not available (SSR context)');
    return false;
  }

  try {
    const leads = getLeads();
    const filtered = leads.filter((lead) => lead.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting lead from localStorage:', error);
    return false;
  }
}

/**
 * Clear all leads from localStorage
 */
export function clearAllLeads(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing leads from localStorage:', error);
    return false;
  }
}
