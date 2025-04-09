const Business = require('../models/businessModel');
const User = require('../models/userModel');
const { GridFSBucket } = require('mongodb');

const addBusiness = async (req, res) => {
    try {
        const { name, category, location, description, contactInfo, logo } = req.body;
        const owner = req.user.id;
        const newBusiness = new Business({ name, category, location, description, contactInfo, owner, logo: {
          filename: logo.filename,
          url: logo.url,
          key: logo.key
        } });

        //prevents adding duplicates
        const existingBusiness = await Business.findOne({ name, owner });
        if (existingBusiness) {
            return res.status(400).json({ message: `Duplicate Record: Business already exists` });
        }

        await newBusiness.save();

        res.status(201).json({ message: `New Business Registered` });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: `Business ID required` });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: `Business not found` });
    }

    // Check if the requester is the owner or admin
    const userId = req.user.id;
    const userRole = req.user.role;

    if (business.owner.toString() !== userId && userRole !== 'Admin') {
      return res.status(403).json({ message: `You are not allowed to update this business` });
    }

    const updatableFields = ['name', 'description', 'category', 'location', 'contactInfo'];

    updatableFields.forEach((field) => {
      if (req.body[field]) {
        business[field] = req.body[field];
      }
    });

    // ✅ Handle new logo from UploadThing
    if (req.body.logo && req.body.logo.url && req.body.logo.key) {
      // Optional: delete old logo from UploadThing if needed using their API
      business.logo = {
        url: req.body.logo.url,
        key: req.body.logo.key,
      };
    }

    await business.save();
    res.status(200).json({ message: "Business updated successfully", business });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

  

  const viewBusinessByID = async (req, res) => {
    try {
      const { id } = req.params;
  
      const Biz = await Business.findOne({ _id: id }).populate("owner", "username");
  
      if (!Biz) {
        return res.status(404).json({ message: `Business not found` });
      }
  
      res.status(200).json({ message: `Welcome to ${Biz.name} page`, Biz });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };
  


const viewBusinesses = async (req, res) => {
    try {
        let { page = 1, limit = 9 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const totalBusinesses = await Business.countDocuments();
        if(totalBusinesses === 0) {
            return res.status(404).json({message: `Businesses not found`});
        }
        const businesses = await Business.find()
            .sort({ _id: -1 }) // Newest first
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            totalBusinesses,
            businesses,
            page,
            limit,
            totalPages: Math.ceil(totalBusinesses/limit)
        });
        
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}


//yet to be tested
const deleteBusinessByID = async (req, res) => {
    try {
      const { id } = req.params;
  
      const delBiz = await Business.findById(id);
      if (!delBiz) {
        return res.status(404).json({ message: "Business not found" });
      }
  
      await Business.findByIdAndDelete(id);
      res.status(200).json({ message: "Business deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };

const filteredBusinessView = async (req, res) => {
    try {
        const { name, category, username, state, address, page = 1, limit = 9 } = req.query;
      
        filter = {}

        if(name) {
            filter.name = {$regex: name, $options: "i"};
        }
        if(category) {
            filter.category = category;
        }
        if (username) {
            const matchedUsers = await User.find({
                username: { $regex: username, $options: "i" }
            }).select('_id');

            const matchedIds = matchedUsers.map(user => user._id);
            filter.owner = { $in: matchedIds };
        }
        if(state) {
            filter["location.state"] =  {$regex: state, $options: "i" };
        }
        if(address) {
            filter["location.address"] = {$regex: address, $options: "i" };
        }
        
        const businesses = await Business.find(filter)
            .sort({ _id: -1 }) // Newest first
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('owner', 'username');

        const count = await Business.countDocuments(filter);
        if( count === 0 ){
            return res.status(404).json({message: 'No businesses found for the applied filters. Try Again!'});
        }

        res.status(200).json({
            count,
            businesses,
            page,
            limit,
            totalPages: Math.ceil(count/limit)

        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

const uploadLogo = async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      console.log("Uploaded file:", req.file);
      const updated = await Business.findByIdAndUpdate(
        req.params.id,
        {
          logo: {
            filename: req.file.filename,
            fileId: req.file.id,
          },
        },
        { new: true }
      );
  
      if (!updated) return res.status(404).json({ error: "Business not found" });
  
      res.status(200).json({ message: "Logo uploaded successfully", logo: updated.logo });
    } catch (err) {
      console.error("Upload Logo Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  // Delete Logo
  const deleteLogo = async (req, res) => {
    try {
      const business = await Business.findById(req.params.id);
      if (!business || !business.logo?.fileId) {
        return res.status(404).json({ error: "Logo not found" });
      }
  
      const db = mongoose.connection.db;
      const bucket = new GridFSBucket(db, { bucketName: "logos" });
  
      await bucket.delete(business.logo.fileId);
  
      business.logo = undefined;
      await business.save();
  
      res.status(200).json({ message: "Logo deleted successfully" });
    } catch (err) {
      console.error("Delete Logo Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };


module.exports = { addBusiness, updateBusiness, viewBusinessByID, viewBusinesses ,deleteBusinessByID, filteredBusinessView, uploadLogo, deleteLogo };