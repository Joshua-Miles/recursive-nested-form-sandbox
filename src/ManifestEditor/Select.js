export function Select({ options, onSelect }) {
    return (
        <select onChange={e => onSelect(e.target.value)}>
            <option >Select</option>
            {options.map(option => (
                <option key={option}>{option}</option>
            ))}
        </select>
    )
} 