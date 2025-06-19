import ProductCard from "../components/ProductCard";
import UserAvatar from "../components/UserAvatar";

const HomePage = ({ products, onProductClick, user }) => (
  <div className="px-4 py-3">
    <div className="flex items-center gap-3 mb-4">
      <UserAvatar src={user.avatar} name={user.name} />
      <div>
        <div className="font-semibold text-lg">Hi, {user.name}</div>
        <div className="text-xs text-gray-500">
          Selamat datang di E-Commerce NFC!
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onClick={() => onProductClick(p)} />
      ))}
    </div>
  </div>
);

export default HomePage;
