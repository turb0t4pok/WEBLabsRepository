document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleAddFormBtn');
    const formContainer = document.getElementById('addWeaponFormContainer');
    const addForm = document.getElementById('addWeaponForm');
    const cancelBtn = document.getElementById('cancelAddFormBtn');

    toggleBtn.addEventListener('click', () => {
        formContainer.classList.add('visible');
        toggleBtn.style.display = 'none';
    });

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        formContainer.classList.remove('visible');
        toggleBtn.style.display = 'block';
        addForm.reset();
    });

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(addForm);
        const weaponData = {
            name: formData.get('name'),
            price: formData.get('price'),
            description: formData.get('description') || '',
            category: formData.get('category') || 'Другое',
            manufacturer: formData.get('manufacturer') || 'Неизвестно'
        };

        if (!weaponData.name || !weaponData.price) {
            alert('Пожалуйста, заполните название и цену');
            return;
        }

        try {
            const response = await fetch('/api/weapons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(weaponData)
            });
            
            if (response.ok) {
                addForm.reset();
                formContainer.classList.remove('visible');
                toggleBtn.style.display = 'block';
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || 'Ошибка при добавлении товара');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении');
        }
    });
});

function toggleEditForm(id) {
    const form = document.getElementById(`editForm-${id}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function deleteWeapon(id) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        try {
            const response = await fetch(`/api/weapons/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Ошибка при удалении товара');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при удалении');
        }
    }
}

async function updateWeapon(event, id) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const weaponData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`/api/weapons/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(weaponData)
        });
        
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Ошибка при обновлении товара');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при обновлении');
    }
}