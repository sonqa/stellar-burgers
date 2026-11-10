import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import type { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientsIds: string[]) => {
    const data = await orderBurgerApi(ingredientsIds);
    return data.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

type TOrderState = {
  orderRequest: boolean;
  orderError: string | null;
  orderData: TOrder | null;
  orderInfo: TOrder | null;
  orderNumber: number | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderError: null,
  orderData: null,
  orderInfo: null,
  orderNumber: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.orderError = null;
    },
    clearOrderInfo: (state) => {
      state.orderInfo = null;
      state.orderNumber = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message || 'Ошибка';
      })
      .addCase(fetchOrderByNumber.pending, (state, action) => {
        state.orderNumber = action.meta.arg;
        state.orderInfo = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderInfo = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderError = action.error.message || 'Ошибка';
      });
  },
});

export const { clearOrder, clearOrderInfo } = orderSlice.actions;
export default orderSlice.reducer;