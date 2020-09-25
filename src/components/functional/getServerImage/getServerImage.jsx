import { imageStore } from "../../../config";
import defaultImages from "../../../imgs/placeholders";

const DisplayServerImage = ({ image_id }) => {
  if (image_id) return imageStore + image_id;
  return defaultImages.default01;
};

export default DisplayServerImage;
