export const getPublicInfo = (req,res)=>{
    return res.status(200).json({
        restaurant_name: "Marta's Secret Kitchen",
    operating_hours: "11:00 AM - 10:30 PM (Tue-Sun)",
    address: "Bladr Runner, Sector 2049",
    message: "Welcome! This information is public and open to everyone."
    })
};