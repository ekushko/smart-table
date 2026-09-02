import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        )
    });

    return (data, state, action) => {
        if (action && action.name === 'clear') {
            const inputElement = action.parentElement.querySelector('.input');
            inputElement.value = '';

            const fieldName = action.dataset.field;
            if (fieldName && state[fieldName] !== undefined) {
                state[fieldName] = '';
            }
        }
        return data.filter(row => compare(row, state));
    }
}