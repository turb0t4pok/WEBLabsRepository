function validateField(field, fieldConfig, formConfig) {
    const errorElement = document.getElementById('error-' + field.name);
    errorElement.textContent = '';
    
    const value = field.type === 'checkbox' ? field.checked : field.value;
    const errors = [];

    if (fieldConfig.required && !value) {
        errors.push('Это поле обязательно для заполнения');
    }

    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push('Введите корректный email');
    }

    if (field.type === 'tel' && value && !/^\+?[\d\s\-()]{10,}$/.test(value)) {
        errors.push('Введите корректный номер телефона');
    }

    if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (fieldConfig.min !== undefined && numValue < fieldConfig.min) {
            errors.push(`Минимальное значение: ${fieldConfig.min}`);
        }
        if (fieldConfig.max !== undefined && numValue > fieldConfig.max) {
            errors.push(`Максимальное значение: ${fieldConfig.max}`);
        }
    }

    if (field.tagName === 'SELECT' && fieldConfig.required && (!value || value === '')) {
        errors.push('Необходимо сделать выбор');
    }

    if (field.name === 'licenseAgreement' && !field.checked) {
        errors.push('Необходимо подтвердить право на владение оружием');
    }
    
    if (errors.length > 0) {
        errorElement.textContent = errors.join(', ');
        return false;
    }
    
    return true;
}

function validateForm(formId, formConfig) {
    const form = document.getElementById(formId);
    let isValid = true;
    
    formConfig.forEach(fieldConfig => {
        if (fieldConfig.elemtype === 'button') return;
        
        const field = form.elements[fieldConfig.name];
        if (!validateField(field, fieldConfig, formConfig)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        alert('Форма успешно отправлена!');

    } else {
        alert('Пожалуйста, исправьте ошибки в форме');
    }
    return isValid;
}