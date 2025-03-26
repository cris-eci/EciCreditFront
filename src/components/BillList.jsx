import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getBillsByUserId } from '../services/billService';
import BillDetails from './BillDetails';

const BillListContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LoadingMessage = styled.div`
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
  background-color: #e3f2fd;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
  background-color: #ffebee;
  color: #c62828;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
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

const TableRow = styled.tr`
  ${props => props.status === 'APPROVED' && `
    background-color: #e8f5e9;
  `}
  
  ${props => props.status === 'DECLINED' && `
    background-color: #ffebee;
  `}
`;

const ActionButton = styled.button`
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
`;

function BillList({ userId }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getBillsByUserId(userId);
        setBills(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [userId]);

  if (loading) return <LoadingMessage>Loading bills...</LoadingMessage>;
  if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;
  if (bills.length === 0) return <EmptyMessage>No bills found for this user.</EmptyMessage>;

  if (selectedBill) {
    return <BillDetails bill={selectedBill} onBack={() => setSelectedBill(null)} />;
  }

  return (
    <BillListContainer>
      <h2>Bills for User {userId}</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Total Amount</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <TableRow key={bill.id} status={bill.status}>
              <TableCell>{bill.id}</TableCell>
              <TableCell>{new Date(bill.purchaseDate).toLocaleDateString()}</TableCell>
              <TableCell>${bill.totalAmount.toFixed(2)}</TableCell>
              <TableCell>{bill.status}</TableCell>
              <TableCell>
                <ActionButton onClick={() => setSelectedBill(bill)}>
                  View Details
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </BillListContainer>
  );
}

export default BillList;