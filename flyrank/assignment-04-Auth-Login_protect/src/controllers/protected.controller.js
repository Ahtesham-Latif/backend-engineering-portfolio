import  {AuthService} from '../services/auth.service.js';

export const getProfile = async (req,res)=>{

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

   try{
    // Verify the token using AuthService
    const user = await AuthService.verifyToken(token);
    // If verification is successful, return the user profile
    return res.status(200).json(
        {
            message: 'Staff identity verified successfully',
            user : {
                id: user.id,
                email: user.email,
                metadata: user.user_metadata,
                last_sign_in_at: user.last_sign_in_at
            }
        }
     );
  }
  
  catch (error) {
    // If verification fails, return an error response
    return res.status(401).json({ error: error.message });
  }
};