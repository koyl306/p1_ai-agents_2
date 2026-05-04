// Jest Test Suite: Valid Input Tests for validate() function
// Focus: Verify that valid inputs return empty array

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

const baseValidForm = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePass123',
    confirmPassword: 'securePass123',
    age: 25,
    phone: '1234567890'
};

// ============================================================================
// TEST SUITE: Valid Input Returns Empty Array
// ============================================================================

describe('validate() - Valid Input Returns Empty Array', () => {
    test('should return empty array for completely valid form', () => {
        const result = validate(baseValidForm);
        expect(result).toEqual([]);
    });

    test('should return empty array (not false, not undefined)', () => {
        const result = validate(baseValidForm);
        expect(result).not.toBe(false);
        expect(result).not.toBe(undefined);
        expect(Array.isArray(result)).toBe(true);
    });

    test('should return array with zero length', () => {
        const result = validate(baseValidForm);
        expect(result.length).toBe(0);
    });
});

// ============================================================================
// TEST SUITE: Valid Names - Parameterized
// ============================================================================

describe('validate() - Valid Names', () => {
    const validNames = [
        ['two character name', 'Jo'],
        ['three character name', 'Bob'],
        ['common name', 'John Doe'],
        ['long name', 'Christopher Alexander Montgomery'],
        ['name with spaces', 'Jean Paul'],
        ['name with hyphens', 'Jean-Paul'],
        ['name with apostrophe', "O'Connor"],
        ['name with numbers', 'John 123'],
        ['name with mixed case', 'JoHn DoE'],
        ['name starting with space (two chars total)', '  '],
        ['unicode name', 'José'],
        ['name with dots', 'Dr. Smith'],
        ['very long name', 'A'.repeat(100)]
    ];

    test.each(validNames)(
        'should accept %s: "%s"',
        (_, name) => {
            const form = { ...baseValidForm, name };
            const result = validate(form);
            expect(result).toEqual([]);
        }
    );
});

// ============================================================================
// TEST SUITE: Valid Emails - Parameterized
// ============================================================================

describe('validate() - Valid Emails', () => {
    const validEmails = [
        ['simple email', 'user@example.com'],
        ['email with numbers', 'user123@example.com'],
        ['email with dots in local', 'john.doe@example.com'],
        ['email with subdomain', 'user@mail.example.com'],
        ['email with multiple subdomains', 'user@mail.sub.example.co.uk'],
        ['email with plus sign', 'user+tag@example.com'],
        ['email with dash', 'user-name@example.com'],
        ['email with underscore', 'user_name@example.com'],
        ['email starting with number', '123user@example.com'],
        ['email with multiple @ symbols', 'user@@example.com'],
        ['email with @ at start', '@example.com'],
        ['email with @ at end', 'user@'],
        ['single char before @', 'a@example.com'],
        ['email with many chars', 'a'.repeat(50) + '@example.com'],
        ['email with special chars in domain', 'user@ex-ample.com']
    ];

    test.each(validEmails)(
        'should accept %s: "%s"',
        (_, email) => {
            const form = { ...baseValidForm, email };
            const result = validate(form);
            expect(result).toEqual([]);
        }
    );
});

// ============================================================================
// TEST SUITE: Valid Passwords - Parameterized
// ============================================================================

describe('validate() - Valid Passwords', () => {
    const validPasswords = [
        ['exactly 6 characters', '123456'],
        ['7 characters', '1234567'],
        ['common password', 'password123'],
        ['long password', 'ThisIsAVeryLongSecurePassword123!@#'],
        ['password with special chars', 'Pass@123!#$'],
        ['password with spaces', '123456 pass'],
        ['password with numbers only', '123456789012'],
        ['password with letters only', 'abcdefghij'],
        ['password with unicode', 'Päss🔒123'],
        ['password with mixed case', 'PaSsWoRd'],
        ['password with symbols', 'P@ss!#$%^&*('],
        ['very long password', 'A'.repeat(100)],
        ['password with tab', '123456\t'],
        ['password with newline chars', '123456\n']
    ];

    test.each(validPasswords)(
        'should accept %s: "%s"',
        (_, password) => {
            const form = {
                ...baseValidForm,
                password,
                confirmPassword: password
            };
            const result = validate(form);
            expect(result).toEqual([]);
        }
    );
});

// ============================================================================
// TEST SUITE: Valid Ages - Parameterized (Boundary & Range)
// ============================================================================

describe('validate() - Valid Ages', () => {
    const validAges = [
        ['minimum age', 18],
        ['minimum + 1', 19],
        ['young adult', 21],
        ['adult', 30],
        ['middle age', 50],
        ['senior', 70],
        ['very old', 100],
        ['maximum age', 120],
        ['maximum - 1', 119],
        ['decimal age 25.5', 25.5],
        ['decimal age 18.0', 18.0]
    ];

    test.each(validAges)(
        'should accept %s: %i',
        (_, age) => {
            const form = { ...baseValidForm, age };
            const result = validate(form);
            expect(result).toEqual([]);
        }
    );
});

