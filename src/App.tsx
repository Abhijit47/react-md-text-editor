import './App.css';
import CustomMDTextArea from './components/CustomMDTextArea';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header />
      <main>
        <section
          className={
            'max-w-3xl mx-auto min-h-screen flex items-center justify-center'
          }>
          <CustomMDTextArea />
        </section>
      </main>
    </>
  );
}

export default App;
