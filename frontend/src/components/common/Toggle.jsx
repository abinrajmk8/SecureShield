const Toggle = ({ isOn, handleToggle }) => {
    return (
      <button
        onClick={handleToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
          isOn ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    );
  };
  
  export default Toggle;