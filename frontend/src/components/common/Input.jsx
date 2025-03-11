const Input = ({ type, label, value, onChange, required }) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium mb-1 text-gray-400">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };
  
  export default Input;