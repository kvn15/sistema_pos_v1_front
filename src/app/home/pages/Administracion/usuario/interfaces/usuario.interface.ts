export interface Usuarios {
  id:         number;
  name:       string;
  user:       string;
  email:      string;
  role_id:    number;
  role_name:  string;
  file_foto:  string;
  state:      number;
  state_name: string;
  permissions: string;
}


export interface RetornoData<T> {
  success?: boolean;
  message: string;
  data: T;
}
