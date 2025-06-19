import UserAvatar from "../components/UserAvatar";

const ProfilePage = ({ user, onBack }) => (
  <div className="px-4 py-3">
    <button className="mb-3 text-blue-600 font-medium" onClick={onBack}>
      &larr; Kembali
    </button>
    <div className="flex flex-col items-center mb-4">
      <UserAvatar src={user.avatar} name={user.name} />
      <div className="font-bold text-lg mt-2">{user.name}</div>
      <div className="text-xs text-gray-500">{user.email}</div>
    </div>
    <form className="bg-white rounded-lg shadow p-4">
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Nama</label>
        <input
          className="w-full border rounded px-2 py-1"
          defaultValue={user.name}
          disabled
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Email</label>
        <input
          className="w-full border rounded px-2 py-1"
          defaultValue={user.email}
          disabled
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">No. HP</label>
        <input
          className="w-full border rounded px-2 py-1"
          defaultValue={user.phone}
          disabled
        />
      </div>
      <button
        className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-700 transition mt-2 w-full"
        disabled
      >
        Edit Profil
      </button>
    </form>
  </div>
);

export default ProfilePage;
