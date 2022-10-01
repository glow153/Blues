import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const debug = true;

const getRequiredPermissions = () => {
  const permissions = [];
  debug && console.log('android api level:', Platform.Version);
  if (Platform.Version <= 28) {
    permissions.push(
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
      );
  }
  /*
  else if (Platform.Version <= 30) {
    permissions.push(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );
  }
  */
  if (Platform.Version >= 31) {
    permissions.push(
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT
    );
  }
  return permissions;
};

async function _request(permission) {
  const c = await check(permission);
  debug && console.log('check permission:', permission, '=>', c);
  if (c === RESULTS.GRANTED) {
    return c;
  } else {
    debug && console.log('request permission:', permission);
    return await request(permission);
  }
}

export async function requestPermissions() {
  const ps = getRequiredPermissions();
  debug && console.log('required permissions:', ps);
  for (const p of ps) {
    let res;
    try {
      res = await _request(p);
    } catch (e) {
      console.error(`권한획득에 실패했습니다 : result=${res}, permission=${p}, error=${e}`);
    }
    if (res !== RESULTS.GRANTED) {
      throw new Error(`권한획득에 실패했습니다 : result=${res}, permission=${p}`);
    }
  }
  return true;
}
