import React, { useState } from 'react';
import styled from 'styled-components';
import BillList from './components/BillList';
import BillForm from './components/BillForm';
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  background-color: #0056b3;
  color: white;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
  margin-bottom: 15px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;

const NavButton = styled.button`
  background-color: transparent;
  border: 1px solid white;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  
  ${props => props.active && `
    background-color: white;
    color: #0056b3;
  `}
`;

const Main = styled.main`
  width: 100%;
`;

function App() {
  const [activeTab, setActiveTab] = useState('list');
  const userId = 12345; // Hardcoded user ID as per requirement

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Header>
          <Title>EciCredit Bill Management</Title>
          <Nav>
            <NavButton 
              active={activeTab === 'list'} 
              onClick={() => setActiveTab('list')}
            >
              View Bills
            </NavButton>
            <NavButton 
              active={activeTab === 'create'} 
              onClick={() => setActiveTab('create')}
            >
              Create Bill
            </NavButton>
          </Nav>
        </Header>
        <Main>
          {activeTab === 'list' ? (
            <BillList userId={userId} />
          ) : (
            <BillForm userId={userId} onSuccess={() => setActiveTab('list')} />
          )}
        </Main>
      </AppContainer>
    </>
  );
}

export default App;