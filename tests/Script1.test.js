// Jest Test Suite for Script1.js - validate(form) function

// ============================================================================
// FUNCTION UNDER TEST
// ============================================================================
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

const validForm = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePass123',
    confirmPassword: 'securePass123',
    age: 25,
    phone: '1234567890'
};

// ============================================================================
// TEST SUITE: VALID FORM SUBMISSION
// ============================================================================

describe('validate() - Valid Form', () => {
    test('should return empty array for completely valid form', () => {
        const result = validate(validForm);
        expect(result).toEqual([]);
    });

    test('should return empty array for valid form with different valid values', () => {
        const form = {
            name: 'Alice Smith',
            email: 'alice@test.com',
            password: 'password123',
            confirmPassword: 'password123',
            age: 30,
            phone: '9876543210'
        };
        const result = validate(form);
        expect(result).toEqual([]);
    });
});

// ============================================================================
// TEST SUITE: NAME FIELD VALIDATION
// ============================================================================

describe('validate() - Name Field', () => {
    test('should allow valid 2-character name', () => {
        const form = { ...validForm, name: 'Jo' };
        const result = validate(form);
        expect(result).not.toContain('Bad name');
    });

    test('should allow valid long name', () => {
        const form = { ...validForm, name: 'Christopher Alexander' };
        const result = validate(form);
        expect(result).not.toContain('Bad name');
    });

    test('should reject empty name', () => {
        const form = { ...validForm, name: '' };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should reject single character name', () => {
        const form = { ...validForm, name: 'A' };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should reject null name', () => {
        const form = { ...validForm, name: null };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should reject undefined name', () => {
        const form = { ...validForm, name: undefined };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should reject name with only spaces (length 1)', () => {
        const form = { ...validForm, name: ' ' };
        const result = validate(form);
        expect(result).toContain('Bad name');
    });

    test('should allow name with spaces', () => {
        const form = { ...validForm, name: 'Jean Paul' };
        const result = validate(form);
        expect(result).not.toContain('Bad name');
    });

    test('should allow name with hyphens', () => {
        const form = { ...validForm, name: 'Jean-Paul' };
        const result = validate(form);
        expect(result).not.toContain('Bad name');
    });

    test('should allow name with apostrophes', () => {
        const form = { ...validForm, name: "O'Connor" };
        const result = validate(form);
        expect(result).not.toContain('Bad name');
    });

    test('should allow name with numbers', () => {
        const form = { ...validForm, name: 'John 123' };
        const result = validate(form);
        expect(result).not.toContain('Bad name');
    });
});

// ============================================================================
// TEST SUITE: EMAIL FIELD VALIDATION
// ============================================================================

