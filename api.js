// API Integration for NovaAI
class NovaAPI {
    constructor() {
        this.baseUrl = 'https://api.novaai.ai/v1';
        this.apiKey = localStorage.getItem('nova_api_key');
    }
    
    // Set API key
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('nova_api_key', key);
    }
    
    // Chat with NovaAI (Cohere API)
    async chat(message, history = []) {
        try {
            const response = await fetch(`${this.baseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    message,
                    history
                })
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
            return "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
        }
    }
    
    // Generate Image (StabilityAI API)
    async generateImage(prompt) {
        try {
            const response = await fetch(`${this.baseUrl}/generate-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    prompt
                })
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            return data.image_url;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
    
    // Analyze Document
    async analyzeDocument(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${this.baseUrl}/analyze-document`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: formData
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            return data.summary;
        } catch (error) {
            console.error('Error:', error);
            return "Maaf, terjadi kesalahan saat menganalisis dokumen.";
        }
    }
    
    // Enhance Image to HD
    async enhanceImage(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${this.baseUrl}/enhance-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: formData
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            return data.enhanced_image_url;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}

// Initialize API
const novaAPI = new NovaAPI();

// Example usage:
// novaAPI.chat("Hello").then(response => console.log(response));
// novaAPI.generateImage("A beautiful sunset").then(url => console.log(url));