const Seller = require("../../model/sellerModel")

const stepOneValidation = async (req, res, next) => {
  try {

   
    const { email } = req.body
   

    const existingSeller = await Seller.find({ email })

    if (existingSeller.length != 0) {
    
      return res.status(409).json({
        message: "Email already exist",
        error: false,
        success: true
      })
    }

  

    res.status(200).json({      
      message: "email varification success",
      error: false,
      success: true
    })
  } catch (error) {
    next(error)
  }

}

const stepTwoValidation = async (req, res,next) => {

  try {

    
    const { pan, gstinNumber, phone } = req.body

   if(!pan || !gstinNumber || !phone){
    return res.status(400).json({
      message:"All fields are required",
      error:true,
      success:false
    })
   }
    const existingSeller = await Seller.find({
      $or: [
         {pan:pan} ,
        {phone:phone} ,
       {gstinNumber: gstinNumber }
      ]
    })

    if (existingSeller.length > 0) {

      const existingFields = [];


      existingSeller.forEach(seller => {
        if (seller.pan === pan) {
          existingFields.push('pan');
        }
        if (seller.phone === phone) {
          existingFields.push('phone');
        }
        if (seller.gstinNumber === gstinNumber) {
          existingFields.push('gstinNumber');
        }
      });
    
    

      return res.status(409).json({
        message: "Some fields are already in use",
        error: false,
        success: false,
        data:existingFields
      })


    }

    res.status(200).json({
      message: "verification success",
      error: false,
      success: true
    })




  } catch (error) {
    next(error)
  }


}

module.exports = {stepOneValidation,stepTwoValidation}