// ============================================================================
// TEST SUITE: Valid Phone Numbers - Parameterized
// ============================================================================

describe('validate() - Valid Phone Numbers', () => {
    const validPhones = [
        ['standard phone', '1234567890'],
        ['starting with 9', '9876543210'],
        ['starting with 1', '1111111111'],
        ['starting with 5', '5555555555'],
        ['with leading zero', '0012345678'],
        ['all zeros', '0000000000'],
        ['all nines', '9999999999'],
        ['sequential', '1234567890'],
        ['alternating', '1010101010'],
        ['different valid number', '5551234567']
    ];

    test.each(validPhones)(
        'should accept %s: "%s"',
        (_, phone) => {
            const form = { ...baseValidForm, phone };
            const result = validate(form);
            expect(result).toEqual([]);
        }
    );
});

// ============================================================================
// TEST SUITE: Valid Form Combinations - Parameterized
// ============================================================================

describe('validate() - Valid Form Combinations', () => {
    const validForms = [
        [
            'minimal valid form',
            {
                name: 'AB',
                email: 'a@b',
                password: '123456',
                confirmPassword: '123456',
                age: 18,
                phone: '0000000000'
            }
        ],
        [
            'maximum valid form',
            {
                name: 'A'.repeat(100),
                email: 'user+tag@subdomain.example.co.uk',
                password: 'P@ss'.repeat(25),
                confirmPassword: 'P@ss'.repeat(25),
                age: 120,
                phone: '9999999999'
            }
        ],
        [
            'professional form',
            {
                name: 'Dr. John Smith',
                email: 'john.smith@company.com',
                password: 'CompanyPass@2024!',
                confirmPassword: 'CompanyPass@2024!',
                age: 45,
                phone: '5551234567'
            }
        ],
        [
            'casual form',
            {
                name: 'Alice Johnson',
                email: 'alice.j@mail.com',
                password: 'mySecurePass123',
                confirmPassword: 'mySecurePass123',
                age: 22,
                phone: '4155552671'
            }
        ],
        [
            'form with special characters in name',
            {
                name: "O'Brien-Smith",
                email: 'user@example.com',
                password: 'Valid@Pass123',
                confirmPassword: 'Valid@Pass123',
                age: 30,
                phone: '2025551234'
            }
        ],
        [
            'international name form',
            {
                name: 'José García',
                email: 'jose@example.com',
                password: 'Password123',
                confirmPassword: 'Password123',
                age: 35,
                phone: '3105551234'
            }
        ]
    ];

    test.each(validForms)(
        'should accept %s',
        (_, form) => {
            const result = validate(form);
            expect(result).toEqual([]);
        }
    );
});

// ============================================================================
// TEST SUITE: Edge Cases - Valid Input
// ============================================================================

describe('validate() - Edge Cases (Valid Input)', () => {
    test('should handle form with extra properties', () => {
        const form = {
            ...baseValidForm,
            extraField: 'should be ignored',
            anotherField: 123,
            metadata: { test: true }
        };
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should return empty array (not null)', () => {
        const result = validate(baseValidForm);
        expect(result).not.toBeNull();
        expect(result).toEqual([]);
    });

    test('should return new array instance each call', () => {
        const result1 = validate(baseValidForm);
        const result2 = validate(baseValidForm);
        expect(result1).not.toBe(result2);
        expect(result1).toEqual(result2);
    });

    test('should accept whitespace in name (length >= 2)', () => {
        const form = {
            ...baseValidForm,
            name: '  '
        };
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should accept whitespace in password and confirmation', () => {
        const form = {
            ...baseValidForm,
            password: '      ',
            confirmPassword: '      '
        };
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should accept form object created with different methods', () => {
        const form = Object.assign({}, baseValidForm);
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should accept spread copy of valid form', () => {
        const form = { ...baseValidForm };
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should preserve array reference type as empty array', () => {
        const result = validate(baseValidForm);
        expect(result instanceof Array).toBe(true);
        expect(result.constructor === Array).toBe(true);
    });
});

// ============================================================================
// TEST SUITE: Consistency - Valid Input
// ============================================================================

describe('validate() - Consistency (Valid Input)', () => {
    test('should consistently return empty array for same valid form', () => {
        const form = baseValidForm;
        const result1 = validate(form);
        const result2 = validate(form);
        const result3 = validate(form);
        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
        expect(result3).toEqual([]);
    });

    test('should accept same form data in different orders', () => {
        const form1 = {
            name: 'John',
            email: 'john@example.com',
            password: 'pass123',
            confirmPassword: 'pass123',
            age: 25,
            phone: '1234567890'
        };

        const form2 = {
            phone: '1234567890',
            age: 25,
            confirmPassword: 'pass123',
            password: 'pass123',
            email: 'john@example.com',
            name: 'John'
        };

        expect(validate(form1)).toEqual([]);
        expect(validate(form2)).toEqual([]);
    });

    test('should not modify input form object', () => {
        const form = { ...baseValidForm };
        const formCopy = { ...form };
        validate(form);
        expect(form).toEqual(formCopy);
    });
});
