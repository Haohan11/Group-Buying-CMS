const currentTable = {
  tableName: null,
  set(name) {
    this.tableName = name;
  },
  get() {
    return this.tableName;
  },
};

export default currentTable;
