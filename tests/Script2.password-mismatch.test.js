// Jest Test Suite: Password Mismatch Validation Tests for Script2.js
// Focus: Password and ConfirmPassword comparison cases

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
// TEST SUITE: Matching Passwords (Valid Cases)
// ============================================================================

describe('validate() - Password Confirmation: Matching Passwords', () => {
    test('should accept identical matching passwords', () => {
        const form = {
            ...validBaseForm,
            password: 'securePass123',
            confirmPassword: 'securePass123'
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should return empty errors for valid matching passwords', () => {
        const form = validBaseForm;
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should accept matching passwords with special characters', () => {
        const form = {
            ...validBaseForm,
            password: 'P@ss!#$%123',
            confirmPassword: 'P@ss!#$%123'
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept matching passwords with spaces', () => {
        const form = {
            ...validBaseForm,
            password: 'pass word 123',
            confirmPassword: 'pass word 123'
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept matching passwords with unicode', () => {
        const form = {
            ...validBaseForm,
            password: 'Päss🔒word123',
            confirmPassword: 'Päss🔒word123'
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept matching empty passwords', () => {
        const form = {
            ...validBaseForm,
            password: '',
            confirmPassword: ''
        };
        const result = validate(form);
        // Will have 'Bad password' error but not 'Passwords mismatch'
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept matching null passwords', () => {
        const form = {
            ...validBaseForm,
            password: null,
            confirmPassword: null
        };
        const result = validate(form);
        // Will have 'Bad password' error but not 'Passwords mismatch'
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept matching undefined passwords', () => {
        const form = {
            ...validBaseForm,
            password: undefined,
            confirmPassword: undefined
        };
        const result = validate(form);
        // Will have 'Bad password' error but not 'Passwords mismatch'
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept matching very long passwords', () => {
        const longPass = 'A'.repeat(100) + '123';
        const form = {
            ...validBaseForm,
            password: longPass,
            confirmPassword: longPass
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept multiple matching cases', () => {
        const passPairs = [
            ['password123', 'password123'],
            ['P@ss!', 'P@ss!'],
            ['a b c', 'a b c'],
            ['123456', '123456'],
            ['!@#$%^', '!@#$%^']
        ];

        passPairs.forEach(([pass, confirm]) => {
            const form = {
                ...validBaseForm,
                password: pass,
                confirmPassword: confirm
            };
            const result = validate(form);
            expect(result).not.toContain('Passwords mismatch');
        });
    });
});

// ============================================================================
// TEST SUITE: Mismatched Passwords (Invalid Cases)
// ============================================================================

describe('validate() - Password Confirmation: Mismatched Passwords', () => {
    test('should reject completely different passwords', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: 'completely_different'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should report only mismatch error for otherwise valid form', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'different_password',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Passwords mismatch']);
    });

    test('should reject passwords differing by one character', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: 'password124'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject passwords differing in case', () => {
        const form = {
            ...validBaseForm,
            password: 'Password123',
            confirmPassword: 'password123'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should be case-sensitive comparison', () => {
        const form = {
            ...validBaseForm,
            password: 'PASS123',
            confirmPassword: 'pass123'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject passwords with extra space', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: 'password123 '
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject passwords missing one character', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: 'password12'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject password and empty confirmPassword', () => {
        const form = {
            ...validBaseForm,
            password: 'securePass123',
            confirmPassword: ''
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject empty password and filled confirmPassword', () => {
        const form = {
            ...validBaseForm,
            password: '',
            confirmPassword: 'somePassword'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject password and null confirmPassword', () => {
        const form = {
            ...validBaseForm,
            password: 'securePass123',
            confirmPassword: null
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject null password and string confirmPassword', () => {
        const form = {
            ...validBaseForm,
            password: null,
            confirmPassword: 'somePassword'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });
});

// ============================================================================
// TEST SUITE: Null and Undefined Combinations
// ============================================================================

describe('validate() - Password Confirmation: Null/Undefined Combinations', () => {
    test('should accept both null passwords', () => {
        const form = {
            ...validBaseForm,
            password: null,
            confirmPassword: null
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept both undefined passwords', () => {
        const form = {
            ...validBaseForm,
            password: undefined,
            confirmPassword: undefined
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should reject null vs undefined', () => {
        const form = {
            ...validBaseForm,
            password: null,
            confirmPassword: undefined
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject undefined vs null', () => {
        const form = {
            ...validBaseForm,
            password: undefined,
            confirmPassword: null
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject string vs null', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: null
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject string vs undefined', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: undefined
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });
});

// ============================================================================
// TEST SUITE: Type Coercion Cases
// ============================================================================

describe('validate() - Password Confirmation: Type Coercion', () => {
    test('should reject number vs string', () => {
        const form = {
            ...validBaseForm,
            password: 123456,
            confirmPassword: '123456'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should accept matching numbers (same type)', () => {
        const form = {
            ...validBaseForm,
            password: 123456,
            confirmPassword: 123456
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should reject boolean vs string', () => {
        const form = {
            ...validBaseForm,
            password: true,
            confirmPassword: 'true'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject false vs 0', () => {
        const form = {
            ...validBaseForm,
            password: false,
            confirmPassword: 0
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should accept matching false values', () => {
        const form = {
            ...validBaseForm,
            password: false,
            confirmPassword: false
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept matching 0 values', () => {
        const form = {
            ...validBaseForm,
            password: 0,
            confirmPassword: 0
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should reject empty string vs false', () => {
        const form = {
            ...validBaseForm,
            password: '',
            confirmPassword: false
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should use strict equality (===), not loose (==)', () => {
        const form = {
            ...validBaseForm,
            password: '0',
            confirmPassword: 0
        };
        const result = validate(form);
        // Strict equality should reject this
        expect(result).toContain('Passwords mismatch');
    });
});

// ============================================================================
// TEST SUITE: Special Characters and Whitespace
// ============================================================================

describe('validate() - Password Confirmation: Special Characters & Whitespace', () => {
    test('should reject passwords differing in leading space', () => {
        const form = {
            ...validBaseForm,
            password: ' password123',
            confirmPassword: 'password123'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject passwords differing in trailing space', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: 'password123 '
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject passwords differing in internal spaces', () => {
        const form = {
            ...validBaseForm,
            password: 'pass word123',
            confirmPassword: 'password123'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should accept passwords with same multiple spaces', () => {
        const form = {
            ...validBaseForm,
            password: 'pass  word  123',
            confirmPassword: 'pass  word  123'
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should reject passwords differing by tab character', () => {
        const form = {
            ...validBaseForm,
            password: 'password\t123',
            confirmPassword: 'password123'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should accept passwords with same tab characters', () => {
        const form = {
            ...validBaseForm,
            password: 'password\t123',
            confirmPassword: 'password\t123'
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should reject passwords differing in newline', () => {
        const form = {
            ...validBaseForm,
            password: 'password\n123',
            confirmPassword: 'password123'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should accept passwords with same special characters', () => {
        const form = {
            ...validBaseForm,
            password: 'P@!#$%^&*()',
            confirmPassword: 'P@!#$%^&*()'
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should reject passwords differing in special character', () => {
        const form = {
            ...validBaseForm,
            password: 'P@ss!#$%',
            confirmPassword: 'P@ss!#$&'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });
});

// ============================================================================
// TEST SUITE: Multiple Errors with Mismatch
// ============================================================================

describe('validate() - Password Confirmation: Multiple Errors', () => {
    test('should report mismatch with name error', () => {
        const form = {
            name: 'A',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'different_password',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Passwords mismatch');
    });

    test('should report mismatch with bad password error', () => {
        const form = {
            ...validBaseForm,
            password: '123',
            confirmPassword: 'different'
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
        expect(result).toContain('Passwords mismatch');
    });

    test('should report mismatch with email error', () => {
        const form = {
            ...validBaseForm,
            email: 'noemail',
            password: 'pass123',
            confirmPassword: 'different_pass'
        };
        const result = validate(form);
        expect(result).toContain('Bad email');
        expect(result).toContain('Passwords mismatch');
    });

    test('should report all errors including mismatch', () => {
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

    test('should report short password and mismatch as separate errors', () => {
        const form = {
            ...validBaseForm,
            password: 'short',
            confirmPassword: 'different'
        };
        const result = validate(form);
        expect(result).toContain('Bad password');
        expect(result).toContain('Passwords mismatch');
        expect(result.length).toBe(2);
    });
});

// ============================================================================
// TEST SUITE: Parameterized Test Matrix
// ============================================================================

describe('validate() - Password Confirmation: Parameterized Matrix', () => {
    test.each([
        ['matching identical', 'password123', 'password123', false],
        ['matching special chars', 'P@ss!#$%', 'P@ss!#$%', false],
        ['matching spaces', 'pass word 123', 'pass word 123', false],
        ['matching unicode', 'Päss🔒123', 'Päss🔒123', false],
        ['matching null', null, null, false],
        ['matching undefined', undefined, undefined, false],
        ['matching empty', '', '', false],
        ['matching false', false, false, false],
        ['matching 0', 0, 0, false],
        ['completely different', 'password123', 'completely_different', true],
        ['differ by one char', 'password123', 'password124', true],
        ['differ in case', 'Password123', 'password123', true],
        ['differ in space', 'password123', 'password123 ', true],
        ['password and null', 'password123', null, true],
        ['null and password', null, 'password123', true],
        ['null and undefined', null, undefined, true],
        ['string and number', '123456', 123456, true],
        ['false and 0', false, 0, true],
        ['empty and false', '', false, true],
        ['leading space diff', ' password', 'password', true]
    ])(
        'passwords "%s" should %s contain "Passwords mismatch"',
        (description, password, confirmPassword, shouldError) => {
            const form = {
                name: 'John Doe',
                email: 'john@example.com',
                password: password,
                confirmPassword: confirmPassword,
                age: 25,
                phone: '1234567890'
            };
            const result = validate(form);

            if (shouldError) {
                expect(result).toContain('Passwords mismatch');
            } else {
                expect(result).not.toContain('Passwords mismatch');
            }
        }
    );
});

// ============================================================================
// TEST SUITE: Error Message Accuracy
// ============================================================================

describe('validate() - Password Confirmation: Error Message', () => {
    test('should return exact error message "Passwords mismatch"', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: 'different'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should not return typo error messages', () => {
        const form = {
            ...validBaseForm,
            password: 'pass1',
            confirmPassword: 'pass2'
        };
        const result = validate(form);
        expect(result).not.toContain('passwords mismatch');
        expect(result).not.toContain('Passwords Mismatch');
        expect(result).not.toContain('Password mismatch');
        expect(result).not.toContain('Mismatch');
    });

    test('error message should be case-sensitive', () => {
        const form = {
            ...validBaseForm,
            password: 'pass123',
            confirmPassword: 'pass456'
        };
        const result = validate(form);
        const hasExactError = result.some(e => e === 'Passwords mismatch');
        expect(hasExactError).toBe(true);
    });

    test('should not include extra text in error message', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: 'different_password'
        };
        const result = validate(form);
        const mismatchMsg = result.find(e => e.includes('mismatch'));
        expect(mismatchMsg).toBe('Passwords mismatch');
    });
});

// ============================================================================
// TEST SUITE: Consistency & Idempotency
// ============================================================================

describe('validate() - Password Confirmation: Consistency & Idempotency', () => {
    test('should consistently reject mismatched passwords', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: 'different'
        };
        const result1 = validate(form);
        const result2 = validate(form);
        const result3 = validate(form);

        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
        expect(result1).toContain('Passwords mismatch');
    });

    test('should consistently accept matching passwords', () => {
        const form = {
            ...validBaseForm,
            password: 'password123',
            confirmPassword: 'password123'
        };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).not.toContain('Passwords mismatch');
        expect(result2).not.toContain('Passwords mismatch');
    });

    test('should not modify input form', () => {
        const form = { ...validBaseForm };
        const formCopy = { ...form };
        validate(form);
        expect(form).toEqual(formCopy);
    });

    test('should handle different form objects with same passwords', () => {
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

    test('should be deterministic', () => {
        const forms = [
            { ...validBaseForm, password: 'pass1', confirmPassword: 'pass1' },
            { ...validBaseForm, password: 'pass1', confirmPassword: 'pass2' }
        ];

        const results1 = forms.map(f => validate(f));
        const results2 = forms.map(f => validate(f));

        expect(results1).toEqual(results2);
    });
});

// ============================================================================
// TEST SUITE: Rule Logic
// ============================================================================

describe('validate() - Password Confirmation: Rule Logic', () => {
    test('should use strict equality (===) not loose (==)', () => {
        // === is strict: checks type and value
        // == would coerce types
        const form = {
            ...validBaseForm,
            password: '123',
            confirmPassword: 123
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should check form.password parameter exists', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        // Form parameter is passed to rule
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should handle missing password property in form', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            confirmPassword: 'securePass123',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should return "Passwords mismatch" when comparison fails', () => {
        const form = {
            ...validBaseForm,
            password: 'pass1',
            confirmPassword: 'pass2'
        };
        // Rule: (v, form) => v === form.password || 'Passwords mismatch'
        // v is confirmPassword, form.password is password
        // They don't match, so returns 'Passwords mismatch'
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should return true when passwords match', () => {
        const form = {
            ...validBaseForm,
            password: 'samepass',
            confirmPassword: 'samepass'
        };
        // Rule: (v, form) => v === form.password || 'Passwords mismatch'
        // 'samepass' === 'samepass' => true
        // true is filtered out by filter(Boolean)
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });
});

// ============================================================================
// TEST SUITE: Edge Cases
// ============================================================================

describe('validate() - Password Confirmation: Edge Cases', () => {
    test('should handle very long matching passwords', () => {
        const longPass = 'A'.repeat(1000);
        const form = {
            ...validBaseForm,
            password: longPass,
            confirmPassword: longPass
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should handle very long mismatched passwords', () => {
        const pass1 = 'A'.repeat(1000);
        const pass2 = 'B'.repeat(1000);
        const form = {
            ...validBaseForm,
            password: pass1,
            confirmPassword: pass2
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should handle passwords with only differences at end', () => {
        const form = {
            ...validBaseForm,
            password: 'password123abc',
            confirmPassword: 'password123abd'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should handle passwords with only differences at start', () => {
        const form = {
            ...validBaseForm,
            password: 'apassword123',
            confirmPassword: 'bpassword123'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should handle passwords differing in middle', () => {
        const form = {
            ...validBaseForm,
            password: 'passXword123',
            confirmPassword: 'passYword123'
        };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should handle empty form object', () => {
        const form = {
            name: 'John',
            email: 'test@test.com',
            password: undefined,
            confirmPassword: undefined,
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });
});
