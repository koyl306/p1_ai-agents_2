// Jest Test Suite: Age Validation Tests for Script3.js
// Focus: under 18, over 120, and valid boundaries (18, 120)

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
// TEST SUITE: Age Validation - Valid Ages
// ============================================================================

describe('validate() - Age Validation: Valid Ages', () => {
    test('should accept valid age 25', () => {
        const form = validBaseForm;
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should return empty errors for valid age form', () => {
        const form = validBaseForm;
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should accept minimum age boundary 18', () => {
        const form = { ...validBaseForm, age: 18 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept maximum age boundary 120', () => {
        const form = { ...validBaseForm, age: 120 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept age 19 (just above minimum)', () => {
        const form = { ...validBaseForm, age: 19 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept age 119 (just below maximum)', () => {
        const form = { ...validBaseForm, age: 119 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept age in middle of range', () => {
        const form = { ...validBaseForm, age: 50 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept age 65', () => {
        const form = { ...validBaseForm, age: 65 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept age 100', () => {
        const form = { ...validBaseForm, age: 100 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept age as decimal 25.5', () => {
        const form = { ...validBaseForm, age: 25.5 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept age as decimal 18.0 (minimum)', () => {
        const form = { ...validBaseForm, age: 18.0 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept age as decimal 120.0 (maximum)', () => {
        const form = { ...validBaseForm, age: 120.0 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should accept various valid ages', () => {
        const validAges = [18, 21, 30, 40, 50, 65, 75, 100, 110, 120];
        validAges.forEach(age => {
            const form = { ...validBaseForm, age };
            const result = validate(form);
            expect(result).not.toContain('Bad age');
        });
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Under 18 (Invalid)
// ============================================================================

describe('validate() - Age Validation: Under 18 (Invalid)', () => {
    test('should reject age 17 (just below minimum)', () => {
        const form = { ...validBaseForm, age: 17 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should report only age error for age 17', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 17,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad age']);
    });

    test('should reject age 0', () => {
        const form = { ...validBaseForm, age: 0 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject negative age -5', () => {
        const form = { ...validBaseForm, age: -5 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject age 1', () => {
        const form = { ...validBaseForm, age: 1 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject age 10', () => {
        const form = { ...validBaseForm, age: 10 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject age as decimal below 18', () => {
        const form = { ...validBaseForm, age: 17.9 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject various ages under 18', () => {
        const underAges = [0, 1, 5, 10, 15, 16, 17];
        underAges.forEach(age => {
            const form = { ...validBaseForm, age };
            const result = validate(form);
            expect(result).toContain('Bad age');
        });
    });

    test('should be first error when age under 18 in valid form', () => {
        const form = {
            name: 'Jane',
            email: 'jane@test.com',
            password: 'pass123',
            confirmPassword: 'pass123',
            age: 16,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result[4]).toBe('Bad age');
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Over 120 (Invalid)
// ============================================================================

describe('validate() - Age Validation: Over 120 (Invalid)', () => {
    test('should reject age 121 (just above maximum)', () => {
        const form = { ...validBaseForm, age: 121 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should report only age error for age 121', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 121,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad age']);
    });

    test('should reject age 125', () => {
        const form = { ...validBaseForm, age: 125 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject age 150', () => {
        const form = { ...validBaseForm, age: 150 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject age 999', () => {
        const form = { ...validBaseForm, age: 999 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject age 1000', () => {
        const form = { ...validBaseForm, age: 1000 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject age as decimal above 120', () => {
        const form = { ...validBaseForm, age: 120.1 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject various ages over 120', () => {
        const overAges = [121, 125, 150, 200, 500, 1000];
        overAges.forEach(age => {
            const form = { ...validBaseForm, age };
            const result = validate(form);
            expect(result).toContain('Bad age');
        });
    });

    test('should be in errors when age over 120 in valid form', () => {
        const form = {
            name: 'Jane',
            email: 'jane@test.com',
            password: 'pass123',
            confirmPassword: 'pass123',
            age: 150,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Boundary Conditions
// ============================================================================

describe('validate() - Age Validation: Boundary Conditions', () => {
    test('should have minimum boundary at 18', () => {
        const age17 = { ...validBaseForm, age: 17 };
        const age18 = { ...validBaseForm, age: 18 };

        expect(validate(age17)).toContain('Bad age');
        expect(validate(age18)).not.toContain('Bad age');
    });

    test('should have maximum boundary at 120', () => {
        const age120 = { ...validBaseForm, age: 120 };
        const age121 = { ...validBaseForm, age: 121 };

        expect(validate(age120)).not.toContain('Bad age');
        expect(validate(age121)).toContain('Bad age');
    });

    test('should use >= 18 (not >)', () => {
        const form = { ...validBaseForm, age: 18 };
        // age >= 18 should be true for 18
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should use <= 120 (not <)', () => {
        const form = { ...validBaseForm, age: 120 };
        // age <= 120 should be true for 120
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should reject age below 18 (including 17.99)', () => {
        const ages = [0, 1, 10, 17, 17.5, 17.99];
        ages.forEach(age => {
            const form = { ...validBaseForm, age };
            expect(validate(form)).toContain('Bad age');
        });
    });

    test('should reject age above 120 (including 120.01)', () => {
        const ages = [120.01, 120.1, 121, 150, 1000];
        ages.forEach(age => {
            const form = { ...validBaseForm, age };
            expect(validate(form)).toContain('Bad age');
        });
    });

    test('should have valid range from 18 to 120 inclusive', () => {
        const validAges = [18, 30, 50, 75, 100, 120];
        validAges.forEach(age => {
            const form = { ...validBaseForm, age };
            expect(validate(form)).not.toContain('Bad age');
        });
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Empty/Null/Undefined Values
// ============================================================================

describe('validate() - Age Validation: Empty/Null/Undefined', () => {
    test('should reject null age', () => {
        const form = { ...validBaseForm, age: null };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject undefined age', () => {
        const form = { ...validBaseForm, age: undefined };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject false as age', () => {
        const form = { ...validBaseForm, age: false };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject 0 as age', () => {
        const form = { ...validBaseForm, age: 0 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject missing age property', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should handle empty object age', () => {
        const form = { ...validBaseForm, age: {} };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should handle empty array as age', () => {
        const form = { ...validBaseForm, age: [] };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Type Coercion
// ============================================================================

describe('validate() - Age Validation: Type Coercion', () => {
    test('should reject string age "25"', () => {
        const form = { ...validBaseForm, age: '25' };
        const result = validate(form);
        // '25' >= 18 is true (string comparison), '25' <= 120 is false
        expect(result).toContain('Bad age');
    });

    test('should accept number age 25', () => {
        const form = { ...validBaseForm, age: 25 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should handle NaN age', () => {
        const form = { ...validBaseForm, age: NaN };
        const result = validate(form);
        // NaN >= 18 is false, so fails
        expect(result).toContain('Bad age');
    });

    test('should handle Infinity age', () => {
        const form = { ...validBaseForm, age: Infinity };
        const result = validate(form);
        // Infinity >= 18 is true, but Infinity <= 120 is false
        expect(result).toContain('Bad age');
    });

    test('should handle negative Infinity age', () => {
        const form = { ...validBaseForm, age: -Infinity };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject boolean true as age', () => {
        const form = { ...validBaseForm, age: true };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should use numeric comparison (not string comparison)', () => {
        const form = { ...validBaseForm, age: 25 };
        // 25 >= 18 && 25 <= 120 should be true
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Multiple Errors
// ============================================================================

describe('validate() - Age Validation: Multiple Errors', () => {
    test('should report age error with name error', () => {
        const form = {
            name: 'A',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 17,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Bad age');
    });

    test('should report age error with phone error', () => {
        const form = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: 150,
            phone: '123'
        };
        const result = validate(form);
        expect(result).toContain('Bad age');
        expect(result).toContain('Bad phone');
    });

    test('should report all errors including age error', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 200,
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

    test('should include age error in form with multiple invalid fields', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: 'short',
            confirmPassword: 'short',
            age: 15,
            phone: 'invalid'
        };
        const result = validate(form);
        expect(result).toContain('Bad age');
        expect(result.length).toBeGreaterThan(1);
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Parameterized Test Matrix
// ============================================================================

describe('validate() - Age Validation: Parameterized Matrix', () => {
    test.each([
        ['minimum boundary 18', 18, false],
        ['above minimum 19', 19, false],
        ['young adult 21', 21, false],
        ['middle range 50', 50, false],
        ['senior 65', 65, false],
        ['very old 100', 100, false],
        ['maximum boundary 120', 120, false],
        ['just below min 17', 17, true],
        ['child 10', 10, true],
        ['infant 1', 1, true],
        ['zero age', 0, true],
        ['negative age -5', -5, true],
        ['just above max 121', 121, true],
        ['old 150', 150, true],
        ['very old 999', 999, true],
        ['decimal valid 25.5', 25.5, false],
        ['decimal boundary 18.0', 18.0, false],
        ['decimal boundary 120.0', 120.0, false],
        ['decimal invalid 17.9', 17.9, true],
        ['decimal invalid 120.1', 120.1, true],
        ['null', null, true],
        ['undefined', undefined, true],
        ['false', false, true],
        ['zero', 0, true],
        ['string number "25"', '25', true],
        ['NaN', NaN, true],
        ['Infinity', Infinity, true]
    ])(
        'age %s should %s contain "Bad age"',
        (description, age, shouldError) => {
            const form = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'securePass123',
                confirmPassword: 'securePass123',
                age: age,
                phone: '1234567890'
            };
            const result = validate(form);

            if (shouldError) {
                expect(result).toContain('Bad age');
            } else {
                expect(result).not.toContain('Bad age');
            }
        }
    );
});

// ============================================================================
// TEST SUITE: Age Validation - Error Message
// ============================================================================

describe('validate() - Age Validation: Error Message', () => {
    test('should return exact error message "Bad age"', () => {
        const form = { ...validBaseForm, age: 17 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should not return typo error messages', () => {
        const form = { ...validBaseForm, age: 150 };
        const result = validate(form);
        expect(result).not.toContain('bad age');
        expect(result).not.toContain('Bad Age');
        expect(result).not.toContain('Invalid age');
        expect(result).not.toContain('Age error');
    });

    test('error message should be case-sensitive', () => {
        const form = { ...validBaseForm, age: 10 };
        const result = validate(form);
        const hasExactError = result.some(e => e === 'Bad age');
        expect(hasExactError).toBe(true);
    });

    test('should not include extra text in error message', () => {
        const form = { ...validBaseForm, age: 0 };
        const result = validate(form);
        const ageError = result.find(e => e.includes('age'));
        expect(ageError).toBe('Bad age');
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Consistency & Idempotency
// ============================================================================

describe('validate() - Age Validation: Consistency & Idempotency', () => {
    test('should consistently reject age 17', () => {
        const form = { ...validBaseForm, age: 17 };
        const result1 = validate(form);
        const result2 = validate(form);
        const result3 = validate(form);

        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
        expect(result1).toContain('Bad age');
    });

    test('should consistently accept age 50', () => {
        const form = { ...validBaseForm, age: 50 };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).not.toContain('Bad age');
        expect(result2).not.toContain('Bad age');
    });

    test('should consistently reject age 121', () => {
        const form = { ...validBaseForm, age: 121 };
        const result1 = validate(form);
        const result2 = validate(form);

        expect(result1).toEqual(result2);
        expect(result1).toContain('Bad age');
    });

    test('should not modify input form', () => {
        const form = { ...validBaseForm };
        const formCopy = { ...form };
        validate(form);
        expect(form).toEqual(formCopy);
    });

    test('should handle different form objects with same age', () => {
        const form1 = { ...validBaseForm, age: 25 };
        const form2 = { ...validBaseForm, age: 25 };

        const result1 = validate(form1);
        const result2 = validate(form2);

        expect(result1).toEqual(result2);
    });

    test('should be deterministic across multiple calls', () => {
        const forms = [
            { ...validBaseForm, age: 18 },
            { ...validBaseForm, age: 17 },
            { ...validBaseForm, age: 120 },
            { ...validBaseForm, age: 121 }
        ];

        const results1 = forms.map(f => validate(f));
        const results2 = forms.map(f => validate(f));

        expect(results1).toEqual(results2);
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Rule Logic
// ============================================================================

describe('validate() - Age Validation: Rule Logic', () => {
    test('should use >= 18 comparison (not >)', () => {
        const form = { ...validBaseForm, age: 18 };
        // age >= 18 should be true for 18
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should use <= 120 comparison (not <)', () => {
        const form = { ...validBaseForm, age: 120 };
        // age <= 120 should be true for 120
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should use AND (&&) logic for range check', () => {
        // Valid: age >= 18 AND age <= 120
        const validForm = { ...validBaseForm, age: 50 };
        expect(validate(validForm)).not.toContain('Bad age');

        // Invalid: age < 18 (fails first part)
        const tooYoung = { ...validBaseForm, age: 10 };
        expect(validate(tooYoung)).toContain('Bad age');

        // Invalid: age > 120 (fails second part)
        const tooOld = { ...validBaseForm, age: 150 };
        expect(validate(tooOld)).toContain('Bad age');
    });

    test('should fail when age < 18', () => {
        const form = { ...validBaseForm, age: 17 };
        // 17 >= 18 is false, so (false && ...) is false
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should fail when age > 120', () => {
        const form = { ...validBaseForm, age: 121 };
        // 121 <= 120 is false, so (... && false) is false
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should return "Bad age" on validation failure', () => {
        const form = { ...validBaseForm, age: 0 };
        // Rule: v >= 18 && v <= 120 || 'Bad age'
        // (false && ...) || 'Bad age' => 'Bad age'
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should return true on validation success', () => {
        const form = { ...validBaseForm, age: 25 };
        // Rule: v >= 18 && v <= 120 || 'Bad age'
        // true && true => true (filtered out by filter(result !== true))
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Edge Cases
// ============================================================================

describe('validate() - Age Validation: Edge Cases', () => {
    test('should handle very large valid age within range', () => {
        const form = { ...validBaseForm, age: 119.9999 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should handle very small valid age at boundary', () => {
        const form = { ...validBaseForm, age: 18.0001 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should handle negative ages below zero', () => {
        const negativeAges = [-1000, -100, -10, -1];
        negativeAges.forEach(age => {
            const form = { ...validBaseForm, age };
            expect(validate(form)).toContain('Bad age');
        });
    });

    test('should handle form with only age invalid', () => {
        const form = {
            name: 'Jane Doe',
            email: 'jane@test.com',
            password: 'securePass123',
            confirmPassword: 'securePass123',
            age: -5,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad age']);
    });

    test('should handle decimal ages precisely', () => {
        const form1 = { ...validBaseForm, age: 17.99999 };
        const form2 = { ...validBaseForm, age: 18.00001 };

        expect(validate(form1)).toContain('Bad age');
        expect(validate(form2)).not.toContain('Bad age');
    });

    test('should handle consecutive age validations', () => {
        const ages = [18, 19, 50, 100, 120];
        const results = ages.map(age => {
            const form = { ...validBaseForm, age };
            return validate(form);
        });

        results.forEach(result => {
            expect(result).not.toContain('Bad age');
        });
    });
});

// ============================================================================
// TEST SUITE: Age Validation - Integration with runValidation
// ============================================================================

describe('validate() - Age Validation: runValidation Integration', () => {
    test('runValidation should filter out true results', () => {
        const result = runValidation(25, schema.age, validBaseForm);
        // 25 >= 18 && 25 <= 120 => true, filtered out
        expect(result).toEqual([]);
    });

    test('runValidation should keep error message results', () => {
        const result = runValidation(10, schema.age, validBaseForm);
        // 10 >= 18 is false, so returns 'Bad age'
        expect(result).toContain('Bad age');
    });

    test('runValidation should filter boolean true not error strings', () => {
        const result = runValidation(50, schema.age, validBaseForm);
        // Valid age returns true, which is filtered out
        expect(result).not.toContain(true);
        expect(result.length).toBe(0);
    });

    test('runValidation should work through validate function', () => {
        const form = { ...validBaseForm, age: 25 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });
});
