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

export const getDashboard = async (req, res) => {
  return res.status(200).json({
    vault_status: 'UNLOCKED',
    clearance: 'MARTA + Officer K // CHEF-LEVEL ACCESS',
    authenticated_staff: req.user.email,

    classified_recipes: [
      {
        code: 'RECIPE-BIR-007',
        dish_name: 'Operation Biryani',
        secret_steps: [
          'Layer the rice like classified evidence',
          'Protect the masala at all costs',
          'Never deploy without raita'
        ]
      },
      {
        code: 'RECIPE-KAR-008',
        dish_name: 'Desi Fire Chicken Karahi',
        secret_steps: [
          'Heat the karahi until the situation escalates',
          'Deploy tomatoes, ginger and green chillies',
          'Finish with enough dhaniya to restore peace'
        ]
      },
      {
        code: 'RECIPE-PAS-009',
        dish_name: 'MARTA x Officer K Garlic Parmesan Pasta',
        secret_steps: [
          'Initiate garlic protocol',
          'Flood the system with parmesan',
          'Add cream until emotional stability is restored'
        ]
      },
      {
        code: 'RECIPE-PIZ-010',
        dish_name: 'Emergency Cheese Pizza',
        secret_steps: [
          'Deploy maximum cheese',
          'Ignore all nutritional warnings',
          'Consume immediately after production incidents'
        ]
      },
      {
        code: 'RECIPE-FRY-011',
        dish_name: 'Classified Loaded Fries',
        secret_steps: [
          'Stack fries beyond reasonable limits',
          'Deploy cheese without mercy',
          'Sauce until the vault is compromised'
        ]
      },
      {
        code: 'RECIPE-LVC-012',
        dish_name: 'Forbidden Chocolate Lava Cake',
        secret_steps: [
          'Maintain chocolate integrity',
          'Do not overcook the core',
          'Release lava only under MARTA authorization'
        ]
      }
    ]
  });
}