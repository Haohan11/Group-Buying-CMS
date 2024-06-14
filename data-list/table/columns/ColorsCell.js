const ColorsCell = ({ colorList }) => (
  <div className="d-flex flex-column">
    {Array.isArray(colorList) && colorList.map(color => <div className="badge badge-secondary mb-2 align-self-start" key={color.id}>{color.name}</div>)}
  </div>
)

export { ColorsCell }
