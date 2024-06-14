const ColorSchemeCell = ({ colorScheme }) => (
  <div>
    {Array.isArray(colorScheme) && colorScheme.map(scheme => <div className="badge badge-light-primary me-1" key={scheme.id}>{scheme.name}</div>)}
  </div>
)

export { ColorSchemeCell }
