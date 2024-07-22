import { useEffect } from "react";
import dynamic from "next/dynamic";

import { InputLabel } from "./input";
import { hoistFormik } from "../globalVariable";

const CustomEditor = dynamic(
  () => {
    return import("@/components/custom-editor");
  },
  { ssr: false }
);

let imageKeeper = [];
const EditorField = (props) => {
  const addImage = ({ file, src }) => {
    imageKeeper.push({ id: src, file, ori: file.name });
    hoistFormik.get().setFieldValue(`${props.name}_preview`, imageKeeper);
    hoistFormik.get().setFieldValue(
      `${props.name}_image`,
      imageKeeper.map(({ file }) => file)
    );
  };

  const onChange = (event, editor) => {
    const data = editor.getData();
    hoistFormik.get().setFieldValue(props.name, data);

    const removeImages = event.source.differ._cachedChangesWithGraveyard.reduce(
      (dict, item) =>
        item.type === "remove" && item.name === "imageBlock"
          ? dict.concat(item.attributes.get("src"))
          : dict,
      []
    );

    if (removeImages.length === 0) return;

    const newValue = imageKeeper.filter(({ id }) => !removeImages.includes(id));

    const persistImage =
      hoistFormik.get().values[`${props.name}_image_persist`];
    hoistFormik
      .get()
      .setFieldValue(
        `${props.name}_image_persist`,
        Array.isArray(persistImage)
          ? persistImage.filter(
              (path) =>
                removeImages.findIndex((url) => url.includes(path)) === -1
            )
          : []
      );

    imageKeeper = newValue;

    hoistFormik.get().setFieldValue(`${props.name}_preview`, newValue);

    hoistFormik.get().setFieldValue(
      `${props.name}_image`,
      newValue.map(({ file }) => file)
    );
  };

  useEffect(() => () => (imageKeeper = []), []);

  return (
    <div>
      <InputLabel text={props.label} required={props.required} />
      <CustomEditor
        {...{
          addImage,
          onChange,
          initialData: hoistFormik.get().values[props.name],
        }}
      />
    </div>
  );
};

export default EditorField;
