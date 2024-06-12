import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyValuePair } from '@react-native-async-storage/async-storage/lib/typescript/types';

interface rawListItem {
  label: string
  responses: string[]
}
export interface ListItem {
  label: string
  responses: string[]
  id: string
  checked: boolean
}
interface ResponseItem {
  id: string
  label: string
  count: number
}
interface SliceState {
  listItems: ListItem[]
  responseItems: ResponseItem[]
}

export const addItem = createAsyncThunk('app/addItem', async (item: rawListItem) => {
  const id = uuid.v4();
  let stringId: string;
  if (!(typeof id === 'string' || id instanceof String)) {
    stringId = id.join().toString();
  } else {
    stringId = id as string;
  }
  try {
    const jsonValue = JSON.stringify({ ...item, id: stringId });
    await AsyncStorage.setItem(stringId, jsonValue);
    return { ...item, checked: false, id: stringId };
  } catch {
    console.log('error saving');
  }
});

export const deleteItem = createAsyncThunk('app/deleteItem', async (id: string) => {
  try {
    await AsyncStorage.removeItem(id);
    return id;
  } catch {
    console.log('error deleting item');
  }
});

export const editItem = createAsyncThunk('app/editItem', async (item: ListItem) => {
  try {
    const jsonValue = JSON.stringify(item);
    await AsyncStorage.setItem(item.id, jsonValue);
    return item;
  } catch {
    console.log('error saving over');
  }
});

export const loadStore = createAsyncThunk('app/loadStore', async () => {
  let keys: readonly string[] = [];
  let values: readonly KeyValuePair[] = [];
  try {
    keys = await AsyncStorage.getAllKeys();
    if (keys.length) {
      values = await AsyncStorage.multiGet(keys);
    }
    const retVal: ListItem[] = [];
    values.forEach((pair) => {
      if (pair[1]) retVal.push({ ...JSON.parse(pair[1]), checked: false });
    });
    return retVal;
  } catch {
    console.log('error fetching store');
  }
});

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    // listItems: [
    //   { id: '1', label: 'Head hurts', checked: false , responses: ['1'] },
    //   { id: '2', label: 'Stomach hurts', checked: false , responses: [] },
    //   { id: '3', label: 'Eyes hurt', checked: false , responses: ['1'] },
    //   { id: '4', label: 'Body tense', checked: false , responses: [] },
    //   { id: '5', label: 'Sore from sitting', checked: false , responses: [] },
    //   { id: '6', label: 'Vibrating', checked: false , responses: [] },
    // ],
    listItems: [],
    responseItems: [
      { id: '1', label: 'Put on headphones', count: 0 },
    ],
  } satisfies SliceState as SliceState,
  reducers: {
    clickItem: (state, action) => {
      const item = state.listItems.find((item) => item.id === action.payload);
      if (item) {
        item.responses.forEach((response) => {
          const responseMatch = state.responseItems.find((checkResponse) => checkResponse.id == response);
          if (responseMatch) {
            responseMatch.count += item.checked ? -1 : 1;
          }
        });
        item.checked = !item.checked;
      }
    },
    clearChecked: (state) => {
      state.listItems.forEach((item) => {
        item.checked = false;
      });
      state.responseItems.forEach((item) => {
        item.count = 0;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addItem.fulfilled, (state, action) => {
      if (action.payload) {
        const temp = state.listItems;
        temp.push({ ...action.payload, checked: false });
        state.listItems = temp;
      }
    }).addCase(loadStore.fulfilled, (state, action) => {
      if (action.payload) {
        state.listItems = action.payload;
      }
    }).addCase(deleteItem.fulfilled, (state, action) => {
      if (action.payload) {
        state.listItems = state.listItems.filter((item) => item.id !== action.payload);
      }
    }).addCase(editItem.fulfilled, (state, action) => {
      if (action.payload) {
        const temp = state.listItems;
        temp.map((item) => {
          if (item.id === action.payload?.id) {
            return action.payload;
          }
          return item;
        });
        state.listItems = temp;
        console.log(temp);
      }
    });
  },
});

export const { clickItem, clearChecked } = appSlice.actions;

export default appSlice.reducer;
