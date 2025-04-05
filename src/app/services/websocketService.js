class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectTimeout = null;
    this.listeners = new Map();
    this.subscribedAssets = new Set();
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.socket = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,ripple');

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('WebSocket connection established');
        this.dispatchEvent('connected', {});
        
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.dispatchEvent('priceUpdate', data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.dispatchEvent('error', { error });
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        console.log('WebSocket connection closed');
        this.dispatchEvent('disconnected', {});
        
        // Attempt to reconnect after 5 seconds
        this.reconnectTimeout = setTimeout(() => {
          this.connect();
        }, 5000);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  subscribe(asset) {
    if (!this.isConnected) {
      this.connect();
    }

    if (!this.subscribedAssets.has(asset)) {
      this.subscribedAssets.add(asset);
      
      // Reconnect with new subscription list
      this.reconnect();
    }
  }

  unsubscribe(asset) {
    if (this.subscribedAssets.has(asset)) {
      this.subscribedAssets.delete(asset);
      
      // Reconnect with updated subscription list
      this.reconnect();
    }
  }

  reconnect() {
    if (this.socket) {
      this.socket.close();
    }
    
    const assetsList = Array.from(this.subscribedAssets).join(',');
    this.socket = new WebSocket(`wss://ws.coincap.io/prices?assets=${assetsList || 'bitcoin,ethereum,ripple'}`);
    
    // Reattach event handlers
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    // Similar to the handlers in connect(), but for reconnection
    // ...
  }

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push(callback);
    return () => this.removeEventListener(event, callback);
  }

  removeEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  dispatchEvent(event, data) {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const callbacks = this.listeners.get(event);
    callbacks.forEach(callback => callback(data));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.isConnected = false;
  }
  
  // Method for simulating weather alerts
  simulateWeatherAlert(city, alertType) {
    const alertData = {
      type: 'weatherAlert',
      city,
      alertType,
      message: `${alertType} alert for ${city}`,
      timestamp: new Date().toISOString()
    };
    
    this.dispatchEvent('weatherAlert', alertData);
    return alertData;
  }
}

// Singleton instance
const websocketService = new WebSocketService();
export default websocketService;
