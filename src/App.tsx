import CustomDropdown from "./CustomDropdown";
import "./App.css";

function App() {
  const handleSelectionChange = (selectedValue: string) => {
    console.log("Selected:", selectedValue);
  };

  return (
    <div>
      <h1>Custom Dropdown Example</h1>
      <CustomDropdown onChange={handleSelectionChange} />
    </div>
  );
}

export default App;
