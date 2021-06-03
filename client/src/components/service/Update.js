import { useState } from "react";

const Uploader = ({ pictureSelected, button }) => {
  const [preview, setPreview] = useState(null);

  const handlePicture = async (e) => {
    // Web API. see documentation from MDN
    pictureSelected(e);
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <>
      <input
        name="selectPic"
        type="file"
        id="upload"
        onChange={handlePicture}
      />
      {button}
      {preview && (
        <div className="img-preview-buy">
          <img src={preview} alt="icon" />
        </div>
      )}
    </>
  );
};

export default Uploader;
