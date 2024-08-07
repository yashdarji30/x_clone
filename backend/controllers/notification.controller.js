import Notification from "../models/notification.model.js";

export const getNotifications = async (req,res) => {
    try{
        const userId = req.user._id;

        const notifications = await Notification.find({to:userId})
        .populate({
            path:"from",
            select: "username profileImg",
        });

        await Notification.updateMany({to:userId},{read:true});

        res.status(200).json(notifications);
    }
    catch(error){
        console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });

    }
};

export const deleteNotifications = async (req,res) => {
    try{
        const userId = req.user._id;
        await Notification.deleteMany({to:userId});

        res.status(200).json({message:"Notifications deleted successfully"});
    }catch(error){
        console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });      
    }
}

export const deleteOneNotifications = async (req,res) => {
    try{
        const notification = req.params.id;
        const userId = req.user._id;
        await Notification.findById({to:userId});

        if(!notification){
            return res.status(404).json({message:"Notification not found"});
        }

        if(notification.to.toString() !== userId.toString()){
            return res.status(403).json({message:"Unauthorized"});
        }

        await Notification.findByIdAndDelete(notification);

        res.status(200).json({message:"Notification deleted successfully"});
    }catch(error){
        console.log("Error in deleteNotification function", error.message);
		res.status(500).json({ error: "Internal Server Error" });      
    }
}
