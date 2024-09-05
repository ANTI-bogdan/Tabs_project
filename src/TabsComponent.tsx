import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { DropdownMenu } from './DropdownMenu';
import TabType from './types';

const DraggableTab: React.FC<{ tab: TabType; index: number; onClick: (index: number) => void; onPinToggle: (tabId: string) => void; }> = ({ tab, index, onClick, onPinToggle }) => (
  <Draggable draggableId={tab.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="tab"
      >
        <button
          onClick={() => onClick(index)}
          onDoubleClick={() => onPinToggle(tab.id)}
        >
          {tab.title}
        </button>
      </div>
    )}
  </Draggable>
);

export const TabsComponent: React.FC = () => {
  const [tabs, setTabs] = useState<TabType[]>(() => {
    const savedTabs = localStorage.getItem('tabsState');
    return savedTabs && JSON.parse(savedTabs);
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('tabsState', JSON.stringify(tabs));
  }, [tabs]);

  const handleTabClick = (index: number) => {
    const selectedTab = tabs[index];
    navigate(selectedTab.url);
    setActiveIndex(index);
  };

  const togglePinTab = (tabId: string) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === tabId ? { ...tab, pinned: !tab.pinned } : tab
    );
    setTabs(updatedTabs);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedTabs = Array.from(tabs);
    const [removed] = reorderedTabs.splice(result.source.index, 1);
    reorderedTabs.splice(result.destination.index, 0, removed);
    setTabs(reorderedTabs);
  };

  const pinnedTabs = tabs.filter(tab => tab.pinned);
  const regularTabs = tabs.filter(tab => !tab.pinned);

  return (
    <div className="tabs-wrapper">
      <Tabs selectedIndex={activeIndex} onSelect={handleTabClick}>
        <div className="tabs-container">
          <TabList className="pinned-tabs">
            {pinnedTabs.map((tab, index) => (
              <Tab key={tab.id}>
                <button
                  onClick={() => handleTabClick(index)}
                  onDoubleClick={() => togglePinTab(tab.id)}
                >{
                    tab.title}
                </button>
              </Tab>
            ))}
          </TabList>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tabs" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="regular-tabs"
                >
                  {regularTabs.map((tab, index) => (
                    <DraggableTab
                      key={tab.id}
                      tab={tab}
                      index={index}
                      onClick={handleTabClick}
                      onPinToggle={togglePinTab}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>


      </Tabs>
    </div>
  );
};
