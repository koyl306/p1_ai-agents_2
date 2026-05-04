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