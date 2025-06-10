import React from 'react';

interface Props {
  activeTab: 'today' | 'week' | 'all';
  setActiveTab: (tab: 'today' | 'week' | 'all') => void;
}

const LabHistoryTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-around mb-2">
      {['today', 'week', 'all'].map((tab) => (
        <div
          key={tab}
          className={`pb-2 cursor-pointer font-semibold capitalize ${
            activeTab === tab
              ? 'text-blue-700 border-b-2 border-black'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab(tab as 'today' | 'week' | 'all')}
        >
          {tab === 'today' && 'Today'}
          {tab === 'week' && 'This Week'}
          {tab === 'all' && 'All'}
        </div>
      ))}
    </div>
  );
};

export default LabHistoryTabs;
