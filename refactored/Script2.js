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