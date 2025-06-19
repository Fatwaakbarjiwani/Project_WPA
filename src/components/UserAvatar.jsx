const UserAvatar = ({ src, name = "User" }) =>
  src ? (
    <img
      src={src}
      alt={name}
      className="w-9 h-9 rounded-full border-2 border-white shadow"
    />
  ) : (
    <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow">
      {name[0]}
    </div>
  );

export default UserAvatar;
