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
            if (inputElement) {
                inputElement.value = '';
            }

            const fieldName = action.dataset.field;
            if (fieldName && state[fieldName] !== undefined) {
                state[fieldName] = '';
            }
        }

        console.log('State:', state);

        return data.filter(row => {
            if (state.totalFrom && state.totalFrom.toString().trim() !== '') {
                const numRow = parseFloat(row.total);
                const numFilter = parseFloat(state.totalFrom);
                if (isNaN(numRow) || isNaN(numFilter) || numRow < numFilter) {
                    return false;
                }
            }
            
            if (state.totalTo && state.totalTo.toString().trim() !== '') {
                const numRow = parseFloat(row.total);
                const numFilter = parseFloat(state.totalTo);
                if (isNaN(numRow) || isNaN(numFilter) || numRow > numFilter) {
                    return false;
                }
            }
            
            const otherState = { ...state };
            delete otherState.totalFrom;
            delete otherState.totalTo;
            
            Object.keys(otherState).forEach(key => {
                if (!otherState[key] || otherState[key].toString().trim() === '') {
                    delete otherState[key];
                }
            });
            
            if (Object.keys(otherState).length > 0) {
                return compare(row, otherState);
            }
            
            return true;
        });
    }
}