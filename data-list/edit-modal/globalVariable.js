export const hoistFormik = {
  formik: null,
  set(target) {
    this.formik = target;
  },
  get() {
    return this.formik;
  },
  clear() {
    this.formik = null;
  },
};

export const hoistPreLoadData = {
  data: null,
  set(target) {
    return (this.data = target);
  },
  get() {
    return this.data;
  },
  clear() {
    this.data = null;
  },
};
