const uploadImage = (req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({ success: 0, message: "File not uploaded" });
        }
        return res.json({
            success: 1,
            image_url: `https://archaic-vogue-backend.onrender.com/images/${req.file.filename}`,
          })
    } catch (err) {
        console.error("Error during file upload", err.message);
        res.status(500).json({ success: 0, message: "Internal server error" });
    }
};

export {uploadImage}