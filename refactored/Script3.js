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