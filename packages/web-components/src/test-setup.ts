// Mock ElementInternals for JSDOM test environment
class MockElementInternals {
  setFormValue(): void {
    // Mock implementation for tests
  }
  
  setValidity(): void {
    // Mock implementation for tests
  }
  
  get validity(): ValidityState {
    return {
      badInput: false,
      customError: false,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valid: true,
      valueMissing: false,
    };
  }
  
  get willValidate(): boolean {
    return true;
  }
  
  get validationMessage(): string {
    return '';
  }
  
  get form(): HTMLFormElement | null {
    return null;
  }
  
  get labels(): NodeList {
    return [] as unknown as NodeList;
  }
}

// Mock HTMLDialogElement showModal method for JSDOM
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function() {
    this.open = true;
  };
}

Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
  value: function() {
    return new MockElementInternals();
  },
});
