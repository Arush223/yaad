import React from 'react';
const App: React.FC = () => {
  return (  
    <div className="app-container">
      <header className="app-header">
        <h1>Welcome to My App</h1>
        <nav>
          <ul>
            <li><a href="#intro">About</a></li>
            <li><a href="#features">Features</a></li>
          </ul>
        </nav>
      </header>
      <main className="app-main">
        <section id="intro" className="intro">
          <h2>About This App</h2>
          <p>This is a boilerplate for a React TypeScript application.</p>
        </section>
        <section id="features" className="features">
          <h2>Features</h2>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
        </section>
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;