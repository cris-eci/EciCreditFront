import React from 'react';
import styled from 'styled-components';

const DetailsContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const BackButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: bold;
  margin: 10px 0;
  
  ${props => props.status === 'APPROVED' && `
    background-color: #c8e6c9;
    color: #2e7d32;
  `}
  
  ${props => props.status === 'DECLINED' && `
    background-color: #ffcdd2;
    color: #c62828;
  `}
`;

const Message = styled.div`
  padding: 10px;
  margin: 10px 0;
  background-color: #f9f9f9;
  border-left: 4px solid #0056b3;
`;

const BillInfo = styled.div`
  margin: 20px 0;
  
  div {
    margin-bottom: 8px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  background-color: #f2f2f2;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TableFooter = styled.td`
  padding: 12px 15px;
  font-weight: bold;
`;

function BillDetails({ bill, onBack }) {
  return (
    <DetailsContainer>
      <BackButton onClick={onBack}>← Back to List</BackButton>
      
      <h2>Bill Details</h2>
      <StatusBadge status={bill.status}>
        {bill.status}
      </StatusBadge>
      
      {bill.responseMessage && (
        <Message>{bill.responseMessage}</Message>
      )}
      
      <BillInfo>
        <div><strong>Transaction ID:</strong> {bill.id}</div>
        <div><strong>Date:</strong> {new Date(bill.purchaseDate).toLocaleDateString()}</div>
        <div><strong>User ID:</strong> {bill.userId}</div>
        <div><strong>Total Amount:</strong> ${bill.totalAmount.toFixed(2)}</div>
      </BillInfo>
      
      <h3>Items</h3>
      <Table>
        <thead>
          <tr>
            <TableHeader>Product</TableHeader>
            <TableHeader>Unit Price</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Subtotal</TableHeader>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, index) => (
            <tr key={index}>
              <TableCell>{item.productName}</TableCell>
              <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${(item.unitPrice * item.quantity).toFixed(2)}</TableCell>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <TableFooter colSpan="3" style={{textAlign: 'right'}}><strong>Total:</strong></TableFooter>
            <TableFooter>${bill.totalAmount.toFixed(2)}</TableFooter>
          </tr>
        </tfoot>
      </Table>
    </DetailsContainer>
  );
}

export default BillDetails;