const Input = ({ name, type, props }) => {
  return (
    <input
      id={name}
      name={name}
      type={type}
      autoComplete={type}
      required
      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      onChange={props.handleChange}
      onBlur={props.handleBlur}
      value={props.values.name}
    />
  )
}
export default Input
