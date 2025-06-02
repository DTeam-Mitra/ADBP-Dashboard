
// Data service for PostgreSQL integration
// This will be connected to your PostgreSQL database

export interface SchemeData {
  id: string;
  name: string;
  target_achievement: number;
  current_achievement: number;
  created_at: string;
  updated_at: string;
}

export interface RegionData {
  id: string;
  name: string;
  type: 'country' | 'state' | 'district' | 'block';
  parent_id?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  population?: number;
  literacy_rate?: number;
  gdp_per_capita?: number;
  healthcare_index?: number;
}

export interface IndicatorData {
  id: string;
  region_id: string;
  scheme_id: string;
  indicator_type: string;
  value: number;
  timestamp: string;
}

class DataService {
  private baseUrl: string;

  constructor() {
    // TODO: Replace with your actual API endpoint
    this.baseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  }

  // Schemes data
  async getSchemes(): Promise<SchemeData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/schemes`);
      if (!response.ok) throw new Error('Failed to fetch schemes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching schemes:', error);
      // Return mock data for development
      return this.getMockSchemes();
    }
  }

  async getSchemeById(id: string): Promise<SchemeData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/schemes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch scheme');
      return await response.json();
    } catch (error) {
      console.error('Error fetching scheme:', error);
      return null;
    }
  }

  // Regions data
  async getRegions(level: string = 'country'): Promise<RegionData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/regions?level=${level}`);
      if (!response.ok) throw new Error('Failed to fetch regions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching regions:', error);
      return this.getMockRegions();
    }
  }

  async getRegionById(id: string): Promise<RegionData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/regions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch region');
      return await response.json();
    } catch (error) {
      console.error('Error fetching region:', error);
      return null;
    }
  }

  // Indicators data
  async getIndicatorData(regionId: string, schemeId: string): Promise<IndicatorData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/indicators?region_id=${regionId}&scheme_id=${schemeId}`
      );
      if (!response.ok) throw new Error('Failed to fetch indicators');
      return await response.json();
    } catch (error) {
      console.error('Error fetching indicators:', error);
      return [];
    }
  }

  // Chat integration
  async sendChatMessage(message: string, sessionId: string): Promise<{ message: string }> {
    try {
      const webhookUrl = process.env.VITE_CHATBOT_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  // Mock data for development
  private getMockSchemes(): SchemeData[] {
    return [
      {
        id: 'pm-kisan',
        name: 'Pradhan Mantri Kisan Samman Nidhi',
        target_achievement: 98,
        current_achievement: 98,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'pm-jan-arogya',
        name: 'Pradhan Mantri Jan Arogya Yojana',
        target_achievement: 98,
        current_achievement: 98,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'mahila-samriddhi',
        name: 'Mahila Samriddhi Yojana',
        target_achievement: 98,
        current_achievement: 98,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'yuva-karya',
        name: 'Mukhyamantri Yuva Karya Prashikshan Yojana',
        target_achievement: 98,
        current_achievement: 98,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  private getMockRegions(): RegionData[] {
    return [
      {
        id: 'india',
        name: 'India',
        type: 'country',
        coordinates: { lat: 20.5937, lng: 78.9629 },
        population: 1380000000,
        literacy_rate: 77.7,
      },
      {
        id: 'maharashtra',
        name: 'Maharashtra',
        type: 'state',
        parent_id: 'india',
        coordinates: { lat: 19.7515, lng: 75.7139 },
        population: 112000000,
        literacy_rate: 82.3,
      },
      {
        id: 'uttar-pradesh',
        name: 'Uttar Pradesh',
        type: 'state',
        parent_id: 'india',
        coordinates: { lat: 26.8467, lng: 80.9462 },
        population: 199000000,
        literacy_rate: 67.7,
      },
    ];
  }
}

export const dataService = new DataService();
