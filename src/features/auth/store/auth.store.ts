import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User } from '../model/user.interface';

interface AuthState {
  currentUser: User | null;
}

const initialState: AuthState = {
  currentUser: null,
};

export const authStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    isAuthenticated: () => !!state.currentUser(),
  })),
  withMethods((store) => {
    return {
      setUser(user: User | null) {
        patchState(store, { currentUser: user });
      },

      logout() {
        patchState(store, { currentUser: null });
      },
    };
  }),
);
