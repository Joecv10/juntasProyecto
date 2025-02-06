export const capitalizeEachWord = (str) => {
    return str
        .split(" ")
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
};

export const createSelectOptionsFormatter = (valueKey, labelKey) => (array) =>
    array.map((item) => ({
        value: item[valueKey],
        label: item[labelKey],
    }));

export const onChangeHandler = (fieldId) => (event) => {
    setData(fieldId, event.target.value);
};
