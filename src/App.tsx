import React  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TabsComponent } from './TabsComponent';
import './style.css'

const TabContent: React.FC<{ tabName: string }> = ({ tabName }) => {
  return <div>{tabName} Content</div>;
};

export  const App: React.FC = () => {
  return (
    <Router>
      <TabsComponent />
      <Routes>
        <Route path="/tab1" element={<TabContent tabName="Tab 1" />} />
        <Route path="/tab2" element={<TabContent tabName="Tab 2" />} />
        <Route path="/tab3" element={<TabContent tabName="Tab 3" />} />
        <Route path="/tab4" element={<TabContent tabName="Tab 4" />} />
        <Route path="/tab5" element={<TabContent tabName="Tab 5" />} />
      </Routes>
    </Router>
  );
};
