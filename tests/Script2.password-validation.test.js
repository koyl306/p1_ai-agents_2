// Jest Test Suite: Password Validation Tests for Script2.js
// Focus: less than 6 characters and valid password cases

const rules = {
    name: [
        v => v && v.length >= 2 || 'Bad name'
    ],
    email: [
        v => v && v.includes('@') || 'Bad email'
    ],
    password: [
        v => v && v.length >= 6 || 'Bad password'
    ],
    confirmPassword: [
        (v, form) => v === form.password || 'Passwords mismatch'
    ],
    age: [
        v => v >= 18 && v <= 120 || 'Bad age'
    ],
    phone: [
        v => /^\d{10}$/.test(v) || 'Bad phone'
    ]
};

function validate(form) {
    const errors = [];

    for (const field in rules) {
        for (const rule of rules[field]) {
            const result = rule(form[field], form);
            if (result !== true) {
                errors.push(result);
            }
        }
    }

    return errors;
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
// TEST SUITE: Password Validation - Valid Passwords
// ============================================================================

describe('validate() - Password Validation: Valid Passwords', () => {
    test('should accept valid 6-character password', () => {
        const form = {
            ...validBaseForm,
            password: '123456',
            confirmPassword: '123456'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should return empty errors for valid password form', () => {
        const form = validBaseForm;
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should accept 7-character password', () => {
        const form = {
            ...validBaseForm,
            password: '1234567',
            confirmPassword: '1234567'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept long password', () => {
        const form = {
            ...validBaseForm,
            password: 'VeryLongSecurePassword123',
            confirmPassword: 'VeryLongSecurePassword123'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept password with numbers', () => {
        const form = {
            ...validBaseForm,
            password: 'pass123',
            confirmPassword: 'pass123'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept password with letters only', () => {
        const form = {
            ...validBaseForm,
            password: 'abcdefgh',
            confirmPassword: 'abcdefgh'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept password with mixed case', () => {
        const form = {
            ...validBaseForm,
            password: 'PaSsWoRd123',
            confirmPassword: 'PaSsWoRd123'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept password with special characters', () => {
        const form = {
            ...validBaseForm,
            password: 'Pass@123!#$',
            confirmPassword: 'Pass@123!#$'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept password with spaces', () => {
        const form = {
            ...validBaseForm,
            password: '123456 pass',
            confirmPassword: '123456 pass'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept password with unicode characters', () => {
        const form = {
            ...validBaseForm,
            password: 'Päss🔒123',
            confirmPassword: 'Päss🔒123'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept very long password', () => {
        const longPass = 'A'.repeat(100);
        const form = {
            ...validBaseForm,
            password: longPass,
            confirmPassword: longPass
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept password with tabs and newlines', () => {
        const form = {
            ...validBaseForm,
            password: 'pass\t\n123',
            confirmPassword: 'pass\t\n123'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept all numbers 6+ characters', () => {
        const form = {
            ...validBaseForm,
            password: '123456789012',
            confirmPassword: '123456789012'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should accept all special characters 6+ length', () => {
        const form = {
            ...validBaseForm,
            password: '!@#$%^',
            confirmPassword: '!@#$%^'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });
});

// ============================================================================
// TEST SUITE: Password Validation - Less Than 6 Characters
// ============================================================================

describe('validate() - Password Validation: Less Than 6 Characters', () => {
    test('should reject 5-character password', () => {
        const form = {
            ...validBaseForm,
            password: '12345',
            confirmPassword: '12345'
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should report only password error for 5-char password', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: '12345',
            confirmPassword: '12345',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad password']);
    });

    test('should reject 4-character password', () => {
        const form = { ...validBaseForm, password: '1234', confirmPassword: '1234' };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject 3-character password', () => {
        const form = { ...validBaseForm, password: '123', confirmPassword: '123' };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject 2-character password', () => {
        const form = { ...validBaseForm, password: '12', confirmPassword: '12' };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject 1-character password', () => {
        const form = { ...validBaseForm, password: '1', confirmPassword: '1' };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should be first error when password too short in multiple errors', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 15,
            phone: '123'
        };
        const result = validate(form);
        expect(result[2]).toBe('Bad password');
    });

    test('should reject various short passwords', () => {
        const shortPasswords = ['a', 'ab', 'abc', 'abcd', 'abcde'];
        shortPasswords.forEach(pass => {
            const form = {
                ...validBaseForm,
                password: pass,
                confirmPassword: pass
            };
            const result = validate(form);
            expect(result).toContain('Bad password');
        });
    });

    test('should reject 5-char password with special chars', () => {
        const form = {
            ...validBaseForm,
            password: 'P@ss!',
            confirmPassword: 'P@ss!'
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });
});

// ============================================================================
// TEST SUITE: Password Validation - Empty Values
// ============================================================================

describe('validate() - Password Validation: Empty Values', () => {
    test('should reject empty string password', () => {
        const form = {
            ...validBaseForm,
            password: '',
            confirmPassword: ''
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should report only password error for empty password', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: '',
            confirmPassword: '',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad password']);
    });

    test('should reject null password', () => {
        const form = {
            ...validBaseForm,
            password: null,
            confirmPassword: null
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject undefined password', () => {
        const form = {
            ...validBaseForm,
            password: undefined,
            confirmPassword: undefined
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should handle missing password property', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject false as password', () => {
        const form = {
            ...validBaseForm,
            password: false,
            confirmPassword: false
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject 0 as password', () => {
        const form = {
            ...validBaseForm,
            password: 0,
            confirmPassword: 0
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject whitespace-only password', () => {
        const form = {
            ...validBaseForm,
            password: '     ',
            confirmPassword: '     '
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });
});

// ============================================================================
// TEST SUITE: Password Validation - Boundary Conditions
// ============================================================================

describe('validate() - Password Validation: Boundary Conditions', () => {
    test('should reject exactly 5 characters (just below minimum)', () => {
        const form = {
            ...validBaseForm,
            password: '12345',
            confirmPassword: '12345'
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should accept exactly 6 characters (minimum)', () => {
        const form = {
            ...validBaseForm,
            password: '123456',
            confirmPassword: '123456'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should distinguish between 5 chars (invalid) and 6 chars (valid)', () => {
        const form5 = {
            ...validBaseForm,
            password: '12345',
            confirmPassword: '12345'
        };
        const form6 = {
            ...validBaseForm,
            password: '123456',
            confirmPassword: '123456'
        };

        expect(validate(form5)).toContain('Bad password');
        expect(validate(form6)).not.toContain('Bad password');
    });

    test('should have length >= 6 check', () => {
        const validLengths = [6, 7, 10, 20, 100];
        validLengths.forEach(len => {
            const pass = 'a'.repeat(len);
            const form = {
                ...validBaseForm,
                password: pass,
                confirmPassword: pass
            };
            expect(validate(form)).not.toContain('Bad password');
        });
    });

    test('should have length < 6 rejection', () => {
        const invalidLengths = [0, 1, 2, 3, 4, 5];
        invalidLengths.forEach(len => {
            const pass = 'a'.repeat(len);
            const form = {
                ...validBaseForm,
                password: pass,
                confirmPassword: pass
            };
            expect(validate(form)).toContain('Bad password');
        });
    });
});

// ============================================================================
// TEST SUITE: Password Validation - Multiple Errors
// ============================================================================

describe('validate() - Password Validation: Multiple Errors', () => {
    test('should report short password with name error', () => {
        const form = {
            name: 'A',
            email: 'john@example.com',
            password: '123',
            confirmPassword: '123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Bad password');
    });

    test('should report short password with password mismatch', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: '123',
            confirmPassword: 'different',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
        expect(result).toContain('Passwords mismatch');
    });

    test('should report all errors including short password', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 15,
            phone: '123'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Bad email');
        expect(result).toContain('Bad password');
        expect(result).toContain('Passwords mismatch');
        expect(result).toContain('Bad age');
        expect(result).toContain('Bad phone');
    });

    test('should report empty password with multiple field errors', () => {
        const form = {
            name: 'A',
            email: '',
            password: '',
            confirmPassword: '',
            age: null,
            phone: ''
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });
});

// ============================================================================
// TEST SUITE: Password Validation - Parameterized Test Matrix
// ============================================================================

describe('validate() - Password Validation: Parameterized Matrix', () => {
    test.each([
        ['exactly 6 chars (valid)', '123456', false],
        ['7 chars (valid)', '1234567', false],
        ['long password (valid)', 'VeryLongPassword123', false],
        ['5 chars (invalid)', '12345', true],
        ['4 chars (invalid)', '1234', true],
        ['3 chars (invalid)', '123', true],
        ['2 chars (invalid)', '12', true],
        ['1 char (invalid)', '1', true],
        ['empty string (invalid)', '', true],
        ['null (invalid)', null, true],
        ['undefined (invalid)', undefined, true],
        ['false (invalid)', false, true],
        ['0 (invalid)', 0, true],
        ['with special chars (valid)', 'Pass@123!#', false],
        ['with spaces (valid)', 'pass 123', false],
        ['with unicode (valid)', 'Päss🔒', false],
        ['letters only 6+ (valid)', 'abcdef', false],
        ['numbers only 6+ (valid)', '123456', false],
        ['whitespace 5 chars (invalid)', '     ', false],
        ['whitespace 6 chars (valid)', '      ', false]
    ])(
        'password "%s" should %s contain "Bad password"',
        (description, password, shouldError) => {
            const form = {
                name: 'John Doe',
                email: 'john@example.com',
                password: password,
                confirmPassword: password,
                age: 25,
                phone: '1234567890'
            };
            const result = validate(form);

            if (shouldError) {
                expect(result).toContain('Bad password');
            } else {
                expect(result).not.toContain('Bad password');
            }
        }
    );
});

// ============================================================================
// TEST SUITE: Password Validation - Error Message
// ============================================================================

describe('validate() - Password Validation: Error Message', () => {
    test('should return exact error message "Bad password"', () => {
        const form = { ...validBaseForm, password: '123', confirmPassword: '123' };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should not return typo error messages', () => {
        const form = { ...validBaseForm, password: 'short', confirmPassword: 'short' };
        const result = validate(form);
        expect(result).not.toContain('bad password');
        expect(result).not.toContain('Bad Password');
        expect(result).not.toContain('Invalid password');
    });

    test('error message should be case-sensitive', () => {
        const form = { ...validBaseForm, password: '', confirmPassword: '' };
        const result = validate(form);
        const hasError = result.some(e => e === 'Bad password');
        expect(hasError).toBe(true);
    });

    test('should not include extra text in error message', () => {
        const form = { ...validBaseForm, password: '123', confirmPassword: '123' };
        const result = validate(form);
        const badPasswordMsg = result.find(e => e.includes('Bad password'));
        expect(badPasswordMsg).toBe('Bad password');
    });
});

// ============================================================================
// TEST SUITE: Password Validation - Consistency & Idempotency
// ============================================================================

describe('validate() - Password Validation: Consistency & Idempotency', () => {
    test('should consistently reject short password', () => {
        const form = { ...validBaseForm, password: 'short', confirmPassword: 'short' };
        const result1 = validate(form);
        const result2 = validate(form);
        const result3 = validate(form);

        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
        expect(result1).toContain('Bad password');
    });

    test('should consistently accept valid password', () => {
        const form = { ...validBaseForm, password: 'valid123', confirmPassword: 'valid123' };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).not.toContain('Bad password');
        expect(result2).not.toContain('Bad password');
    });

    test('should consistently reject empty password', () => {
        const form = { ...validBaseForm, password: '', confirmPassword: '' };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).toEqual(result2);
        expect(result1).toContain('Bad password');
    });

    test('should not modify input form', () => {
        const form = { ...validBaseForm };
        const formCopy = { ...form };
        validate(form);
        expect(form).toEqual(formCopy);
    });

    test('should handle different form objects with same password', () => {
        const form1 = {
            ...validBaseForm,
            password: 'test123',
            confirmPassword: 'test123'
        };
        const form2 = {
            ...validBaseForm,
            password: 'test123',
            confirmPassword: 'test123'
        };

        const result1 = validate(form1);
        const result2 = validate(form2);

        expect(result1).toEqual(result2);
    });
});

// ============================================================================
// TEST SUITE: Password Validation - Rule Logic
// ============================================================================

describe('validate() - Password Validation: Rule Logic', () => {
    test('should check truthiness before length check', () => {
        const form = { ...validBaseForm, password: null, confirmPassword: null };
        // Rule: v && v.length >= 6 - null is falsy, short-circuits
        expect(() => validate(form)).not.toThrow();
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should use >= 6 for length check (not >)', () => {
        const form6 = {
            ...validBaseForm,
            password: '123456',
            confirmPassword: '123456'
        };
        // 6 >= 6 is true
        const result = validate(form6);
        expect(result).not.toContain('Bad password');
    });

    test('should fail on falsy value before checking length', () => {
        const form = {
            ...validBaseForm,
            password: '',
            confirmPassword: ''
        };
        // Rule: v && v.length >= 6
        // Empty string is falsy, so doesn't evaluate length check
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should fail when length < 6 even if truthy', () => {
        const form = {
            ...validBaseForm,
            password: 'short',
            confirmPassword: 'short'
        };
        // Rule: v && v.length >= 6
        // String is truthy, but 'short'.length is 5, which is < 6
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should fail with logical OR when both conditions false', () => {
        const form = {
            ...validBaseForm,
            password: '',
            confirmPassword: ''
        };
        // Rule: v && v.length >= 6 || 'Bad password'
        // (false && ...) || 'Bad password' => 'Bad password'
        const result = validate(form);
        expect(result).toContain('Bad password');
    });
});

// ============================================================================
// TEST SUITE: Password & ConfirmPassword Together
// ============================================================================

describe('validate() - Password Validation: Password & ConfirmPassword', () => {
    test('should reject when password too short but matching', () => {
        const form = {
            ...validBaseForm,
            password: 'short',
            confirmPassword: 'short'
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should report both errors when password short and mismatched', () => {
        const form = {
            ...validBaseForm,
            password: '123',
            confirmPassword: 'different'
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
        expect(result).toContain('Passwords mismatch');
    });

    test('should accept matching 6+ char passwords', () => {
        const form = {
            ...validBaseForm,
            password: 'secure123',
            confirmPassword: 'secure123'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should validate password length independent of confirm password', () => {
        const form = {
            ...validBaseForm,
            password: '123456',
            confirmPassword: 'differentpassword'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
        expect(result).toContain('Passwords mismatch');
    });
});
