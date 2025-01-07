import { capitalizeEachWord } from "../../utilFunctions/functions.js";

const SelectComponent = ({
    id,
    name,
    value,
    onChange,
    options,
    className = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
    required = false,
    disabled = false,
    placeholder = "",
}) => {
    return (
        <>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={className}
                required={required}
                disabled={disabled}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {capitalizeEachWord(option.label)}
                    </option>
                ))}
            </select>
        </>
    );
};

export default SelectComponent;
