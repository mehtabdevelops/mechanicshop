"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description: string;
  quantity: number;
  image: string;
}

const AdminInventory = () => {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "5W20 Engine Oil",
      category: "Engine Oils",
      description: "High-performance synthetic engine oil for modern engines",
      quantity: 42,
      image: "https://i5.walmartimages.ca/images/Large/089/620/6000207089620.jpg?odnHeight=580&odnWidth=580&odnBg=FFFFFF" },
    {
      id: 2,
      name: "5W30 Engine Oil",
      category: "Engine Oils",
      description: "Premium synthetic blend for all-season protection",
      quantity: 38,
      image: "https://assets-eu-01.kc-usercontent.com/f6cd2b46-8bba-0192-295a-67d84f619e7a/628c62a5-57f2-4349-919f-d9ae727bf81a/Website%20products%20shotsWL_Engine%20oil%20Engine%20oil.jpg"
    },
    {
      id: 3,
      name: "75W90 Engine Oil",
      category: "Engine Oils",
      description: "Heavy-duty engine oil for high-mileage vehicles",
      quantity: 15,
      image: "https://assets-eu-01.kc-usercontent.com/f6cd2b46-8bba-0192-295a-67d84f619e7a/a1dcb710-eca6-4668-b27f-669cce5204bf/Website%20products%20shotsWL_Haudralic%20Transmission%20HD%20%281%29.jpg?auto=format"  },
    {
      id: 4,
      name: "Oil Filter",
      category: "Filters",
      description: "Premium oil filter for extended engine life",
      quantity: 64,
      image: "https://media-www.canadiantire.ca/product/automotive/light-auto-parts/oil-filters/0275522/ph6017a-fram-extra-guard-oil-filter-c293be9e-1811-4866-a8bf-81530f4e3ca0-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=gZoom" },
    {
      id: 5,
      name: "Air Filter",
      category: "Filters",
      description: "High-flow air filter for improved engine performance",
      quantity: 52,
      image: "https://www.highfil.com/UpLoadFile/ProductImages/202306/e2a5f4542a214ba38b72ef4e736066f5_water.jpg" },
    {
      id: 6,
      name: "Cabin Air Filter",
      category: "Filters",
      description: "Charcoal cabin air filter for improved air quality",
      quantity: 28,
      image: "https://www.fcpeuro.com/public/assets/products/566352/large/F2324083-5B84-4F9E-A931-F58B466DB596-2.jpg?1693491945"   },
    {
      id: 7,
      name: "Brake Pads",
      category: "Brake Systems",
      description: "Ceramic brake pads for quiet operation and clean performance",
      quantity: 22,
      image: "https://www.aftermarket.astemo.com/emea/en/motorcycle/assets/img/nissin/brakepads/2P-202NS.jpg" },
    {
      id: 8,
      name: "Brake Rotors",
      category: "Brake Systems",
      description: "Premium drilled and slotted brake rotors for improved cooling",
      quantity: 18,
      image: "https://www.minitruckusa.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/i/m/image1_7_.jpeg" },
    {
      id: 9,
      name: "Multi-Purpose Grease",
      category: "Lubricants",
      description: "High-temperature grease for chassis and bearing applications",
      quantity: 35,
      image: "https://media-www.canadiantire.ca/product/automotive/auto-maintenance/auto-fluids/0381537/wd-40-lube-3-78l-6f67ebb8-d764-482c-bc95-f996ecde1e5b-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=gZoom"  },
    {
      id: 10,
      name: " Gear Oil",
      category: "Lubricants",
      description: "75W-90 synthetic gear oil for differentials and transmissions",
      quantity: 24,
      image: "https://media-www.canadiantire.ca/product/automotive/auto-maintenance/specialty-oil-lubricants/0280248/motomaster-5l-synthetic-gear-oil-jug-e0f6ff9b-7a1a-4fe5-ae2f-f811d1c12171-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=gZoom"
    }
  ]);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logging out...');
      // In a real app, this would navigate to /
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
  };

  const closeEditModal = () => {
    setEditingItem(null);
  };

  const saveQuantity = () => {
    if (editingItem) {
      const updatedInventory = inventory.map(item => 
        item.id === editingItem.id ? { ...item, quantity: editQuantity } : item
      );
      setInventory(updatedInventory);
      closeEditModal();
    }
  };

  // Filter inventory based on search and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = ['All Categories', ...new Set(inventory.map(item => item.category))];

  return (
    <div style={{ 
      background: '#0f172a',
      minHeight: '100vh', 
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700',
          color: '#f97316',
          margin: 0
        }}>
          SUNNY AUTO ADMIN
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              color: '#f97316',
              padding: '0.75rem 1.5rem',
              border: '1px solid #f97316',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f97316';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#f97316';
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        padding: '2rem',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ 
          backgroundColor: '#1e293b',
          padding: '2.5rem',
          borderRadius: '12px',
          maxWidth: '1400px',
          margin: '0 auto',
          border: '1px solid #334155'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700',
              color: '#f97316',
              margin: 0
            }}>
              INVENTORY MANAGEMENT
            </h2>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#334155',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid #475569'
              }}>
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    backgroundColor: 'transparent', 
                    border: 'none', 
                    color: 'white', 
                    outline: 'none',
                    width: '200px'
                  }}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#f97316' }}>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ 
                  backgroundColor: '#334155', 
                  color: 'white', 
                  border: '1px solid #475569', 
                  borderRadius: '8px',
                  padding: '0.5rem 1rem'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {filteredInventory.map(item => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#334155',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(249, 115, 22, 0.3)';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#475569';
                }}
              >      
                <div 
                  style={{ 
                    height: '180px', 
                    overflow: 'hidden', 
                    borderRadius: '8px', 
                    marginBottom: '1rem' 
                  }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      transition: 'transform 0.3s ease' 
                    }}
                  />
                </div>
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: 'rgba(249, 115, 22, 0.2)', 
                  color: '#f97316', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem', 
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  border: '1px solid #f97316'
                }}>
                  {item.category}
                </div>
                <h3 style={{ color: '#f97316', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{item.name}</h3>
                <p style={{ color: '#cbd5e1', marginBottom: '1rem', fontSize: '0.9rem', minHeight: '40px' }}>{item.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div>
                    <span style={{ fontWeight: '600', color: item.quantity < 20 ? '#ef4444' : '#f97316' }}>
                      Quantity: {item.quantity}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(item);
                    }}
                    style={{
                      backgroundColor: '#f97316',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show message if no items match filter */}
          {filteredInventory.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#94a3b8',
              backgroundColor: '#334155',
              borderRadius: '8px',
              border: '1px solid #475569'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#f97316', marginBottom: '1rem' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 style={{ color: '#f97316', marginBottom: '0.5rem' }}>No inventory items found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleBackToDashboard}
              style={{
                backgroundColor: 'transparent',
                color: '#f97316',
                border: '1px solid #f97316',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#f97316';
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem 2rem',
        backgroundColor: '#1e293b',
        borderTop: '1px solid #334155',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
          &copy; 2025 Sunny Auto. All rights reserved.
        </p>
      </footer>

      {/* Edit Modal */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #334155',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h2 style={{ 
              color: '#f97316', 
              marginBottom: '1.5rem', 
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Edit Inventory
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: '500' }}>Product Name</label>
              <input 
                type="text" 
                value={editingItem.name} 
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: '500' }}>Quantity</label>
              <input 
                type="number" 
                value={editQuantity} 
                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                min="0"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={closeEditModal}
                style={{
                  backgroundColor: 'transparent',
                  color: '#f97316',
                  border: '1px solid #f97316',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f97316';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#f97316';
                }}
              >
                Cancel
              </button>
              
              <button 
                onClick={saveQuantity}
                style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;