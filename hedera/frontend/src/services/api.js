const API_URL = 'http://localhost:3001';
const WS_URL = 'ws://localhost:3001';

class NegotiationAPI {
  constructor() {
    this.ws = null;
    this.messageHandlers = [];
  }

  // Connect to WebSocket
  connect(onMessage, onError) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => {
          console.log('📡 Connected to server');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 Received:', data.type);
            if (onMessage) {
              onMessage(data);
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (onError) {
            onError(error);
          }
        };

        this.ws.onclose = () => {
          console.log('📡 Disconnected from server');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Start negotiation
  async startNegotiation() {
    try {
      const response = await fetch(`${API_URL}/api/negotiate/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start negotiation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting negotiation:', error);
      throw error;
    }
  }

  // Get product info
  async getProduct() {
    try {
      const response = await fetch(`${API_URL}/api/product`);
      if (!response.ok) {
        throw new Error('Failed to get product info');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      if (!response.ok) {
        throw new Error('Server not responding');
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export default new NegotiationAPI();

