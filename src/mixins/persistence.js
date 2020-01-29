import wepy from 'wepy';
import {storage} from '../utils';


export default class PersistenceMixin extends wepy.mixin {
  // 持久化

  // Set Local Storage
  setStorageSync = storage().setStorageSync;

  // Set Local Storage
  getStorageSync = storage().getStorageSync;
}