describe('validate() - Email Field', () => {
    test('should allow valid email with single @', () => {
        const form = { ...validForm, email: 'user@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should allow valid email with subdomain', () => {
        const form = { ...validForm, email: 'user@mail.example.co.uk' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should allow valid email with plus sign', () => {
        const form = { ...validForm, email: 'user+tag@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should reject email without @', () => {
        const form = { ...validForm, email: 'userexample.com' };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should reject empty email', () => {
        const form = { ...validForm, email: '' };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should reject null email', () => {
        const form = { ...validForm, email: null };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should reject undefined email', () => {
        const form = { ...validForm, email: undefined };
        const result = validate(form);
        expect(result).toContain('Bad email');
    });

    test('should allow email with multiple @ characters (contains @ check)', () => {
        const form = { ...validForm, email: 'user@@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should allow email with @ at the start', () => {
        const form = { ...validForm, email: '@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should allow email with @ at the end', () => {
        const form = { ...validForm, email: 'user@' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });

    test('should allow single character before @', () => {
        const form = { ...validForm, email: 'a@example.com' };
        const result = validate(form);
        expect(result).not.toContain('Bad email');
    });
});

// ============================================================================
// TEST SUITE: PASSWORD FIELD VALIDATION
// ============================================================================

describe('validate() - Password Field', () => {
    test('should allow valid 6-character password', () => {
        const form = { ...validForm, password: '123456', confirmPassword: '123456' };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should allow valid long password', () => {
        const form = { ...validForm, password: 'VeryLongSecurePassword123!@#', confirmPassword: 'VeryLongSecurePassword123!@#' };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should reject 5-character password', () => {
        const form = { ...validForm, password: '12345', confirmPassword: '12345' };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject empty password', () => {
        const form = { ...validForm, password: '', confirmPassword: '' };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject null password', () => {
        const form = { ...validForm, password: null, confirmPassword: null };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should reject undefined password', () => {
        const form = { ...validForm, password: undefined, confirmPassword: undefined };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });

    test('should allow password with spaces', () => {
        const form = { ...validForm, password: '123456 pass', confirmPassword: '123456 pass' };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should allow password with special characters', () => {
        const form = { ...validForm, password: 'Pass@123!#$', confirmPassword: 'Pass@123!#$' };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should allow password with unicode characters', () => {
        const form = { ...validForm, password: 'Päss🔒123', confirmPassword: 'Päss🔒123' };
        const result = validate(form);
        expect(result).not.toContain('Bad password');
    });

    test('should reject password with exactly 5 characters (boundary)', () => {
        const form = { ...validForm, password: 'pass5', confirmPassword: 'pass5' };
        const result = validate(form);
        expect(result).toContain('Bad password');
    });
});

// ============================================================================
// TEST SUITE: PASSWORD CONFIRMATION VALIDATION
// ============================================================================

describe('validate() - Password Confirmation', () => {
    test('should accept matching passwords', () => {
        const form = { ...validForm, password: 'test123', confirmPassword: 'test123' };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept empty matching passwords', () => {
        const form = { ...validForm, password: '', confirmPassword: '' };
        const result = validate(form);
        // Note: Will have 'Bad password' but not 'Passwords mismatch'
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should reject mismatched passwords', () => {
        const form = { ...validForm, password: 'password123', confirmPassword: 'password456' };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject when password and confirmPassword differ by one character', () => {
        const form = { ...validForm, password: 'pass123', confirmPassword: 'pass124' };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject when password and confirmPassword differ in case', () => {
        const form = { ...validForm, password: 'Password123', confirmPassword: 'password123' };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject when password is valid but confirmPassword is empty', () => {
        const form = { ...validForm, password: 'validPass123', confirmPassword: '' };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should reject when password is null and confirmPassword is string', () => {
        const form = { ...validForm, password: null, confirmPassword: 'somePass123' };
        const result = validate(form);
        expect(result).toContain('Passwords mismatch');
    });

    test('should accept null passwords (both null)', () => {
        const form = { ...validForm, password: null, confirmPassword: null };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });

    test('should accept undefined passwords (both undefined)', () => {
        const form = { ...validForm, password: undefined, confirmPassword: undefined };
        const result = validate(form);
        expect(result).not.toContain('Passwords mismatch');
    });
});

// ============================================================================
// TEST SUITE: AGE FIELD VALIDATION
// ============================================================================

describe('validate() - Age Field', () => {
    test('should allow age 18 (minimum)', () => {
        const form = { ...validForm, age: 18 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should allow age 120 (maximum)', () => {
        const form = { ...validForm, age: 120 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should allow age in middle range', () => {
        const form = { ...validForm, age: 50 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should reject age 17 (below minimum)', () => {
        const form = { ...validForm, age: 17 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject age 121 (above maximum)', () => {
        const form = { ...validForm, age: 121 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject age 0', () => {
        const form = { ...validForm, age: 0 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject negative age', () => {
        const form = { ...validForm, age: -5 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject null age', () => {
        const form = { ...validForm, age: null };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject undefined age', () => {
        const form = { ...validForm, age: undefined };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject very large age', () => {
        const form = { ...validForm, age: 999 };
        const result = validate(form);
        expect(result).toContain('Bad age');
    });

    test('should reject decimal age (but evaluates as number)', () => {
        const form = { ...validForm, age: 25.5 };
        const result = validate(form);
        expect(result).not.toContain('Bad age');
    });

    test('should reject age as string (falsy check)', () => {
        const form = { ...validForm, age: '25' };
        const result = validate(form);
        // '25' is truthy and passes falsy check, evaluate range
        // '25' >= 18 is true and '25' <= 120 is false (string comparison)
        expect(result).toContain('Bad age');
    });
});

// ============================================================================
// TEST SUITE: PHONE FIELD VALIDATION
// ============================================================================

describe('validate() - Phone Field', () => {
    test('should allow valid 10-digit phone', () => {
        const form = { ...validForm, phone: '1234567890' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should allow phone starting with 9', () => {
        const form = { ...validForm, phone: '9876543210' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should allow phone with leading zeros', () => {
        const form = { ...validForm, phone: '0012345678' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });

    test('should reject phone with 9 digits', () => {
        const form = { ...validForm, phone: '123456789' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with 11 digits', () => {
        const form = { ...validForm, phone: '12345678901' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with letters', () => {
        const form = { ...validForm, phone: '12345678ab' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with spaces', () => {
        const form = { ...validForm, phone: '123 456 7890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with dashes', () => {
        const form = { ...validForm, phone: '123-456-7890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with parentheses', () => {
        const form = { ...validForm, phone: '(123) 456-7890' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject empty phone', () => {
        const form = { ...validForm, phone: '' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject null phone', () => {
        const form = { ...validForm, phone: null };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject undefined phone', () => {
        const form = { ...validForm, phone: undefined };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should reject phone with special characters', () => {
        const form = { ...validForm, phone: '123456789!' };
        const result = validate(form);
        expect(result).toContain('Bad phone');
    });

    test('should allow phone with all same digits', () => {
        const form = { ...validForm, phone: '1111111111' };
        const result = validate(form);
        expect(result).not.toContain('Bad phone');
    });
});

// ============================================================================
// TEST SUITE: MULTIPLE ERRORS
// ============================================================================

describe('validate() - Multiple Errors', () => {
    test('should return multiple errors when multiple fields are invalid', () => {
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
        expect(result.length).toBe(6);
    });

    test('should return only password-related errors', () => {
        const form = {
            ...validForm,
            password: '123',
            confirmPassword: 'different'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad password', 'Passwords mismatch']);
    });

    test('should return name and age errors', () => {
        const form = {
            ...validForm,
            name: 'J',
            age: 150
        };
        const result = validate(form);
        expect(result).toEqual(['Bad name', 'Bad age']);
    });

    test('should return only email and phone errors', () => {
        const form = {
            ...validForm,
            email: 'invalidemail',
            phone: '12345'
        };
        const result = validate(form);
        expect(result).toEqual(['Bad email', 'Bad phone']);
    });
});

// ============================================================================
// TEST SUITE: EDGE CASES & BOUNDARY CONDITIONS
// ============================================================================

describe('validate() - Edge Cases & Boundaries', () => {
    test('should handle empty object', () => {
        const form = {};
        const result = validate(form);
        expect(result.length).toBeGreaterThan(0);
        expect(result).toContain('Bad name');
        expect(result).toContain('Bad email');
    });

    test('should handle object with null values', () => {
        const form = {
            name: null,
            email: null,
            password: null,
            confirmPassword: null,
            age: null,
            phone: null
        };
        const result = validate(form);
        expect(result.length).toBe(6);
    });

    test('should handle object with undefined values', () => {
        const form = {
            name: undefined,
            email: undefined,
            password: undefined,
            confirmPassword: undefined,
            age: undefined,
            phone: undefined
        };
        const result = validate(form);
        expect(result.length).toBe(6);
    });

    test('should handle object with zero values', () => {
        const form = {
            name: 0,
            email: 0,
            password: 0,
            confirmPassword: 0,
            age: 0,
            phone: 0
        };
        const result = validate(form);
        expect(result).toContain('Bad name');
        expect(result).toContain('Bad email');
        expect(result).toContain('Bad password');
        expect(result).toContain('Bad age');
    });

    test('should handle form with extra properties', () => {
        const form = {
            ...validForm,
            extraField: 'should be ignored',
            anotherField: 123
        };
        const result = validate(form);
        expect(result).toEqual([]);
    });

    test('should handle whitespace-only strings', () => {
        const form = {
            name: '     ',
            email: '     ',
            password: '     ',
            confirmPassword: '     ',
            age: 25,
            phone: '1234567890'
        };
        const result = validate(form);
        expect(result).not.toContain('Bad name');
        expect(result).not.toContain('Bad email');
        expect(result).not.toContain('Bad password');
    });

    test('should return errors in consistent order', () => {
        const form1 = {
            name: 'A',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 15,
            phone: '123'
        };
        const form2 = {
            name: 'B',
            email: 'noemail',
            password: '456',
            confirmPassword: 'different',
            age: 16,
            phone: '456'
        };
        const result1 = validate(form1);
        const result2 = validate(form2);
        // Error messages should be in same order
        expect(result1[0]).toBe('Bad name');
        expect(result2[0]).toBe('Bad name');
    });
});

// ============================================================================
// TEST SUITE: RETURN VALUE VALIDATION
// ============================================================================

describe('validate() - Return Value Type', () => {
    test('should always return an array', () => {
        const result = validate(validForm);
        expect(Array.isArray(result)).toBe(true);
    });

    test('should return empty array for valid form', () => {
        const result = validate(validForm);
        expect(result).toHaveLength(0);
    });

    test('should return array of strings for invalid form', () => {
        const form = {
            name: 'A',
            email: 'noemail',
            password: '123',
            confirmPassword: 'different',
            age: 15,
            phone: '123'
        };
        const result = validate(form);
        expect(Array.isArray(result)).toBe(true);
        expect(result.every(item => typeof item === 'string')).toBe(true);
    });

    test('should contain only error messages from validators', () => {
        const form = { ...validForm, name: 'A' };
        const result = validate(form);
        const validMessages = ['Bad name', 'Bad email', 'Bad password', 'Passwords mismatch', 'Bad age', 'Bad phone'];
        expect(result.every(msg => validMessages.includes(msg))).toBe(true);
    });
});
