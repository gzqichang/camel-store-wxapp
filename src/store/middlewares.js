import {PERMISSION_SCOPE as scope} from './properties';
import {types as systemTypes} from './system';
import {go2page} from '../utils';


const redirect = (permission) => {
  return go2page()
    .navigate('/pages/util/permissions?permission=' + permission);
};


export const createPermissionControlMiddleware = () => ({getState}) => (next) => (action) => {
  const {user, system} = getState();

  const requiredPermissions = action.permissions || [];
  const currentPermissions = system.permissions || [];

  if (
    requiredPermissions.length
    && action.type !== systemTypes.SET_PERMISSIONS
  ) {
    const missingPermissions = requiredPermissions
      .filter((item) => (!currentPermissions.includes(item)));

    const permStr = JSON.stringify(missingPermissions.join(','));

    if (missingPermissions.length)
      return redirect(permStr);

    if (
      requiredPermissions.includes(scope.userInfo)
      && !user.wx_app_openid
    ) {
      return redirect(permStr);
    }
  }

  return next(action);
};
