export const getProfile = (req,res)=>{

    const authHeader = req.headers.authorization;
// Check For existence and Bearer Prefix

if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json(
        {
            error:'Acces token required'
        }
    );
}
const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json(
        { error: 'Access token required' }
    );
  }

return res.status(200).json(
    {
        message:'Authorization header detected. Ready for cyrptographic verification in Stage 3'
    }
);
};