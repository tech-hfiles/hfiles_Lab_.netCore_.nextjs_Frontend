import React from 'react'
import LabHeader from './LabHeader'
import Footer from './Footer'

interface HomeProps {
    children: React.ReactNode;
}

const PanelLayout: React.FC<HomeProps> = ({ children }) => {
    return (
        <div className="h-screen  overflow-hidden  flex flex-col">
            {/* Sticky Header */}
            <header className="sticky top-0 z-10">
                <LabHeader />
            </header>

            {/* Scrollable Main Content */}
            <main className="flex-grow overflow-y-auto custom-scrollbar">
                {children}
            </main>

            {/* Sticky Footer */}
            <footer className="sticky bottom-0 z-10">
                <Footer />
            </footer>
        </div>
    )
}
export default PanelLayout