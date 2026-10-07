import { SafeUrl } from '@angular/platform-browser';

export default interface Photo {
  tempId: string;
  file?: File;
  url: SafeUrl;
  isCover: boolean;
  toRemove: boolean;
}
