
// Webhook configuration for chatbot and data integration

export interface WebhookConfig {
  chatbot: {
    url: string;
    timeout: number;
    retries: number;
  };
  dataSync: {
    url: string;
    interval: number; // in milliseconds
  };
}

export const webhookConfig: WebhookConfig = {
  chatbot: {
    url: import.meta.env.VITE_CHATBOT_WEBHOOK_URL || 'https://aftershock2.app.n8n.cloud/webhook-test/bf4dd093-bb02-472c-9454-7ab9af97bd1d',
    timeout: 10000, // 10 seconds
    retries: 3,
  },
  dataSync: {
    url: import.meta.env.VITE_DATA_SYNC_WEBHOOK_URL || 'YOUR_DATA_SYNC_WEBHOOK_URL',
    interval: 30000, // 30 seconds
  },
};

export class WebhookService {
  static async sendMessage(
    message: string, 
    sessionId: string
  ): Promise<{ message: string; success: boolean }> {
    const { url, timeout, retries } = webhookConfig.chatbot;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            sessionId,
            timestamp: new Date().toISOString(),
            source: 'mitra_dashboard',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return { message: data.message || data.text || 'Response received', success: true };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Webhook attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          return { 
            message: 'Sorry, I am currently unavailable. Please try again later.', 
            success: false 
          };
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return { 
      message: 'Sorry, I am currently unavailable. Please try again later.', 
      success: false 
    };
  }

  static async syncData(): Promise<boolean> {
    try {
      const response = await fetch(webhookConfig.dataSync.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync_data',
          timestamp: new Date().toISOString(),
          source: 'mitra_dashboard',
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Data sync failed:', error);
      return false;
    }
  }
}
