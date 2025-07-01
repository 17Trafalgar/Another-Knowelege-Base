import { Transform } from 'class-transformer';
import { IsPhoneNumber, Matches } from 'class-validator';

export function IsNormalizedPhone() {
  const isPhone = IsPhoneNumber('RU');
  const matches = Matches(/^\+?7.+$/, {
    message: 'phone number must start with +7 or 7',
  });
  const transform = Transform((value) =>
    '+'.concat(value.value.replace(/\D/g, '')),
  );

  return function (target: any, key: string) {
    isPhone(target, key);
    matches(target, key);
    transform(target, key);
  };
}
