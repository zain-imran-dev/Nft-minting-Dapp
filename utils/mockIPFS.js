// Mock IPFS service for local testing
// In production, replace with real Pinata integration

class MockIPFS {
  constructor() {
    this.storage = new Map();
    this.counter = 0;
  }

  async uploadImage(file) {
    const hash = `mock_image_hash_${this.counter++}`;
    
    // Convert file to base64 for mock storage
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
    
    const base64Data = await base64Promise;
    this.storage.set(hash, base64Data);
    
    return {
      hash,
      url: `http://localhost:3001/ipfs/${hash}` // Mock IPFS URL
    };
  }

  async uploadMetadata(metadata) {
    const hash = `mock_metadata_hash_${this.counter++}`;
    this.storage.set(hash, JSON.stringify(metadata));
    
    return {
      hash,
      url: `http://localhost:3001/ipfs/${hash}`
    };
  }

  async createNFTMetadata(file, attributes) {
    // Upload image
    const imageResult = await this.uploadImage(file);
    
    // Create metadata
    const metadata = {
      name: attributes.name,
      description: attributes.description,
      image: imageResult.url,
      attributes: attributes.traits || []
    };
    
    // Upload metadata
    const metadataResult = await this.uploadMetadata(metadata);
    
    return metadataResult.url;
  }

  // Get stored data (for mock server)
  getData(hash) {
    return this.storage.get(hash);
  }
}

module.exports = MockIPFS;