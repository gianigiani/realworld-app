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
  isSignedIn: boolean | null;
}

const initialState: AuthState = {
  currentUser: null,
  isSignedIn: null,
};

export const authStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    isAuthenticated: () => !!state.currentUser(),
  })),
  withMethods((store) => {
    return {
      signIn(user: User) {
        patchState(store, { isSignedIn: true, currentUser: user });
      },
      logout() {
        patchState(store, { isSignedIn: false, currentUser: null });
      },
    };
  }),
);
