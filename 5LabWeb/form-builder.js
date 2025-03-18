function buildForm(formId, formConfig) {
    const form = document.getElementById(formId);
    
    formConfig.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-field';
        
        if (field.label && field.elemtype !== 'check') {
            const label = document.createElement('label');
            label.textContent = field.label;
            if (field.required) {
                label.innerHTML += ' <span class="required">*</span>';
            }
            div.appendChild(label);
        }
        
        let element;
        switch(field.elemtype) {
            case 'text1line':
                element = document.createElement('input');
                element.type = 'text';
                element.name = field.name;
                if (field.width) element.style.width = field.width + 'px';
                break;
                
            case 'email':
                element = document.createElement('input');
                element.type = 'email';
                element.name = field.name;
                if (field.width) element.style.width = field.width + 'px';
                break;
                
            case 'tel':
                element = document.createElement('input');
                element.type = 'tel';
                element.name = field.name;
                if (field.width) element.style.width = field.width + 'px';
                break;
                
            case 'number':
                element = document.createElement('input');
                element.type = 'number';
                element.name = field.name;
                if (field.min) element.min = field.min;
                if (field.max) element.max = field.max;
                if (field.width) element.style.width = field.width + 'px';
                break;
                
            case 'textarea':
                element = document.createElement('textarea');
                element.name = field.name;
                if (field.rows) element.rows = field.rows;
                if (field.cols) element.cols = field.cols;
                break;
                
            case 'select':
                element = document.createElement('select');
                element.name = field.name;
                if (field.options) {
                    field.options.forEach(option => {
                        const optElement = document.createElement('option');
                        optElement.value = option.value;
                        optElement.textContent = option.text;
                        element.appendChild(optElement);
                    });
                }
                break;
                
            case 'check':
                element = document.createElement('input');
                element.type = 'checkbox';
                element.name = field.name;
                element.id = field.name;

                if (field.label) {
                    const label = document.createElement('label');
                    label.htmlFor = field.name;
                    label.textContent = field.label;
                    if (field.required) {
                        label.innerHTML += ' <span class="required">*</span>';
                    }
                    div.appendChild(element);
                    div.appendChild(label);
                    div.appendChild(document.createElement('br'));
                }
                break;
                
            case 'button':
                element = document.createElement('input');
                element.type = 'button';
                element.value = field.value;
                element.addEventListener('click', function() {
                    validateForm(formId, formConfig);
                });
                break;
        }
        
        if (element) {
            if (field.elemtype !== 'button') {
                element.addEventListener('change', function() {
                    validateField(this, field, formConfig);
                });
            }
            
            if (field.elemtype !== 'check') {
                div.appendChild(element);
            }
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = 'error-' + field.name;
        div.appendChild(errorDiv);
        
        form.appendChild(div);
    });
}