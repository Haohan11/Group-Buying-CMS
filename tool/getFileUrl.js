export const getFileUrl = (event) => {
    const [file] = event.target.files;
    return file && URL.createObjectURL(file);
}