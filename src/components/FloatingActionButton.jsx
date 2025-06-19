const FloatingActionButton = ({ icon, onClick, label }) => (
  <button
    className="fixed bottom-20 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition"
    onClick={onClick}
    aria-label={label}
  >
    {icon}
  </button>
)

export default FloatingActionButton 