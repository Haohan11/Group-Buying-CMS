import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

const createAdapter = ({ addImage }) => (loader) => ({
  upload: async () => {
    const file = await loader.file;
    const src = URL.createObjectURL(file);

    typeof addImage === "function" && addImage({ file, src });

    return {
      default: src,
    };
  },
})

const createPlugin = (option) =>
  function (editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = createAdapter(option);
  };

function CustomEditor({ addImage, onChange, initialData }) {
  return (
    <CKEditor
      editor={Editor}
      config={{ extraPlugins: [createPlugin({ addImage })] }}
      data={initialData}
      {...(typeof onChange === "function" && { onChange })}
    />
  );
}

export default CustomEditor;
