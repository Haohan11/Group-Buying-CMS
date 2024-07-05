import { useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

const editorConfiguration = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "imageCaption",
    "imageUpload",
    "blockQuote",
    "insertTable",
    "mediaEmbed",
    "undo",
    "redo",
  ],
};

function MyUploadAdapter(loader) {
  console.log("myloader :", loader);
  let fileName;
  return {
    upload: () => {
      return new Promise(async (resolve, reject) => {
        const file = await loader.file;
        const src = URL.createObjectURL(file);
        return resolve({
          default: src,
        });
        // try {
        //   const file = await loader.file;
        //   const data = new FormData();
        //   data.append("file", file);
        //   data.append("type", "insert");
        //   data.append("upload_root_path", "storage/question");
        //   console.log("MyUploadAdapter data", data);
        //   const response = await fetch(
        //     `${publicRuntimeConfig.apiUrl}/question/file_upload`,
        //     {
        //       method: "POST",
        //       body: data,
        //       headers: {
        //         Authorization: `Bearer ${token}`,
        //       },
        //     }
        //   );
        //   const result = await response.json();
        //   console.log("MyUploadAdapter result", result);
        //   fileName = result[0].name;
        //   if (result[0].name) {
        //     resolve({
        //       default: `${publicRuntimeConfig.url}/storage/question/${result[0].name}`,
        //     });
        //     setImageFile((prev) => {
        //       return (fileRef.current = [
        //         ...prev,
        //         { image: result[0].name, status: true },
        //       ]);
        //     });
        //   } else {
        //     resolve(new Error(result.error || "Upload failed"));
        //     // new Error(result.error || "Upload failed");
        //   }
        // } catch (error) {
        //   console.log(error);
        //   reject(error);
        // }
      });
    },
    abort: () => {
      console.log("filename", fileName);
      return new Promise(async (resolve, reject) => {
        try {
          const data = new FormData();
          data.append("master_id", "");
          data.append("file_id", fileName);
          data.append("type", "delete");
          data.append("upload_root_path", "storage/question");
          const response = await fetch(
            `${publicRuntimeConfig.apiUrl}/question/file_upload`,
            {
              method: "POST",
              body: data,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("MyUploadAdapter result", response);
          const result = await response.json();
          console.log("MyUploadAdapter result", result);
          resolve();
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
  };
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = MyUploadAdapter;
}

function CustomEditor(props) {
  return (
    <CKEditor
      editor={Editor}
      config={{extraPlugins: [MyCustomUploadAdapterPlugin]}}
      data={props.initialData}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
      }}
    />
  );
}

export default CustomEditor;
