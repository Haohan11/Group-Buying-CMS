import { version } from "@/package.json";  

const VersionCode = () => (
  <span>
    版本號: {version}
  </span>
);

export default VersionCode;
