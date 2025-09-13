"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    router.push('/');
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
      backgroundImage: 'url("https://i.pinimg.com/originals/00/19/06/001906ee4d13dbfbe565f4816d9e91ef.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', 
      color: 'white',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
      }}></div>

      {/* Header with Centered Title */}
      <header style={{
        position: 'relative',
        zIndex: 2,
        padding: '20px',
        display: 'flex',
        justifyContent: 'center', // Center the title
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flexDirection: 'column', // Stack elements vertically
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          color: 'orange',
          margin: '0 0 10px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          SUNNY AUTO ADMIN - INVENTORY
        </h1>
        <p style={{
          color: '#ccc',
          margin: 0,
          fontSize: '1.1rem'
        }}>
          Manage your inventory with ease
        </p>
      </header>

      {/* Main Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        padding: '40px 20px',
        minHeight: 'calc(100vh - 160px)'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <h2 style={{ 
              fontSize: '2.2rem', 
              fontWeight: 'bold',
              color: 'orange',
              margin: 0
            }}>
              INVENTORY MANAGEMENT
            </h2>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '8px 15px', 
                borderRadius: '8px',
                border: '1px solid orange'
              }}>
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'white', 
                    outline: 'none',
                    width: '200px'
                  }}
                />
                <span style={{ color: 'orange' }}>🔍</span>
              </div>
              
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ 
                  background: 'black', 
                  color: 'white', 
                  border: '1px solid orange', 
                  borderRadius: '8px',
                  padding: '8px 15px'
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
  gap: '25px',
  marginBottom: '50px'
}}>
  {filteredInventory.map(item => (
    <div 
      key={item.id}
      style={{
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid orange',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 165, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >      
      <div 
        style={{ 
          height: '180px', 
          overflow: 'hidden', 
          borderRadius: '8px', 
          marginBottom: '15px' 
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
        background: 'orange', 
        color: 'black', 
        padding: '4px 8px', 
        borderRadius: '4px', 
        fontSize: '12px', 
        marginBottom: '10px',
        fontWeight: 'bold'
      }}>
        {item.category}
      </div>
      <h3 style={{ color: 'orange', marginBottom: '10px', fontSize: '1.3rem' }}>{item.name}</h3>
      <p style={{ color: '#ccc', marginBottom: '15px', fontSize: '14px', minHeight: '40px' }}>{item.description}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
        <div>
          <span style={{ fontWeight: 'bold', color: item.quantity < 20 ? 'red' : 'orange' }}>
            Quantity: {item.quantity}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(item);
          }}
          style={{
            background: 'orange',
            color: 'black',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#e59400'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'orange'}
        >
          Edit
        </button>
      </div>
    </div>
  ))}
</div>

          {/* Show message if no items match filter */}
          {filteredInventory.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ color: 'orange' }}>No inventory items found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleBackToDashboard}
              style={{
                backgroundColor: 'transparent',
                color: 'orange',
                border: '2px solid orange',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'orange';
                e.currentTarget.style.color = 'black';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'orange';
              }}
            >
              ← Back to Dashboard
            </button>
            
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: 'orange',
                color: 'black',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e59400'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'orange'}
            >
              Logout
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: '30px',
            borderRadius: '15px',
            border: '2px solid orange',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h2 style={{ color: 'orange', marginBottom: '20px', textAlign: 'center' }}>Edit Inventory</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'orange', marginBottom: '5px' }}>Product Name</label>
              <input 
                type="text" 
                value={editingItem.name} 
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid orange',
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', color: 'orange', marginBottom: '5px' }}>Quantity</label>
              <input 
                type="number" 
                value={editQuantity} 
                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                min="0"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid orange',
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={closeEditModal}
                style={{
                  backgroundColor: 'transparent',
                  color: 'orange',
                  border: '2px solid orange',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'orange';
                  e.currentTarget.style.color = 'black';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'orange';
                }}
              >
                Cancel
              </button>
              
              <button 
                onClick={saveQuantity}
                style={{
                  backgroundColor: 'orange',
                  color: 'black',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e59400'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'orange'}
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