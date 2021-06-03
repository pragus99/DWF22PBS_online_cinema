const Uploader = ({ pictureSelected, button }) => {
  const handlePicture = async (e) => {
    // Web API. see documentation from MDN
    pictureSelected(e);
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
    </>
  );
};

export default Uploader;
