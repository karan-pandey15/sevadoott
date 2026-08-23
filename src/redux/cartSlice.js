
import { createSlice } from "@reduxjs/toolkit";

const isClient = "undefined";

const loadFromLocalStorage = () => {
  if (!isClient) return { items: [], totalAmount: 0 };
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) return { items: [], totalAmount: 0 };
    return JSON.parse(serializedState);
  } catch (e) {
    return { items: [], totalAmount: 0 };
  }
};

const saveToLocalStorage = (state) => {
  if (!isClient) return;
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cart", serializedState);
  } catch (e) {
    // ignore
  }
};

const initialState = {
  items: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrate: (state, action) => {
      return action.payload;
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
          totalPrice: newItem.totalPrice || newItem.price,
        });
        state.totalAmount = Number(state.totalAmount) + Number(newItem.totalPrice || newItem.price);
      } else {
        const qtyToAdd = newItem.quantity || 1;
        const priceToAdd = newItem.totalPrice || newItem.price;
        existingItem.quantity += qtyToAdd;
        existingItem.totalPrice = Number(existingItem.totalPrice) + Number(priceToAdd);
        state.totalAmount = Number(state.totalAmount) + Number(priceToAdd);
      }
      saveToLocalStorage(state);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      if (existingItem) {
        state.totalAmount = Number(state.totalAmount) - Number(existingItem.price);
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice = Number(existingItem.totalPrice) - Number(existingItem.price);
        }
      }
      saveToLocalStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      saveToLocalStorage(state);
    },
  },
});

export const { hydrate, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export { loadFromLocalStorage };
export default cartSlice.reducer;

 