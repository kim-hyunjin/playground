interface Validator {
  validate(value: any): boolean | [boolean, any];
}

class EmailValidator implements Validator {
  #expText = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  validate(email: string): [true, null] | [false, string] {
    if (this.#expText.test(email)) {
      return [true, null];
    }
    return [false, 'Enter a valid email address'];
  }
}

const emailValidator = new EmailValidator();

export { emailValidator };
