import packageInfo from "@/package.json";  

const { version } = packageInfo;

const VersionCode = () => (
  <span>
    版本號: {version}
  </span>
);

export default VersionCode;
