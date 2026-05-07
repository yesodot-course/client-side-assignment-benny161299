export interface ISupplierItem {
  itemName: string;
  supplierPrice: number;
}

export interface ISupplier {
  _id: string;
  name: string;
  items: ISupplierItem[];
  createdAt: string;
  updatedAt: string;
}


export interface IItemSupplierRef {
  _id: string;
  name: string;
}

export interface IItem {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  supplier: IItemSupplierRef; 
  image?: string | null;      
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface IOrderItem {
  itemId: string | { _id: string; name: string; price: number; image?: string | null };
  quantity: number;
}

export interface IOrder {
  _id: string;
  items: IOrderItem[];
  address: string;
  orderDate: string;
  shopProfit: number;
  createdAt: string;
  updatedAt: string;
}


export interface ICartItem {
  item: IItem;
  quantity: number;
}


export interface IMonthlyRevenue {
  revenue: number;
}

export interface IWeeklyTopCategory {
  category: string;
  profit: number;
}

export interface IDailyTopItem {
  itemId: string;
  name: string;
  profit: number;
}

export interface IProfitMargins {
  highest: { itemId: string; name: string; margin: number };
  lowest: { itemId: string; name: string; margin: number };
}

export interface ITopSupplier {
  supplierId: string;
  name: string;
  profit: number;
}

export interface ISupplierSpend {
  supplierId: string;
  name: string;
  totalSpent: number;
}


export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
}
