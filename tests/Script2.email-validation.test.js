// Jest Test Suite: Email Validation Tests for Script2.js
// Focus: missing '@', empty value, and valid email cases

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
// TEST SUITE: Email Validation - Valid Cases
// ============================================================================

describe('validate() - Email Validation: Valid Cases', () => {
    test('should accept valid email with single @', () => {
        const form = { ...validBaseForm, email: 'user@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should return empty errors for valid email form', () => {
        const form = validBaseForm;
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('valid email should not produce any errors', () => {
        const form = {
            name: 'Alice',
            email: 'alice@test.com',
            password: 'pass123',
            confirmPassword: 'pass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with numbers', () => {
        const form = { ...validBaseForm, email: 'user123@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with dots in local part', () => {
        const form = { ...validBaseForm, email: 'john.doe@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with subdomain', () => {
        const form = { ...validBaseForm, email: 'user@mail.example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with multiple subdomains', () => {
        const form = { ...validBaseForm, email: 'user@mail.sub.example.co.uk' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with plus sign', () => {
        const form = { ...validBaseForm, email: 'user+tag@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with dash', () => {
        const form = { ...validBaseForm, email: 'user-name@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with underscore', () => {
        const form = { ...validBaseForm, email: 'user_name@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email starting with number', () => {
        const form = { ...validBaseForm, email: '123user@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept minimal valid email (a@b)', () => {
        const form = { ...validBaseForm, email: 'a@b' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept single character before @', () => {
        const form = { ...validBaseForm, email: 'a@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });
});

// ============================================================================
// TEST SUITE: Email Validation - Missing '@' Symbol
// ============================================================================

describe('validate() - Email Validation: Missing @ Symbol', () => {
    test('should reject email without @ symbol', () => {
        const form = { ...validBaseForm, email: 'userexample.com' };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should only report email error when missing @', () => {
        const form = {
            name: 'John Doe',
            email: 'invalidemail',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad email']);
    });

    test('should reject email with domain but no @', () => {
        const form = { ...validBaseForm, email: 'user.example.com' };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should detect missing @ before checking includes()', () => {
        const form = { ...validBaseForm, email: 'noemail' };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should reject plain text without @', () => {
        const form = { ...validBaseForm, email: 'justtext' };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should reject email with only domain (no @, no local)', () => {
        const form = { ...validBaseForm, email: 'example.com' };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should be first error when missing @ in invalid form', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 15,
            phone: '123'
        };
        const result = validate(form);
        expect(result[1]).toBe('Bad email');
    });
});

// ============================================================================
// TEST SUITE: Email Validation - Empty Value
// ============================================================================

describe('validate() - Email Validation: Empty Value', () => {
    test('should reject empty string email', () => {
        const form = { ...validBaseForm, email: '' };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should report only email error for empty email', () => {
        const form = {
            name: 'John Doe',
            email: '',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad email']);
    });

    test('should reject null email', () => {
        const form = { ...validBaseForm, email: null };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should reject undefined email', () => {
        const form = { ...validBaseForm, email: undefined };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should handle missing email property', () => {
        const form = {
            name: 'John Doe',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should reject false as email', () => {
        const form = { ...validBaseForm, email: false };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should reject 0 as email', () => {
        const form = { ...validBaseForm, email: 0 };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should reject empty email (falsy check)', () => {
        const form = { ...validBaseForm, email: '' };
        // Empty string is falsy, so (v && v.includes('@')) is false
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should handle whitespace-only email', () => {
        const form = { ...validBaseForm, email: '   ' };
        // Whitespace string is truthy but doesn't contain @
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('email error should be reported first in form with all empty fields', () => {
        const form = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            age: null,
            phone: ''
        };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });
});

// ============================================================================
// TEST SUITE: Email Validation - Boundary & Edge Cases
// ============================================================================

describe('validate() - Email Validation: Boundary & Edge Cases', () => {
    test('should accept email with multiple @ symbols', () => {
        const form = { ...validBaseForm, email: 'user@@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with @ at start', () => {
        const form = { ...validBaseForm, email: '@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with @ at end', () => {
        const form = { ...validBaseForm, email: 'user@' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with only @ symbol', () => {
        const form = { ...validBaseForm, email: '@' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should accept email with @ in middle', () => {
        const form = { ...validBaseForm, email: 'user@example' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should detect @ anywhere in string (includes check)', () => {
        const emails = ['@', 'a@', '@a', 'a@b', 'user@@host'];
        emails.forEach(email => {
            const form = { ...validBaseForm, email };
            const result = validate(form);
            expect(result).not.toContain('Bad email');
        });
    });

    test('should reject very long email without @', () => {
        const form = { ...validBaseForm, email: 'a'.repeat(100) };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should accept very long email with @', () => {
        const form = { ...validBaseForm, email: 'a'.repeat(50) + '@' + 'b'.repeat(50) };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });
});

// ============================================================================
// TEST SUITE: Email Validation - Multiple Errors
// ============================================================================

describe('validate() - Email Validation: Multiple Errors', () => {
    test('should report email error with name error', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad email');
        expect(result).toContain('Bad name');
    });

    test('should report email error with password error', () => {
        const form = {
            name: 'John Doe',
            email: '',
            password: '123',
            confirmPassword: '123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad email');
        expect(result).toContain('Bad password');
    });

    test('should report all errors including missing @ email', () => {
        const form = {
            name: 'A',
            email: 'invalidemail',
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

    test('should include email error with all field errors', () => {
        const form = {
            name: '',
            email: 'noemail',
            password: '',
            confirmPassword: '',
            age: null,
            phone: ''
        };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });
});

// ============================================================================
// TEST SUITE: Email Validation - Parameterized Test Matrix
// ============================================================================

describe('validate() - Email Validation: Parameterized Matrix', () => {
    test.each([
        ['valid email', 'user@example.com', false],
        ['missing @', 'userexample.com', true],
        ['empty string', '', true],
        ['null', null, true],
        ['undefined', undefined, true],
        ['false', false, true],
        ['0', 0, true],
        ['@ only', '@', false],
        ['@ at start', '@example.com', false],
        ['@ at end', 'user@', false],
        ['multiple @', 'user@@example.com', false],
        ['whitespace', '   ', true],
        ['minimal email', 'a@b', false],
        ['with dot', 'user@ex.com', false],
        ['with plus', 'user+tag@ex.com', false],
        ['no domain extension', 'user@domain', false],
        ['only domain', 'example.com', true],
        ['only local', 'username', true]
    ])(
        'email "%s" should %s contain "Bad email"',
        (description, email, shouldError) => {
            const form = {
                name: 'John Doe',
                email: email,
                password: 'securePass123',
                confirmPassword: 'securePass123',
                age: 25,
                phone: '1234567890'
            };
            const result = validate(form);

            if (shouldError) {
                expect(result).toContain('Bad email');
            } else {
                expect(result).not.toContain('Bad email');
            }
        }
    );
});

// ============================================================================
// TEST SUITE: Email Validation - Error Message Accuracy
// ============================================================================

describe('validate() - Email Validation: Error Message', () => {
    test('should return exact error message "Bad email"', () => {
        const form = { ...validBaseForm, email: '' };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should not return typo error messages', () => {
        const form = { ...validBaseForm, email: 'noemail' };
        const result = validate(form);
        expect(result).not.toContain('bad email');
        expect(result).not.toContain('Bad Email');
        expect(result).not.toContain('Invalid email');
    });

    test('error message should be case-sensitive', () => {
        const form = { ...validBaseForm, email: '' };
        const result = validate(form);
        expect(result[0]).toBe('Bad email');
        expect(result[0]).not.toBe('bad email');
        expect(result[0]).not.toBe('BAD EMAIL');
    });
});

// ============================================================================
// TEST SUITE: Email Validation - Consistency & Idempotency
// ============================================================================

describe('validate() - Email Validation: Consistency & Idempotency', () => {
    test('should consistently reject empty email', () => {
        const form = { ...validBaseForm, email: '' };
        const result1 = validate(form);
        const result2 = validate(form);
        const result3 = validate(form);

        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
        expect(result1).toContain('Bad email');
    });

    test('should consistently accept valid email', () => {
        const form = { ...validBaseForm, email: 'test@example.com' };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).not.toContain('Bad email');
        expect(result2).not.toContain('Bad email');
    });

    test('should consistently reject email without @', () => {
        const form = { ...validBaseForm, email: 'noemail' };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).toEqual(result2);
        expect(result1).toContain('Bad email');
    });

    test('should not modify input form', () => {
        const form = { ...validBaseForm };
        const formCopy = { ...form };
        validate(form);
        expect(form).toEqual(formCopy);
    });

    test('should handle different form objects with same email', () => {
        const form1 = { ...validBaseForm, email: 'test@test.com' };
        const form2 = { ...validBaseForm, email: 'test@test.com' };

        const result1 = validate(form1);
        const result2 = validate(form2);

        expect(result1).toEqual(result2);
    });
});

// ============================================================================
// TEST SUITE: Email Validation - Rule Logic
// ============================================================================

describe('validate() - Email Validation: Rule Logic', () => {
    test('should check truthiness before includes() call', () => {
        const form = { ...validBaseForm, email: null };
        // Rule: v && v.includes('@') - null is falsy, short-circuits
        expect(() => validate(form)).not.toThrow();
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should use includes() for @ detection (not strict comparison)', () => {
        const form = { ...validBaseForm, email: 'prefix@suffix@end' };
        // includes('@') checks for presence, not exact match
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should fail on first falsy check (&&)', () => {
        const form = { ...validBaseForm, email: '' };
        // Rule: v && v.includes('@')
        // Empty string is falsy, so doesn't evaluate includes()
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should fail on includes returning false', () => {
        const form = { ...validBaseForm, email: 'valid but no at symbol' };
        // Rule: v && v.includes('@')
        // String is truthy, but includes('@') returns false
        const result = validate(form);
        expect(result).toContain('Bad email');
    });
});
