import { FormControl } from '@angular/forms';

export interface SettingsForm {
  image: FormControl<string>;
  username: FormControl<string>;
  bio: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface UpdateUser {
  image: string;
  username: string;
  bio: string;
  email: string;
  token: string;
}
