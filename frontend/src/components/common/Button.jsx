const Button = ({ onClick, children, className }) => {
    return (
      <button
        onClick={onClick}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  