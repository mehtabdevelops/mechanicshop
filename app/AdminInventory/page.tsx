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
      image: "https://i5.walmartimages.ca/images/Large/089/620/6000207089620.jpg?odnHeight=580&odnWidth=580&odnBg=FFFFFF" 
    },
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
      image: "https://assets-eu-01.kc-usercontent.com/f6cd2b46-8bba-0192-295a-67d84f619e7a/a1dcb710-eca6-4668-b27f-669cce5204bf/Website%20products%20shotsWL_Haudralic%20Transmission%20HD%20%281%29.jpg?auto=format"  
    },
    {
      id: 4,
      name: "Oil Filter",
      category: "Filters",
      description: "Premium oil filter for extended engine life",
      quantity: 64,
      image: "https://media-www.canadiantire.ca/product/automotive/light-auto-parts/oil-filters/0275522/ph6017a-fram-extra-guard-oil-filter-c293be9e-1811-4866-a8bf-81530f4e3ca0-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=gZoom" 
    },
    {
      id: 5,
      name: "Air Filter",
      category: "Filters",
      description: "High-flow air filter for improved engine performance",
      quantity: 52,
      image: "https://www.highfil.com/UpLoadFile/ProductImages/202306/e2a5f4542a214ba38b72ef4e736066f5_water.jpg" 
    },
    {
      id: 6,
      name: "Cabin Air Filter",
      category: "Filters",
      description: "Charcoal cabin air filter for improved air quality",
      quantity: 28,
      image: "https://www.fcpeuro.com/public/assets/products/566352/large/F2324083-5B84-4F9E-A931-F58B466DB596-2.jpg?1693491945"   
    },
    {
      id: 7,
      name: "Brake Pads",
      category: "Brake Systems",
      description: "Ceramic brake pads for quiet operation and clean performance",
      quantity: 22,
      image: "https://www.aftermarket.astemo.com/emea/en/motorcycle/assets/img/nissin/brakepads/2P-202NS.jpg" 
    },
    {
      id: 8,
      name: "Brake Rotors",
      category: "Brake Systems",
      description: "Premium drilled and slotted brake rotors for improved cooling",
      quantity: 18,
      image: "https://www.minitruckusa.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/i/m/image1_7_.jpeg" 
    },
    {
      id: 9,
      name: "Multi-Purpose Grease",
      category: "Lubricants",
      description: "High-temperature grease for chassis and bearing applications",
      quantity: 35,
      image: "https://media-www.canadiantire.ca/product/automotive/auto-maintenance/auto-fluids/0381537/wd-40-lube-3-78l-6f67ebb8-d764-482c-bc95-f996ecde1e5b-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=gZoom"  
    },
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

  // Color scheme - Orange dominant (60-70%) with white (30-40%)
  const colors = {
    primary: '#FF6B35',
    primaryLight: '#FF8C42',
    primaryDark: '#E55A2B',
    primaryExtraLight: '#FFE4D6',
    background: '#FFFFFF',
    surface: '#FFF5F0',
    surfaceLight: '#FFECE6',
    surfaceDark: '#FFD9CC',
    text: '#1E293B',
    textSecondary: '#475569',
    textMuted: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  };

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      router.push('/');
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
      background: colors.background,
      minHeight: '100vh', 
      color: colors.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header - Orange Dominant */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary,
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '800',
            color: colors.background,
            margin: 0,
            cursor: 'pointer'
          }} onClick={handleBackToDashboard}>
            SUNNY AUTO
          </h1>
          <div style={{ 
            color: colors.primary, 
            fontSize: '0.9rem',
            fontWeight: '500',
            padding: '0.25rem 0.75rem',
            backgroundColor: colors.background,
            borderRadius: '20px'
          }}>
            INVENTORY MANAGEMENT
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              color: colors.background,
              padding: '0.75rem 1.5rem',
              border: `2px solid ${colors.background}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.background;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.background;
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
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Header Section */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '800',
                color: colors.primary,
                margin: '0 0 0.5rem 0'
              }}>
                Inventory Management
              </h2>
              <p style={{ 
                color: colors.textSecondary,
                margin: 0,
                fontSize: '1rem'
              }}>
                Manage parts, tools, and stock levels
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search Bar */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: colors.background,
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: `2px solid ${colors.primaryLight}`,
                width: '280px'
              }}>
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    backgroundColor: 'transparent', 
                    border: 'none', 
                    color: colors.text, 
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem'
                  }}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: colors.primary }}>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              
              {/* Category Filter */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ 
                  backgroundColor: colors.background, 
                  color: colors.text, 
                  border: `2px solid ${colors.primaryLight}`, 
                  borderRadius: '12px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: colors.surface,
              padding: '1.5rem',
              borderRadius: '12px',
              border: `2px solid ${colors.primary}`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.primary }}>
                {inventory.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                Total Products
              </div>
            </div>
            
            <div style={{
              backgroundColor: colors.surface,
              padding: '1.5rem',
              borderRadius: '12px',
              border: `2px solid ${colors.success}`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.success }}>
                {inventory.filter(item => item.quantity < 20).length}
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                Low Stock Items
              </div>
            </div>
            
            <div style={{
              backgroundColor: colors.surface,
              padding: '1.5rem',
              borderRadius: '12px',
              border: `2px solid ${colors.warning}`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.warning }}>
                {categories.length - 1}
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                Categories
              </div>
            </div>
          </div>

          {/* Inventory Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {filteredInventory.map(item => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: colors.surface,
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: `2px solid ${colors.primaryLight}`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = colors.primaryLight;
                }}
              >      
                <div 
                  style={{ 
                    height: '180px', 
                    overflow: 'hidden', 
                    borderRadius: '12px', 
                    marginBottom: '1rem',
                    border: `2px solid ${colors.surfaceDark}`
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
                  backgroundColor: colors.primaryExtraLight, 
                  color: colors.primary, 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  border: `1px solid ${colors.primary}`
                }}>
                  {item.category}
                </div>
                
                <h3 style={{ 
                  color: colors.primary, 
                  marginBottom: '0.75rem', 
                  fontSize: '1.1rem',
                  fontWeight: '700'
                }}>
                  {item.name}
                </h3>
                
                <p style={{ 
                  color: colors.textSecondary, 
                  marginBottom: '1rem', 
                  fontSize: '0.9rem', 
                  minHeight: '40px',
                  lineHeight: '1.4'
                }}>
                  {item.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: `1px solid ${colors.surfaceDark}`
                }}>
                  <div>
                    <span style={{ 
                      fontWeight: '700', 
                      color: item.quantity < 20 ? colors.error : colors.primary,
                      fontSize: '1rem'
                    }}>
                      Quantity: {item.quantity}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(item);
                    }}
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.background,
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryDark}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                  >
                    Edit Stock
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
              color: colors.textSecondary,
              backgroundColor: colors.surface,
              borderRadius: '16px',
              border: `2px solid ${colors.primaryLight}`
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: colors.primary, marginBottom: '1rem' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 style={{ color: colors.primary, marginBottom: '0.5rem', fontSize: '1.3rem' }}>No inventory items found</h3>
              <p style={{ margin: 0 }}>Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <button 
              onClick={handleBackToDashboard}
              style={{
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `2px solid ${colors.primary}`,
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.color = colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.primary;
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: colors.background,
            padding: '2rem',
            borderRadius: '16px',
            border: `2px solid ${colors.primary}`,
            width: '400px',
            maxWidth: '90%'
          }}>
            <h2 style={{ 
              color: colors.primary, 
              marginBottom: '1.5rem', 
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Update Stock Level
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                color: colors.text, 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Product Name
              </label>
              <input 
                type="text" 
                value={editingItem.name} 
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.primaryLight}`,
                  borderRadius: '8px',
                  color: colors.text,
                  fontWeight: '500'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                color: colors.text, 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Current Quantity
              </label>
              <input 
                type="number" 
                value={editQuantity} 
                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                min="0"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.primaryLight}`,
                  borderRadius: '8px',
                  color: colors.text,
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={closeEditModal}
                style={{
                  backgroundColor: 'transparent',
                  color: colors.primary,
                  border: `2px solid ${colors.primary}`,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  flex: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                  e.currentTarget.style.color = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.primary;
                }}
              >
                Cancel
              </button>
              
              <button 
                onClick={saveQuantity}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s ease',
                  flex: 1
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryDark}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
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