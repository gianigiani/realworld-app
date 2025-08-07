import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User } from '../model/user.interface';
import { TokenService } from '../service/token.service';

interface AuthState {
  currentUser: User | null;
}

const initialState: AuthState = {
  currentUser: null as User | null,
};

export const authStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    isAuthenticated: () => !!state.currentUser(),
  })),
  withMethods((store) => {
    const tokenService = inject(TokenService);

    return {
      setUser(user: User | null) {
        patchState(store, { currentUser: user });

        if (user) {
          tokenService.set(user.token);
        } else {
          tokenService.remove();
        }
      },

      logout() {
        patchState(store, { currentUser: null });
        tokenService.remove();
      },
    };
  }),
);
