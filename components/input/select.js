import ReactSelect from "react-select";

const selectStyles = {
  multiValueLabel: (base, { data }) => ({
    ...base,
    color: data.color || "white",
    paddingLeft: "10px",
  }),
  multiValue: (base, { data }) => {
    return {
      ...base,
      color: data.color || "white",
      backgroundColor: data.backgroundColor || "#499FEF",
      borderRadius: "7px",
      marginRight: "5px",
    };
  },
  multiValueRemove: (base) => ({
    ...base,
    ":hover": {
      backgroundColor: "#0D3089",
      borderRadius: "0 7px 7px 0",
    },
  }),
};

const mockOptions = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const Select = ({ options = mockOptions, ...props }) => {
  return <ReactSelect styles={selectStyles} options={options} {...props} />;
};

export default Select;
