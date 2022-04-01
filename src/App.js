import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>This is a Simple Dapp</h1>
      </header>

      <main className="App-body">
        <p> Here we can set or get the mood:</p>
        <label for="mood">Input Mood:</label><br />
        <input type="text" id='mood' />
        <button onclick="getMood()">Get Mood</button>
        <button onclick="setMood()">Set Mood</button>
      </main>
    </div>
  );
}

export default App;
