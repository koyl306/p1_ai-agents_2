function validate(form) {
    var errors = [];
    if (!form.name || form.name.length < 2) {
        errors.push('Bad name');
    }
    if (!form.email || form.email.indexOf('@') == -1) {
        errors.push('Bad email');
    }
    if (!form.password || form.password.length < 6) {
        errors.push('Bad password');
    }
    if (form.password != form.confirmPassword) {
        errors.push('Passwords mismatch');
    }
    if (!form.age || form.age < 18 || form.age > 120) {
        errors.push('Bad age');
    }
    if (!form.phone || !/^\d{10}$/.test(form.phone)) {
        errors.push('Bad phone');
    }
    return errors;
}