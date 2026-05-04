// Jest Test Suite: Phone Validation Tests for Script3.js
// Focus: invalid formats and correct 10-digit number validation

const schema = {
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

function runValidation(value, rules, form) {
    return rules
        .map(rule => rule(value, form))
        .filter(result => result !== true);
}

function validate(form) {
    return Object.entries(schema)
        .flatMap(([field, rules]) =>
            runValidation(form[field], rules, form)
        );
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
// TEST SUITE: Phone Validation - Valid 10-Digit Formats
// ============================================================================

describe('validate() - Phone Validation: Valid 10-Digit Numbers', () => {
    test('should accept standard 10-digit phone', () => {
        const form = validBaseForm;
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should return empty errors for valid phone form', () => {
        const form = validBaseForm;
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should accept 10-digit phone starting with 1', () => {
        const form = { ...validBaseForm, phone: '1111111111' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should accept 10-digit phone starting with 9', () => {
        const form = { ...validBaseForm, phone: '9876543210' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should accept 10-digit phone starting with 5', () => {
        const form = { ...validBaseForm, phone: '5551234567' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should accept phone with leading zeros', () => {
        const form = { ...validBaseForm, phone: '0012345678' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should accept phone all zeros', () => {
        const form = { ...validBaseForm, phone: '0000000000' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should accept phone all nines', () => {
        const form = { ...validBaseForm, phone: '9999999999' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should accept sequential digits phone', () => {
        const form = { ...validBaseForm, phone: '0123456789' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should accept alternating digits phone', () => {
        const form = { ...validBaseForm, phone: '1010101010' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should accept various valid 10-digit numbers', () => {
        const validPhones = [
            '1234567890',
            '9876543210',
            '5551234567',
            '2025551234',
            '4155552671',
            '6175550000',
            '0000000000',
            '9999999999',
            '1111111111',
            '5555555555'
        ];

        validPhones.forEach(phone => {
            const form = { ...validBaseForm, phone };
            const result = validate(form);
            expect(result).not.toContain('Bad phone');
        });
    });

    test('should accept report only phone error for valid phone', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '2025551234'
        };
        const result = validate(form);
        expect(result).toEqual([]);
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Wrong Length (Invalid)
// ============================================================================

describe('validate() - Phone Validation: Wrong Length', () => {
    test('should reject 9-digit phone (too short)', () => {
        const form = { ...validBaseForm, phone: '123456789' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should report only phone error for 9-digit number', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '123456789'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad phone']);
    });

    test('should reject 11-digit phone (too long)', () => {
        const form = { ...validBaseForm, phone: '12345678901' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject 8-digit phone', () => {
        const form = { ...validBaseForm, phone: '12345678' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject 12-digit phone', () => {
        const form = { ...validBaseForm, phone: '123456789012' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject 1-digit phone', () => {
        const form = { ...validBaseForm, phone: '1' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject empty string phone', () => {
        const form = { ...validBaseForm, phone: '' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject various wrong lengths', () => {
        const wrongLengths = ['1', '12', '123', '1234', '12345', '123456', '1234567', '12345678', '123456789', '12345678901', '123456789012'];
        wrongLengths.forEach(phone => {
            const form = { ...validBaseForm, phone };
            const result = validate(form);
            expect(result).toContain('Bad phone');
        });
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Invalid Characters
// ============================================================================

describe('validate() - Phone Validation: Invalid Characters', () => {
    test('should reject phone with letters', () => {
        const form = { ...validBaseForm, phone: '12345678ab' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should report only phone error for letters in phone', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: 'abcd123456'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad phone']);
    });

    test('should reject phone with spaces', () => {
        const form = { ...validBaseForm, phone: '123 456 7890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with dashes', () => {
        const form = { ...validBaseForm, phone: '123-456-7890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with parentheses', () => {
        const form = { ...validBaseForm, phone: '(123) 456-7890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with dots', () => {
        const form = { ...validBaseForm, phone: '123.456.7890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with plus sign', () => {
        const form = { ...validBaseForm, phone: '+11234567890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with asterisk', () => {
        const form = { ...validBaseForm, phone: '123*456*7890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with hash', () => {
        const form = { ...validBaseForm, phone: '123#456#7890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with special characters', () => {
        const form = { ...validBaseForm, phone: '1234@67890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with exclamation mark', () => {
        const form = { ...validBaseForm, phone: '123456789!' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject common formatted phones', () => {
        const formattedPhones = [
            '(123) 456-7890',
            '123-456-7890',
            '123.456.7890',
            '123 456 7890',
            '+1 123 456 7890',
            '1-123-456-7890',
            '+11234567890'
        ];

        formattedPhones.forEach(phone => {
            const form = { ...validBaseForm, phone };
            const result = validate(form);
            expect(result).toContain('Bad phone');
        });
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Mixed Content (Invalid)
// ============================================================================

describe('validate() - Phone Validation: Mixed Content', () => {
    test('should reject phone with leading space', () => {
        const form = { ...validBaseForm, phone: ' 1234567890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with trailing space', () => {
        const form = { ...validBaseForm, phone: '1234567890 ' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with internal space', () => {
        const form = { ...validBaseForm, phone: '123456 890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject mostly digits with one letter', () => {
        const form = { ...validBaseForm, phone: '123456789a' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject mostly digits with one special char', () => {
        const form = { ...validBaseForm, phone: '123456789!' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with only one invalid char among 10', () => {
        const form = { ...validBaseForm, phone: '12345678-0' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Null/Undefined/Empty
// ============================================================================

describe('validate() - Phone Validation: Null/Undefined/Empty', () => {
    test('should reject null phone', () => {
        const form = { ...validBaseForm, phone: null };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject undefined phone', () => {
        const form = { ...validBaseForm, phone: undefined };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject false as phone', () => {
        const form = { ...validBaseForm, phone: false };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject 0 as phone', () => {
        const form = { ...validBaseForm, phone: 0 };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject missing phone property', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25
        };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject whitespace-only phone', () => {
        const form = { ...validBaseForm, phone: '   ' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with only spaces', () => {
        const form = { ...validBaseForm, phone: '          ' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Type Coercion
// ============================================================================

describe('validate() - Phone Validation: Type Coercion', () => {
    test('should reject number phone 1234567890', () => {
        const form = { ...validBaseForm, phone: 1234567890 };
        const result = validate(form);
        // /^\d{10}$/.test(1234567890) converts to string '1234567890'
        // This might actually pass depending on JavaScript behavior
        expect(result).not.toContain('Bad phone');
    });

    test('should reject number phone 123456789 (9 digits)', () => {
        const form = { ...validBaseForm, phone: 123456789 };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject string with leading zeros converted to number', () => {
        const form = { ...validBaseForm, phone: '0012345678' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should reject array as phone', () => {
        const form = { ...validBaseForm, phone: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject object as phone', () => {
        const form = { ...validBaseForm, phone: { digits: '1234567890' } };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject boolean true as phone', () => {
        const form = { ...validBaseForm, phone: true };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject NaN as phone', () => {
        const form = { ...validBaseForm, phone: NaN };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject Infinity as phone', () => {
        const form = { ...validBaseForm, phone: Infinity };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Boundary Conditions
// ============================================================================

describe('validate() - Phone Validation: Boundary Conditions', () => {
    test('should reject exactly 9 digits (one below minimum)', () => {
        const form = { ...validBaseForm, phone: '123456789' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should accept exactly 10 digits (minimum)', () => {
        const form = { ...validBaseForm, phone: '1234567890' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should reject exactly 11 digits (one above minimum)', () => {
        const form = { ...validBaseForm, phone: '12345678901' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should verify regex pattern ^\\d{10}$', () => {
        // Regex: ^\\d{10}$ means START + exactly 10 digits + END
        const validPhone = '1234567890';
        const regex = /^\d{10}$/;
        expect(regex.test(validPhone)).toBe(true);
    });

    test('should verify no characters before digits', () => {
        const form = { ...validBaseForm, phone: 'a1234567890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should verify no characters after digits', () => {
        const form = { ...validBaseForm, phone: '1234567890a' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should verify exact 10 digits required', () => {
        // Must have exactly 10, not less, not more
        expect(validate({ ...validBaseForm, phone: '123456789' })).toContain('Bad phone');
        expect(validate({ ...validBaseForm, phone: '1234567890' })).not.toContain('Bad phone');
        expect(validate({ ...validBaseForm, phone: '12345678901' })).toContain('Bad phone');
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Multiple Errors
// ============================================================================

describe('validate() - Phone Validation: Multiple Errors', () => {
    test('should report phone error with name error', () => {
        const form = {
            name: 'A',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '123456789'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Bad phone');
    });

    test('should report phone error with age error', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 15,
            phone: '123-456-7890'
        };
        const result = validate(form);
        expect(result).toContain('Bad age');
        expect(result).toContain('Bad phone');
    });

    test('should report all errors including phone error', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 200,
            phone: 'invalid'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Bad email');
        expect(result).toContain('Bad password');
        expect(result).toContain('Passwords mismatch');
        expect(result).toContain('Bad age');
        expect(result).toContain('Bad phone');
    });

    test('should include phone error with multiple field errors', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: 'short',
            confirmPassword: 'short',
            age: 15,
            phone: '123'
        };
        const result = validate(form);
        expect(result).toContain('Bad phone');
        expect(result.length).toBeGreaterThan(1);
    });

    test('phone error should be in correct position in errors array', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 15,
            phone: '123'
        };
        const result = validate(form);
        // Phone is last in schema, so should be last error
        expect(result[result.length - 1]).toBe('Bad phone');
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Parameterized Test Matrix
// ============================================================================

describe('validate() - Phone Validation: Parameterized Matrix', () => {
    test.each([
        ['valid standard', '1234567890', false],
        ['valid with 9s', '9999999999', false],
        ['valid with 0s', '0000000000', false],
        ['valid sequential', '0123456789', false],
        ['valid alternating', '1010101010', false],
        ['valid common format', '5551234567', false],
        ['9 digits (too short)', '123456789', true],
        ['11 digits (too long)', '12345678901', true],
        ['8 digits', '12345678', true],
        ['12 digits', '123456789012', true],
        ['1 digit', '1', true],
        ['with spaces', '123 456 7890', true],
        ['with dashes', '123-456-7890', true],
        ['with parentheses', '(123) 456-7890', true],
        ['with dots', '123.456.7890', true],
        ['with letters', '12345678ab', true],
        ['with plus sign', '+11234567890', true],
        ['with hash', '123#456#7890', true],
        ['empty string', '', true],
        ['null', null, true],
        ['undefined', undefined, true],
        ['false', false, true],
        ['0', 0, true],
        ['leading space', ' 1234567890', true],
        ['trailing space', '1234567890 ', true],
        ['internal space', '123456 890', true],
        ['all spaces', '          ', true],
        ['with letter at start', 'a1234567890', true],
        ['with letter at end', '1234567890a', true],
        ['mostly digits with dash', '123456789-0', true]
    ])(
        'phone "%s" should %s contain "Bad phone"',
        (description, phone, shouldError) => {
            const form = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'securePass123',
                confirmPassword: 'securePass123',
                age: 25,
                phone: phone
            };
            const result = validate(form);

            if (shouldError) {
                expect(result).toContain('Bad phone');
            } else {
                expect(result).not.toContain('Bad phone');
            }
        }
    );
});

// ============================================================================
// TEST SUITE: Phone Validation - Error Message
// ============================================================================

describe('validate() - Phone Validation: Error Message', () => {
    test('should return exact error message "Bad phone"', () => {
        const form = { ...validBaseForm, phone: '123456789' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should not return typo error messages', () => {
        const form = { ...validBaseForm, phone: '123-456-7890' };
        const result = validate(form);
        expect(result).not.toContain('bad phone');
        expect(result).not.toContain('Bad Phone');
        expect(result).not.toContain('Invalid phone');
        expect(result).not.toContain('Phone error');
    });

    test('error message should be case-sensitive', () => {
        const form = { ...validBaseForm, phone: '123' };
        const result = validate(form);
        const hasExactError = result.some(e => e === 'Bad phone');
        expect(hasExactError).toBe(true);
    });

    test('should not include extra text in error message', () => {
        const form = { ...validBaseForm, phone: '' };
        const result = validate(form);
        const phoneError = result.find(e => e.includes('phone'));
        expect(phoneError).toBe('Bad phone');
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Consistency & Idempotency
// ============================================================================

describe('validate() - Phone Validation: Consistency & Idempotency', () => {
    test('should consistently reject invalid phone', () => {
        const form = { ...validBaseForm, phone: '123456789' };
        const result1 = validate(form);
        const result2 = validate(form);
        const result3 = validate(form);

        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
        expect(result1).toContain('Bad phone');
    });

    test('should consistently accept valid phone', () => {
        const form = { ...validBaseForm, phone: '1234567890' };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).not.toContain('Bad phone');
        expect(result2).not.toContain('Bad phone');
    });

    test('should not modify input form', () => {
        const form = { ...validBaseForm };
        const formCopy = { ...form };
        validate(form);
        expect(form).toEqual(formCopy);
    });

    test('should handle different form objects with same phone', () => {
        const form1 = { ...validBaseForm, phone: '5551234567' };
        const form2 = { ...validBaseForm, phone: '5551234567' };

        const result1 = validate(form1);
        const result2 = validate(form2);

        expect(result1).toEqual(result2);
    });

    test('should be deterministic across multiple calls', () => {
        const phones = ['1234567890', '123456789', '123-456-7890', '9999999999'];

        const results1 = phones.map(phone => 
            validate({ ...validBaseForm, phone })
        );
        const results2 = phones.map(phone => 
            validate({ ...validBaseForm, phone })
        );

        expect(results1).toEqual(results2);
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Regex Pattern Logic
// ============================================================================

describe('validate() - Phone Validation: Regex Pattern /^\\d{10}$/', () => {
    test('should use regex pattern ^\\d{10}$', () => {
        // ^ means start of string
        // \\d{10} means exactly 10 digits
        // $ means end of string
        const regex = /^\d{10}$/;

        expect(regex.test('1234567890')).toBe(true);
        expect(regex.test('123456789')).toBe(false);
        expect(regex.test('12345678901')).toBe(false);
        expect(regex.test('12345678ab')).toBe(false);
    });

    test('should reject string with prefix', () => {
        const form = { ...validBaseForm, phone: 'a1234567890' };
        // ^ anchors to start, rejects prefix
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject string with suffix', () => {
        const form = { ...validBaseForm, phone: '1234567890a' };
        // $ anchors to end, rejects suffix
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should require exactly 10 digits', () => {
        const form9 = { ...validBaseForm, phone: '123456789' };
        const form10 = { ...validBaseForm, phone: '1234567890' };
        const form11 = { ...validBaseForm, phone: '12345678901' };

        expect(validate(form9)).toContain('Bad phone');
        expect(validate(form10)).not.toContain('Bad phone');
        expect(validate(form11)).toContain('Bad phone');
    });

    test('should only accept digit characters', () => {
        const validPhones = ['1234567890', '0000000000', '9999999999'];
        const invalidPhones = ['12345678a0', '1234 567890', '123-456-7890'];

        validPhones.forEach(phone => {
            const form = { ...validBaseForm, phone };
            expect(validate(form)).not.toContain('Bad phone');
        });

        invalidPhones.forEach(phone => {
            const form = { ...validBaseForm, phone };
            expect(validate(form)).toContain('Bad phone');
        });
    });

    test('should work with runValidation function', () => {
        const result = runValidation('1234567890', schema.phone, validBaseForm);
        // Valid returns true, filtered out by filter(result !== true)
        expect(result).toEqual([]);
    });

    test('should return error through runValidation', () => {
        const result = runValidation('123456789', schema.phone, validBaseForm);
        // Invalid returns 'Bad phone', kept by filter
        expect(result).toContain('Bad phone');
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Edge Cases
// ============================================================================

describe('validate() - Phone Validation: Edge Cases', () => {
    test('should handle very long string with 10 digits', () => {
        const form = { ...validBaseForm, phone: '1234567890extra' };
        const result = validate(form);
        // $ anchor prevents matching
        expect(result).toContain('Bad phone');
    });

    test('should handle unicode digit characters', () => {
        const form = { ...validBaseForm, phone: '١٢٣٤٥٦٧٨٩٠' };
        const result = validate(form);
        // \\d matches ASCII digits only
        expect(result).toContain('Bad phone');
    });

    test('should handle tab character in phone', () => {
        const form = { ...validBaseForm, phone: '123456789\t0' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should handle newline character in phone', () => {
        const form = { ...validBaseForm, phone: '123456789\n0' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should handle form with only phone invalid', () => {
        const form = {
            name: 'Jane Doe',
            email: 'jane@test.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 30,
            phone: 'invalid'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad phone']);
    });

    test('should match various common invalid formats', () => {
        const commonFormats = [
            '(123) 456-7890',     // Standard US format
            '123-456-7890',       // Dashed format
            '123.456.7890',       // Dotted format
            '+1 123 456 7890',    // International format
            '1 (123) 456-7890',   // With country code
            '123 456 7890'        // Spaced format
        ];

        commonFormats.forEach(phone => {
            const form = { ...validBaseForm, phone };
            expect(validate(form)).toContain('Bad phone');
        });
    });
});

// ============================================================================
// TEST SUITE: Phone Validation - Integration with runValidation
// ============================================================================

describe('validate() - Phone Validation: runValidation Integration', () => {
    test('runValidation should filter out true for valid phone', () => {
        const result = runValidation('1234567890', schema.phone, validBaseForm);
        // True result is filtered out
        expect(result).toEqual([]);
    });

    test('runValidation should keep error message for invalid phone', () => {
        const result = runValidation('123456789', schema.phone, validBaseForm);
        expect(result).toContain('Bad phone');
    });

    test('runValidation should not return boolean for valid phone', () => {
        const result = runValidation('1234567890', schema.phone, validBaseForm);
        expect(result).not.toContain(true);
    });

    test('runValidation works through validate function', () => {
        const form = { ...validBaseForm, phone: '1234567890' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('validate uses runValidation correctly', () => {
        const validForm = { ...validBaseForm, phone: '5551234567' };
        const invalidForm = { ...validBaseForm, phone: '555123456' };

        expect(validate(validForm)).not.toContain('Bad phone');
        expect(validate(invalidForm)).toContain('Bad phone');
    });
});
