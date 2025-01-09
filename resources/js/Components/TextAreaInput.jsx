const TextAreaInput = ({
    id,
    name,
    value,
    onChange,
    className = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
    rows = 4, // Default number of rows
    ...props
}) => (
    <textarea
        id={id}
        name={name}
        value={value || ""} // Ensures controlled component
        onChange={onChange}
        className={className}
        rows={rows}
        {...props}
    />
);

export default TextAreaInput;
