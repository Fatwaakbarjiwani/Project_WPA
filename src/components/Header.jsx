import UserAvatar from './UserAvatar'

const Header = ({ title }) => (
  <header className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white shadow">
    <h1 className="text-lg font-bold tracking-wide">{title}</h1>
    <UserAvatar />
  </header>
)

export default Header 