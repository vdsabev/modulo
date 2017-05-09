import { Model } from 'compote/components/model';
import { User as FirebaseUser } from 'firebase/app';

export class User extends Model<User> {
  role?: 'admin' | 'writer';
  auth?: FirebaseUser;

  isLoggedIn?(): boolean {
    return this.auth != null;
  }

  canAdmin?(): boolean {
    return this.isLoggedIn() && this.role === 'admin';
  }

  canWrite?(): boolean {
    return this.isLoggedIn() && (this.role === 'writer' || this.role === 'admin');
  }
}
