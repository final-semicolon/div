const ReverseExclamation = ({ stroke = '#F66161' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8ZM8 15.0455C11.8911 15.0455 15.0455 11.8911 15.0455 8C15.0455 4.1089 11.8911 0.954545 8 0.954545C4.1089 0.954545 0.954545 4.1089 0.954545 8C0.954545 11.8911 4.1089 15.0455 8 15.0455Z"
        stroke={stroke}
      />
      <path
        d="M8.68783 4.57243C8.68783 4.95114 8.38083 5.25815 8.00212 5.25815C7.62341 5.25815 7.31641 4.95114 7.31641 4.57243C7.31641 4.19372 7.62341 3.88672 8.00212 3.88672C8.38083 3.88672 8.68783 4.19372 8.68783 4.57243Z"
        fill={stroke}
      />
      <path d="M7.81641 11.4994V6.78516H8.18783V11.4994H7.81641Z" stroke={stroke} />
    </svg>
  );
};

export default ReverseExclamation;
