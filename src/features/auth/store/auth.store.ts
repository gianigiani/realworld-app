import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User } from '../model/user.interface';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null as User | null,
};

export const authStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    isAuthenticated: () => !!state.currentUser(),
  })),
  withMethods((store) => ({
    setUser(user: User | null) {
      patchState(store, {
        currentUser: user,
        isAuthenticated: !!user,
      });
      if (user) {
        localStorage.setItem('token', user.token);
      } else {
        localStorage.removeItem('token');
      }
    },

    logout() {
      patchState(store, {
        currentUser: null,
        isAuthenticated: false,
      });
    },
  })),
);
