import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col h-screen bg-white text-black-00000">
            <main className="flex-grow overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
