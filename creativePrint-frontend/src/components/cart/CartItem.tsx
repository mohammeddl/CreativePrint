import { useDispatch } from "react-redux"
import { updateQuantity, removeFromCart } from "../../store/slices/cartSlice"
import type { CartItem as CartItemType } from "../../types/cart"
import { Trash2, Plus, Minus } from "lucide-react"

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useDispatch()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.product.stock) {
      dispatch(updateQuantity({ productId: item.product.id, quantity: newQuantity }))
    }
  }

  const handleRemove = () => {
    dispatch(removeFromCart(item.product.id))
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img
        src={item.product.image || "../../../public/assets/images/default-avatar.png"}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
        <p className="text-sm text-gray-500">${item.product.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => handleQuantityChange(item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-100">
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button onClick={() => handleQuantityChange(item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-100">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={handleRemove} className="p-2 text-red-500 hover:bg-red-50 rounded-full ml-2">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

