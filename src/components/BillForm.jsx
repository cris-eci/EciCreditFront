import React, { useState } from 'react';
import styled from 'styled-components';
import { createBill } from '../services/billService';

const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ItemsSection = styled.div`
  margin-bottom: 20px;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 10px;
  margin-bottom: 15px;
  align-items: end;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TotalSection = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  text-align: right;
`;

const AddButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const RemoveButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResponseMessage = styled.div`
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  
  ${props => props.status === 'APPROVED' && `
    background-color: #c8e6c9;
    color: #2e7d32;
  `}
  
  ${props => props.status === 'DECLINED' && `
    background-color: #ffcdd2;
    color: #c62828;
  `}
`;

const ErrorMessage = styled.div`
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: #ffcdd2;
  color: #c62828;
`;

function BillForm({ userId, onSuccess }) {
  const [items, setItems] = useState([{ productName: '', unitPrice: '', quantity: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // Calculate total based on current items
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.unitPrice) || 0;
      const qty = parseInt(item.quantity) || 0;
      return total + (price * qty);
    }, 0);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { productName: '', unitPrice: '', quantity: '' }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Prepare the bill data
      const billData = {
        userId,
        items: items.map(item => ({
          productName: item.productName,
          unitPrice: parseFloat(item.unitPrice),
          quantity: parseInt(item.quantity)
        })),
        totalAmount: calculateTotal()
      };

      const response = await createBill(billData);
      setResponse(response);
      
      if (response.status === 'APPROVED') {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Create New Bill</h2>
      
      {response && (
        <ResponseMessage status={response.status}>
          <strong>Status: {response.status}</strong>
          <p>{response.responseMessage}</p>
        </ResponseMessage>
      )}
      
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
      
      <form onSubmit={handleSubmit}>
        <ItemsSection>
          <h3>Items</h3>
          {items.map((item, index) => (
            <ItemRow key={index}>
              <FormGroup>
                <Label>Product Name</Label>
                <Input
                  type="text"
                  value={item.productName}
                  onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                />
              </FormGroup>
              
              <RemoveButton 
                type="button" 
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
              >
                Remove
              </RemoveButton>
            </ItemRow>
          ))}
          
          <AddButton type="button" onClick={addItem}>
            Add Item
          </AddButton>
        </ItemsSection>
        
        <TotalSection>
          <h3>Total Amount: ${calculateTotal().toFixed(2)}</h3>
        </TotalSection>
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Bill'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
}

export default BillForm;