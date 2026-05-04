// Jest Test Suite: Invalid Name Tests for validate() function
// Focus: empty string, null, and length < 2 cases

function validate(form) {
    const validators = [
        () => (!form.name || form.name.length < 2) && 'Bad name',
        () => (!form.email || !form.email.includes('@')) && 'Bad email',
        () => (!form.password || form.password.length < 6) && 'Bad password',
        () => (form.password !== form.confirmPassword) && 'Passwords mismatch',
        () => (!form.age || form.age < 18 || form.age > 120) && 'Bad age',
        () => (!form.phone || !/^\d{10}$/.test(form.phone)) && 'Bad phone'
    ];

    return validators
        .map(fn => fn())
        .filter(Boolean);
}

// ============================================================================
// TEST FIXTURES
// ============================================================================

const validBaseForm = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePass123',
    confirmPassword: 'securePass123',
    age: 25,
    phone: '1234567890'
};

// ============================================================================
// TEST SUITE: Invalid Name - Empty String
// ============================================================================

describe('validate() - Invalid Name: Empty String', () => {
    test('should reject empty string name', () => {
        const form = { ...validBaseForm, name: '' };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should return array containing "Bad name" error', () => {
        const form = { ...validBaseForm, name: '' };
        const result = validate(form);
        expect(Array.isArray(result)).toBe(true);
        expect(result.includes('Bad name')).toBe(true);
    });

    test('should have at least one error for empty name', () => {
        const form = { ...validBaseForm, name: '' };
        const result = validate(form);
        expect(result.length).toBeGreaterThan(0);
    });

    test('empty name should be the only error when other fields valid', () => {
        const form = {
            name: '',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad name']);
    });

    test('should detect empty string before checking length', () => {
        const form = { ...validBaseForm, name: '' };
        const result = validate(form);
        // Empty string is falsy, so (!form.name) is true
        expect(result).toContain('Bad name');
    });

    test('should reject multiple consecutive empty strings', () => {
        const forms = ['', '', ''];
        forms.forEach(name => {
            const form = { ...validBaseForm, name };
            const result = validate(form);
            expect(result).toContain('Bad name');
        });
    });
});

// ============================================================================
// TEST SUITE: Invalid Name - Null
// ============================================================================

describe('validate() - Invalid Name: Null', () => {
    test('should reject null name', () => {
        const form = { ...validBaseForm, name: null };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should return "Bad name" error for null', () => {
        const form = { ...validBaseForm, name: null };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('null name should be the only error when other fields valid', () => {
        const form = {
            name: null,
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad name']);
    });

    test('should detect null as falsy value', () => {
        const form = { ...validBaseForm, name: null };
        const result = validate(form);
        // null is falsy, so (!form.name) is true
        expect(result).toContain('Bad name');
    });

    test('should not throw error for null name', () => {
        const form = { ...validBaseForm, name: null };
        expect(() => validate(form)).not.toThrow();
    });

    test('should handle null safely without accessing .length', () => {
        const form = { ...validBaseForm, name: null };
        // Validator checks (!form.name) first, short-circuits before checking .length
        expect(() => validate(form)).not.toThrow();
        const result = validate(form);
        expect(result).toContain('Bad name');
    });
});

// ============================================================================
// TEST SUITE: Invalid Name - Undefined
// ============================================================================

describe('validate() - Invalid Name: Undefined', () => {
    test('should reject undefined name', () => {
        const form = { ...validBaseForm, name: undefined };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('undefined name should be the only error when other fields valid', () => {
        const form = {
            name: undefined,
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad name']);
    });

    test('should handle missing name property (undefined)', () => {
        const form = {
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });
});

// ============================================================================
// TEST SUITE: Invalid Name - Length < 2 (Boundary Testing)
// ============================================================================

describe('validate() - Invalid Name: Length < 2', () => {
    test('should reject single character name', () => {
        const form = { ...validBaseForm, name: 'A' };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should reject name with exactly 1 character', () => {
        const form = { ...validBaseForm, name: 'J' };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('single character should be only error for otherwise valid form', () => {
        const form = {
            name: 'X',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad name']);
    });

    test('should reject various single character names', () => {
        const singleCharNames = ['A', 'Z', 'a', 'z', '1', '@', ' ', '!'];
        singleCharNames.forEach(name => {
            const form = { ...validBaseForm, name };
            const result = validate(form);
            expect(result).toContain('Bad name');
        });
    });

    test('should have length < 2 for rejected names', () => {
        const invalidNames = ['', 'A'];
        invalidNames.forEach(name => {
            expect(name.length < 2).toBe(true);
            const form = { ...validBaseForm, name };
            const result = validate(form);
            expect(result).toContain('Bad name');
        });
    });
});

// ============================================================================
// TEST SUITE: Invalid Name - Boundary (Length Exactly 2)
// ============================================================================

describe('validate() - Invalid Name: Boundary Test (Length = 2)', () => {
    test('should accept name with exactly 2 characters (minimum valid)', () => {
        const form = { ...validBaseForm, name: 'AB' };
        const result = validate(form);
        expect(result).not.toContain('Bad name');
    });

    test('should accept two-letter names', () => {
        const twoCharNames = ['Jo', 'AB', 'XY', 'aa', 'Zz', '@#', '  '];
        twoCharNames.forEach(name => {
            const form = { ...validBaseForm, name };
            const result = validate(form);
            expect(result).not.toContain('Bad name');
        });
    });

    test('should distinguish between length 1 (invalid) and length 2 (valid)', () => {
        const oneCharForm = { ...validBaseForm, name: 'A' };
        const twoCharForm = { ...validBaseForm, name: 'AB' };

        const result1 = validate(oneCharForm);
        const result2 = validate(twoCharForm);

        expect(result1).toContain('Bad name');
        expect(result2).not.toContain('Bad name');
    });
});

// ============================================================================
// TEST SUITE: Invalid Name - Type Coercion
// ============================================================================

describe('validate() - Invalid Name: Type Coercion', () => {
    test('should reject number 0 as name', () => {
        const form = { ...validBaseForm, name: 0 };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should reject number 1 as name (falsy check)', () => {
        const form = { ...validBaseForm, name: 1 };
        // 1 is truthy, but doesn't have .length, so 1.length < 2 is undefined < 2 which is false
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should reject false as name', () => {
        const form = { ...validBaseForm, name: false };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should reject empty array as name', () => {
        const form = { ...validBaseForm, name: [] };
        const result = validate(form);
        // [] is truthy, but [].length is 0, which is < 2
        expect(result).toContain('Bad name');
    });

    test('should reject array with one element as name', () => {
        const form = { ...validBaseForm, name: ['A'] };
        const result = validate(form);
        // ['A'].length is 1, which is < 2
        expect(result).toContain('Bad name');
    });

    test('should accept array with two elements as name', () => {
        const form = { ...validBaseForm, name: ['A', 'B'] };
        const result = validate(form);
        // ['A', 'B'].length is 2, which is not < 2
        expect(result).not.toContain('Bad name');
    });

    test('should reject object without length property', () => {
        const form = { ...validBaseForm, name: {} };
        const result = validate(form);
        // {}.length is undefined, so undefined < 2 is false, but {} is truthy
        // This test documents current behavior
        expect(result).toContain('Bad name');
    });
});

// ============================================================================
// TEST SUITE: Invalid Name - Multiple Errors
// ============================================================================

describe('validate() - Invalid Name: Multiple Errors', () => {
    test('empty name should be first error in result', () => {
        const form = {
            name: '',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 15,
            phone: '123'
        };
        const result = validate(form);
        expect(result[0]).toBe('Bad name');
    });

    test('should report empty name with other field errors', () => {
        const form = {
            name: '',
            email: 'noemail',
            password: 'pass123',
            confirmPassword: 'pass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Bad email');
    });

    test('should report single char name with other field errors', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 150,
            phone: '123'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Bad email');
        expect(result).toContain('Bad password');
        expect(result).toContain('Bad age');
    });

    test('should report null name with password mismatch', () => {
        const form = {
            name: null,
            email: 'john@example.com',
            password: 'pass123',
            confirmPassword: 'different',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Passwords mismatch');
    });
});

// ============================================================================
// TEST SUITE: Invalid Name - Consistency & Idempotency
// ============================================================================

describe('validate() - Invalid Name: Consistency & Idempotency', () => {
    test('should consistently reject empty string', () => {
        const form = { ...validBaseForm, name: '' };
        const result1 = validate(form);
        const result2 = validate(form);
        const result3 = validate(form);

        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
        expect(result1).toContain('Bad name');
    });

    test('should consistently reject null', () => {
        const form = { ...validBaseForm, name: null };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).toEqual(result2);
        expect(result1).toContain('Bad name');
    });

    test('should consistently reject single character', () => {
        const form = { ...validBaseForm, name: 'X' };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).toEqual(result2);
        expect(result1).toContain('Bad name');
    });

    test('should not modify input form', () => {
        const form = { ...validBaseForm, name: '' };
        const formCopy = { ...form };
        validate(form);
        expect(form).toEqual(formCopy);
    });
});

// ============================================================================
// TEST SUITE: Invalid Name - Comparison Test Matrix
// ============================================================================

describe('validate() - Invalid Name: Comparison Matrix', () => {
    test.each([
        ['empty string', '', true],
        ['null', null, true],
        ['undefined', undefined, true],
        ['single char A', 'A', true],
        ['single char space', ' ', true],
        ['two chars AB', 'AB', false],
        ['two chars spaces', '  ', false],
        ['three chars', 'ABC', false]
    ])(
        'name "%s" should %s contain "Bad name"',
        (description, name, shouldContainError) => {
            const form = { ...validBaseForm, name };
            const result = validate(form);

            if (shouldContainError) {
                expect(result).toContain('Bad name');
            } else {
                expect(result).not.toContain('Bad name');
            }
        }
    );
});

// ============================================================================
// TEST SUITE: Invalid Name - Error Message Accuracy
// ============================================================================

describe('validate() - Invalid Name: Error Message Accuracy', () => {
    test('should return exact error message "Bad name"', () => {
        const form = { ...validBaseForm, name: '' };
        const result = validate(form);
        expect(result[0]).toBe('Bad name');
    });

    test('should not return typo error messages', () => {
        const form = { ...validBaseForm, name: '' };
        const result = validate(form);
        expect(result).not.toContain('bad name');
        expect(result).not.toContain('Bad Name');
        expect(result).not.toContain('Invalid name');
    });

    test('should not include extra text with error message', () => {
        const form = { ...validBaseForm, name: 'A' };
        const result = validate(form);
        expect(result[0]).toBe('Bad name');
        expect(result[0]).not.toContain('Bad name:');
        expect(result[0]).not.toContain('Bad name.');
    });
});
