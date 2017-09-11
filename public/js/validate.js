function Factory(selector) {
    let elements;
    (selector instanceof HTMLElement) ? elements = [selector] :
        elements = document.querySelectorAll(selector);
    return new Selectors(elements);
};

function Selectors(elements) {
    this.elements = elements;
    let self = this;

    this.validPlaceholder = (nameAttribute) => {
        let msg = ['Put your name', 'Put your room'];

        self.elements.forEach((item, i) => {
            if (i === 0)
                item.setAttribute(nameAttribute, msg[0]);
            if (i === 1)
                item.setAttribute(nameAttribute, msg[1]);
        });
        return self;
    };
};

window.onload = function () {
    let fi = Factory('.form__input');
    let name = document.getElementById('name');
    let form = document.forms.firstForm;
    let inp = document.querySelectorAll('.form__input');
    let btn = document.querySelector('input[type=submit]');
    let wrapper = document.querySelector('.centered-form__form');

    form.addEventListener('submit', ev => {
        inp.forEach((item, i) => {
            if (item.value === '') {
                ev.preventDefault();

                item.classList.add('error');
                fi.validPlaceholder('placeholder');
            }
            return item;
        });
    });
    
    form.addEventListener('focusin', ev => {
        let target = ev.target;
        let msg = ['Enter Name', 'Enter Room Name'];
        
        switch (target.getAttribute('name')) {
            case 'name': {
                target.setAttribute('placeholder', msg[0]);
                break;
            }
            case 'room': {
                target.setAttribute('placeholder', msg[1]);
                break;
            }
        }
        if (target.getAttribute('tabindex'))
        target.classList.remove('error');
    });
    
    form.addEventListener('focusout', () => {
        inp.forEach((item, i) => {
            if (item.value === '') {
                item.classList.add('error');
                fi.validPlaceholder('placeholder', 'error');
            }
        });
    });
};