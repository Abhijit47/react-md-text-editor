import './App.css';
import CustomMDTextArea from './components/CustomMDTextArea';

function App() {
  return (
    <main>
      <section
        className={
          'max-w-3xl mx-auto min-h-screen flex items-center justify-center'
        }>
        <CustomMDTextArea />
      </section>
    </main>
  );
}

export default App;
