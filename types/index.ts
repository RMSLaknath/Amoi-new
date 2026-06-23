export interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string[]
  category: string
  subcategory: string
  sizes: string[]
  bestseller: boolean
  date: number
}

export interface CartItem {
  productId: string
  size: string
  quantity: number
  name: string
  price: number
  image: string
}

export interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  size: string
  image: string
}

export interface Order {
  _id: string
  userId: string
  items: OrderItem[]
  amount: number
  address: Address
  status: string
  paymentMethod: 'COD' | 'PayHere'
  payment: boolean
  date: number
}

export interface Review {
  _id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: Date
}

export type SortOption = 'relevant' | 'low-high' | 'high-low' | 'newest'

export type Currency = 'LKR' | 'USD' | 'EUR' | 'GBP' | 'AUD'
