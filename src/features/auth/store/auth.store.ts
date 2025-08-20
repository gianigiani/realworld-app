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
  isLoadingUser: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isLoadingUser: false,
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
      setIsLoadingUser(isLoading: boolean) {
        patchState(store, { isLoadingUser: isLoading });
      },
      logout() {
        patchState(store, { currentUser: null });
      },
    };
  }),
);
